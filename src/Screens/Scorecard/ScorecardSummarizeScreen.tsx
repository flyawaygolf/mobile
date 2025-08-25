import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View, Platform } from "react-native";
import { Text, Appbar, Card, Icon, Button, Dialog, Portal, Menu, Divider } from "react-native-paper";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";
import ViewShot from "react-native-view-shot";

import StatsCarousel from "./StatsCarousel";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { ShrinkEffect } from "../../Components/Effects";
import { Avatar } from "../../Components/Member";
import DisplayUserScoreCard from "../../Components/Scorecards/DisplayUserScoreCard";
import { Loader } from "../../Other";
import { getContrastColor, handleToast, navigationProps, ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { CompetitionFormatEnum } from "../../Services/Client/Managers/Interfaces/Events";
import { scoreCardInterface, scorecardTeeboxInterface } from "../../Services/Client/Managers/Interfaces/Golf";
import { GameModeEnum, getUserScoreCardInterface, HoleScorecardSchemaInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { displayHCP } from "../../Services/handicapNumbers";
import { full_width } from "../../Style/style";


const getScoreToPar = (score: number, par: number) => {
    if (!score || !par) return "-";
    const diff = score - par;
    if (diff === 0) return "E";
    if (diff > 0) return `+${diff}`;
    return `${diff}`;
};

const sumScore = (holes: HoleScorecardSchemaInterface[]) => holes?.reduce((sum, h) => sum + (h.score ?? 0), 0) ?? 0;

const ScorecardSummarizeScreen = ({ route }: ScreenNavigationProps<ScorecardStackParams, "ScorecardSummarizeScreen">) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client } = useClient();
    const navigation = useNavigation<navigationProps>();
    const scorecardRef = useRef<ViewShot>(null);
    const { user_scorecard_id, fromList, user_id } = route.params;

    const [userScoreCard, setUserScoreCard] = useState<getUserScoreCardInterface | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false);

    useEffect(() => {
        if (user_scorecard_id) {
            client.userScoreCards.fetchOne(user_id, user_scorecard_id).then(response => {
                if (response.error) return handleToast(t(`errors.${response.error.code}`));
                if (response.data) setUserScoreCard(response.data);
            });
        }
    }, [user_scorecard_id, user_id]);

    if (!userScoreCard) return (
        <SafeBottomContainer>
            <Appbar.Header style={{
                width: full_width,
                borderBottomColor: colors.bg_secondary,
                borderBottomWidth: 1,
                marginBottom: 10,
                paddingRight: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Appbar.Action icon={fromList ? "arrow-left" : "home"} onPress={() => fromList ? navigation.goBack() : navigation.navigate("BottomNavigation", {
                    screen: "ScorecardHomeScreen"
                })} />
            </Appbar.Header>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 }}>
                <Loader />
            </View>
        </SafeBottomContainer>
    );

    const { golf_info, grid_info, teebox_info, holes, name, playing_date, total_score, players } = userScoreCard;
    const parArray = grid_info?.par ?? [];
    // Correction : s'assurer que scoreArr est toujours un tableau
    const scoreArr: HoleScorecardSchemaInterface[] = Array.isArray(holes) ? holes : [];
    // Détection du nombre de trous réellement joués
    const filledScores = scoreArr.filter(h => typeof h.score === "number" && h.score > 0) ?? [];
    const holesPlayed = filledScores.length;

    // Si la carte n'est pas totalement remplie, on prend le score_total renseigné
    // Sinon, on le calcule sur les trous joués
    let totalScore: number;
    if (holesPlayed === 0) {
        totalScore = total_score ?? 0;
    } else if (filledScores.length === 9 || filledScores.length === 18) {
        // Score partiel (ex: 9 trous)
        totalScore = filledScores.reduce((sum, h) => sum + (h.score ?? 0), 0);
    } else {
        // Score complet
        totalScore = total_score ?? 0;
    }

    // Calcul du par correspondant aux trous joués
    let totalPar: number;
    if (holesPlayed === 0) {
        totalPar = parArray.reduce((sum, val) => sum + val, 0);
    } else if (filledScores.length === 9 || filledScores.length === 18) {
        // Prend le par des trous joués
        const playedIndexes = holes
            .map((h, i) => (typeof h.score === "number" && h.score > 0 ? i : -1))
            .filter(i => i !== -1);
        totalPar = playedIndexes.reduce((sum, idx) => sum + (parArray[idx] ?? 0), 0);
    } else {
        totalPar = parArray.reduce((sum, val) => sum + val, 0);
    }

    // Nouveau leaderboard
    let leaderboard: any[] = [];
    if (players && players.length > 0) {
        leaderboard = players.map(p => {
            const score = sumScore(p.scorecard_info.holes);
            return { ...p, score };
        }).sort((a, b) => a.score - b.score);
    } else if (userScoreCard.user_info && holes) {
        // Cas solo : on affiche le joueur principal
        leaderboard = [{
            user_info: userScoreCard.user_info,
            scorecard_info: {
                user_scorecard_id: userScoreCard.user_scorecard_id,
                holes: holes,
                teebox_info: teebox_info
            },
            score: totalScore
        }];
    }

    // Calculateur de HCP
    let hcpCalc = null;
    // Utiliser le score et le par des trous joués (partiel ou complet)
    if (teebox_info?.slope && teebox_info?.rating && totalPar && holesPlayed > 0) {
        // Formule WHS simplifiée
        const score = totalScore;
        // Pour le rating, si la partie est partielle, on peut ajuster le rating proportionnellement
        // (optionnel, dépend de la logique métier, ici on fait un simple ratio)
        let rating = teebox_info.rating;
        if (holesPlayed < holes.length && holes.length > 0) {
            rating = Math.round((teebox_info.rating / holes.length) * holesPlayed * 10) / 10;
        }
        const slope = teebox_info.slope;
        // HCP = (Score - Rating) * 113 / Slope
        const hcpValue = ((score - rating) * 113) / slope;
        hcpCalc = {
            score, par: totalPar, slope, rating,
            value: Math.round(hcpValue * 10) / 10
        };
    }

    const navigateToScorecard = (params: {
        golf: {
            name: string;
            golf_id: string;
        },
        scorecard: scoreCardInterface,
        grid: {
            grid_id: string;
            par: number[];
            handicap: number[];
        },
        teebox: scorecardTeeboxInterface,
        game_mode: GameModeEnum,
        format: CompetitionFormatEnum,
        holes: HoleScorecardSchemaInterface[],
        playing_date: Date,
        starting_hole: number,
        name: string,
    }) => {
        navigation.navigate("ScorecardStack", {
            screen: "ScorecardFullScreen",
            params: params
        });
    }

    const deleteScorecard = async () => {
        setShowDeleteModal(false);
        const request = await client.userScoreCards.delete(user_scorecard_id);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) {
            navigation.navigate("ScorecardStack", {
                screen: "ScorecardListScreen"
            });
        }
    };

    const modifyScorecard = async () => {
        navigation.navigate("ScorecardStack", {
            screen: "ScorecardHoleFillScreen",
            params: {
                golf: golf_info,
                scorecard: userScoreCard,
                grid: grid_info,
                teebox: teebox_info,
                game_mode: userScoreCard.format,
                format: userScoreCard.format,
                playing_date: playing_date,
                starting_hole: userScoreCard.starting_hole,
                name: name,
                user_scorecard_id: userScoreCard.user_scorecard_id,
                hole: holes
            }
        });
    }

    const downloadScorecard = async () => {
        try {
            const uri = await scorecardRef.current?.capture?.();
            if (uri) {
                if (Platform.OS === "android") {
                    const camera = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                    if (camera !== RESULTS.GRANTED) await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                    if (camera !== RESULTS.LIMITED) await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                }

                await CameraRoll.saveAsset(uri, {
                    type: "photo",
                    album: "FlyAway"
                })
                handleToast(t(`commons.success`))
            }
        } catch (error) {
            handleToast(`${error}`);
        }
    };

    const SharePostScorecard = async () => {
        setShareModalVisible(false);
        navigation.navigate("CreateStack", {
            screen: "PostCreatorScreen",
            params: {
                attached_user_scorecard: userScoreCard,
                initContent: `${userScoreCard.name} : \n${userScoreCard.total_score}`,
            }
        })
    };

    return (
        <SafeBottomContainer>
            {/* Header inchangé */}
            <Appbar.Header style={{
                borderBottomColor: colors.bg_secondary,
                borderBottomWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Appbar.Action icon={fromList ? "arrow-left" : "home"} onPress={() => fromList ? navigation.goBack() : navigation.navigate("BottomNavigation", {
                        screen: "ScorecardHomeScreen"
                    })} />
                    <ShrinkEffect onPress={() => golf_info?.golf_id && navigation.navigate("GolfsStack", {
                        screen: "GolfsProfileScreen",
                        "params": { golf_id: golf_info.golf_id }
                    })} style={{ flexDirection: "row", alignItems: "center", gap: 5, marginLeft: 5, width: "60%" }} >
                        <Avatar url={client.golfs.avatar(golf_info?.golf_id ?? "")} />
                        <View>
                            <Text numberOfLines={1} variant="titleMedium">{golf_info?.name ?? "-"}</Text>
                            <Text  numberOfLines={1}>{name}</Text>
                        </View>
                        <Appbar.Action icon={"chevron-right"} />
                    </ShrinkEffect>
                </View>
                <View>
                    <Menu
                        visible={shareModalVisible}
                        onDismiss={() => setShareModalVisible(false)}
                        anchor={<Appbar.Action icon="share-variant" onPress={() => setShareModalVisible(true)} />}
                    >
                        <Menu.Item leadingIcon="image" onPress={() => downloadScorecard()} title={t("scorecard.download")} />
                        <Divider />
                        <Menu.Item leadingIcon="share" onPress={() => SharePostScorecard()} title={t("scorecard.share_post")} />
                    </Menu>
                </View>
            </Appbar.Header>
            <ScrollView style={{ flex: 1, paddingHorizontal: 8 }}>
                {/* Carte de score style image, overlay sombre, texte blanc, flat */}
                <ViewShot ref={scorecardRef} options={{ format: "png", quality: 0.9 }}>
                    <DisplayUserScoreCard scorecard={userScoreCard} />
                </ViewShot>

                {/* Leaderboard style flat, épuré */}
                <Card style={{
                    marginBottom: 18,
                    borderRadius: 18,
                    elevation: 1,
                    backgroundColor: colors.bg_secondary,
                    padding: 0,
                }}>
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 16, paddingBottom: 6 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10, gap: 5 }}>
                            <Icon source="trophy" color={colors.color_orange} size={20} />
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{t("scorecard.leaderboard")}</Text>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 16,
                        paddingRight: 16,
                        paddingBottom: 6
                    }}>
                        <Text style={{ width: 28, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>#</Text>
                        <Text style={{ flex: 2, color: colors.text_muted, fontWeight: "bold" }}>{t("scorecard.player")}</Text>
                        <Text style={{ width: 60, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.teebox")}</Text>
                        <Text style={{ width: 60, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.score")}</Text>
                        <Text style={{ width: 50, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.to_par")}</Text>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        {leaderboard.length === 0 && (
                            <Text style={{ color: colors.text_muted, fontStyle: "italic", padding: 16 }}>{t("scorecard.no_players")}</Text>
                        )}
                        {leaderboard.map((p, idx) => {
                            const user = p.user_info || {};
                            const teebox = p.scorecard_info?.teebox_info || {};
                            const teeboxColor = teebox.color?.hexadecimalRgbCode ?? colors.color_grey;
                            const score = typeof p.score === "number" ? p.score : sumScore(p.scorecard_info?.holes ?? []);
                            const scoreToPar = getScoreToPar(score, totalPar ?? 0);
                            return (
                                <ShrinkEffect
                                    onPress={() => navigateToScorecard({
                                        golf: golf_info ?? {
                                            name: "",
                                            golf_id: ""
                                        },
                                        format: p.scorecard_info?.format,
                                        game_mode: p.scorecard_info?.game_mode,
                                        grid: grid_info ?? {
                                            grid_id: "",
                                            par: [],
                                            handicap: []
                                        },
                                        holes: p.scorecard_info?.holes,
                                        name: userScoreCard.name ?? "",
                                        playing_date: playing_date ?? new Date(),
                                        starting_hole: p.scorecard_info?.starting_hole,
                                        scorecard: p.scorecard_info,
                                        teebox: teebox,
                                    })}
                                    key={user.user_id ?? idx}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: colors.bg_primary_opacity,
                                        borderRadius: 12,
                                        marginHorizontal: 12,
                                        marginVertical: 8,
                                        padding: 8,
                                    }}
                                >
                                    <Text style={{
                                        width: 28,
                                        fontWeight: "bold",
                                        fontSize: 16,
                                        textAlign: "center",
                                    }}>{idx + 1}</Text>
                                    <View style={{ width: 32, alignItems: "center", justifyContent: "center" }}>
                                        <Avatar
                                            url={client.user.avatar(user.user_id, user.avatar)}
                                            size={32}
                                            radius={8}
                                        />
                                    </View>
                                    <View style={{ flex: 2, justifyContent: "center" }}>
                                        <Text style={{
                                            fontWeight: "bold",
                                            fontSize: 15,
                                            marginBottom: 2,
                                            flexShrink: 1,
                                        }}>
                                            {user.username ?? "-"}
                                        </Text>
                                        <Text style={{
                                            color: colors.text_muted,
                                            fontSize: 12,
                                            marginBottom: 2,
                                        }}>
                                            {t("scorecard.p_hcp").toLocaleUpperCase()}: {displayHCP(user.playing_hcp ?? user.current_hcp ?? "-")}
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: 50,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: teeboxColor,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 8,
                                    }}>
                                        <Text style={{
                                            color: getContrastColor(teeboxColor),
                                            fontWeight: "bold",
                                            fontSize: 15,
                                        }}>{teebox.name?.charAt(0) ?? "-"}</Text>
                                    </View>
                                    <Text style={{
                                        width: 60,
                                        fontWeight: "bold",
                                        fontSize: 18,
                                        textAlign: "center",
                                    }}>{score}</Text>
                                    <Text style={{
                                        width: 50,
                                        fontWeight: "bold",
                                        color: colors.color_blue,
                                        fontSize: 16,
                                        textAlign: "center",
                                    }}>{scoreToPar}</Text>
                                </ShrinkEffect>
                            );
                        })}
                    </View>
                </Card>

                <StatsCarousel
                    holes={scoreArr}
                    grid_info={grid_info ?? {
                        grid_id: "",
                        par: [],
                        handicap: []
                    }}
                />

                {/* 4. Calculateur de HCP */}
                <Card style={{
                    marginBottom: 18,
                    borderRadius: 18,
                    elevation: 1,
                    backgroundColor: colors.bg_secondary,
                    padding: 0,
                    overflow: "hidden",
                }}>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 18
                    }}>
                        <Icon source="calculator" color={colors.color_blue} size={22} />
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 8 }}>{t("scorecard.hcp_calculator")}</Text>
                    </View>
                    <View style={{ padding: 18, alignItems: "center" }}>
                        {hcpCalc ? (
                            <>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                                    <View style={{
                                        backgroundColor: "#e3f2fd",
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        marginRight: 6,
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                        <Text style={{ color: colors.color_blue, fontWeight: "bold" }}>{t("scorecard.score")}</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: colors.color_black }}>{hcpCalc.score}</Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: "#f3e5f5",
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        marginRight: 6,
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                        <Text style={{ color: colors.color_purple, fontWeight: "bold" }}>{t("scorecard.slope")}</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: colors.color_black }}>{hcpCalc.slope}</Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: "#fff3e0",
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        marginRight: 6,
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                        <Text style={{ color: colors.color_orange, fontWeight: "bold" }}>{t("scorecard.rating")}</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: colors.color_black }}>{hcpCalc.rating}</Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: "#e8f5e9",
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                        <Text style={{ color: colors.color_green, fontWeight: "bold" }}>{t("scorecard.par")}</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: colors.color_black }}>{hcpCalc.par}</Text>
                                    </View>
                                </View>
                                <Text style={{
                                    fontSize: 22,
                                    fontWeight: "bold",
                                    color: colors.color_blue,
                                    marginBottom: 8,
                                }}>
                                    {t("scorecard.calculated_index")} : {hcpCalc.value}
                                </Text>
                                <Text style={{ color: colors.text_muted, fontSize: 13, textAlign: "center" }}>
                                    {t("scorecard.calcul_whs")} : (({t("scorecard.score")} - {t("scorecard.rating")}) x 113) / {t("scorecard.slope")}
                                </Text>
                            </>
                        ) : (
                            <Text style={{ color: colors.text_muted, fontSize: 15, marginBottom: 8 }}>
                                {t("scorecard.missing_index_calcul_values")}
                            </Text>
                        )}
                    </View>
                </Card>

                <Button
                    style={{
                        marginBottom: 10
                    }}
                    mode="contained"
                    icon={"clipboard-edit"}
                    onPress={() => modifyScorecard()}
                >
                    {t("scorecard.modify")}
                </Button>
                {/* Bouton supprimer */}
                <Button
                    style={{
                        marginBottom: 10
                    }}
                    mode="contained"
                    buttonColor={colors.text_muted}
                    icon={"trash-can"}
                    onPress={() => setShowDeleteModal(true)}
                >
                    {t("scorecard.delete")}
                </Button>
            </ScrollView>
            <Portal>
                <Dialog visible={showDeleteModal} onDismiss={() => setShowDeleteModal(false)}>
                    <Dialog.Title>{t("scorecard.delete_confirm_title")}</Dialog.Title>
                    <Dialog.Content>
                        <Text>
                            {t("scorecard.delete_confirm_text")}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            onPress={() => deleteScorecard()}
                            textColor={colors.color_red}
                            icon="trash-can"
                        >
                            {t("scorecard.delete_confirm_yes")}
                        </Button>
                        <Button
                            onPress={() => setShowDeleteModal(false)}
                        >
                            {t("scorecard.delete_confirm_no")}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeBottomContainer>
    );
};

export default ScorecardSummarizeScreen;