import { useTranslation } from "react-i18next";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Appbar, Card, Icon } from "react-native-paper";
import { useEffect, useState } from "react";
import { handleToast, navigationProps, ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { ScrollView, View, ImageBackground, StyleSheet } from "react-native";
import { full_width } from "../../Style/style";
import { Avatar } from "../../Components/Member";
import { useNavigation } from "@react-navigation/native";
import { getUserScoreCardInterface, HoleScorecardSchemaInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { displayHCP } from "../../Services/handicapNumbers";
import { ShrinkEffect } from "../../Components/Effects";
import LogoWhite from "../../Components/Elements/Assets/LogoWhite";
import dayjs from "dayjs";
import { colorsInterface } from "../../Components/Container/Theme/Themes";

const getScoreType = (score: number, par: number) => {
    if (score === 0 || par === 0) return { label: "-", color: "#bdbdbd" };
    const diff = score - par;
    if (diff <= -3) return { label: "Albatros", color: "#00bcd4" };
    if (diff === -2) return { label: "Eagle", color: "#2196f3" };
    if (diff === -1) return { label: "Birdie", color: "#4caf50" };
    if (diff === 0) return { label: "Par", color: "#8bc34a" };
    if (diff === 1) return { label: "Bogey", color: "#ff9800" };
    if (diff === 2) return { label: "Double", color: "#f44336" };
    if (diff >= 3) return { label: "Triple+", color: "#d32f2f" };
    return { label: "-", color: "#bdbdbd" };
};

const getScoreToPar = (score: number, par: number) => {
    if (!score || !par) return "-";
    const diff = score - par;
    if (diff === 0) return "E";
    if (diff > 0) return `+${diff}`;
    return `${diff}`;
};

const sumScore = (holes: HoleScorecardSchemaInterface[]) => holes?.reduce((sum, h) => sum + (h.score ?? 0), 0) ?? 0;

const renderScoreTable = (holes: HoleScorecardSchemaInterface[], parArray: number[], colors: colorsInterface) => {
    const scores = holes.map(h => h?.score ?? 0);
    const firstNine = scores.slice(0, 9);
    const secondNine = scores.slice(9, 18);
    const firstNinePar = parArray.slice(0, 9).reduce((sum, val) => sum + val, 0);
    const secondNinePar = parArray.slice(9, 18).reduce((sum, val) => sum + val, 0);

    const getToParLabel = (score: number, par: number) => {
        if (!score || !par) return "-";
        const diff = score - par;
        if (diff === 0) return "E";
        if (diff > 0) return `+${diff}`;
        return `${diff}`;
    };

    const renderRow = (rowScores: number[], rowPar: number, startIdx: number) => (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
            {rowScores.map((score, i) => {
                const par = parArray[startIdx + i] ?? 0;
                const toParLabel = getToParLabel(score, par);
                return (
                    <View key={i} style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginHorizontal: 2,
                        width: 32,
                    }}>
                        <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: colors.bg_third,
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 2,
                        }}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: 16
                            }}>{score}</Text>
                        </View>
                        <View style={{
                            minWidth: 24,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor: "#f2f2f2",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 2,
                            borderWidth: 1,
                            borderColor: "#e0e0e0"
                        }}>
                            <Text style={{
                                color: "#444",
                                fontSize: 11,
                                fontWeight: "bold",
                            }}>{toParLabel}</Text>
                        </View>
                        <Text style={{ fontSize: 10, color: colors.text_muted }}>{startIdx + i + 1}</Text>
                    </View>
                );
            })}
            {/* Total ligne */}
            <View style={{
                alignItems: "center",
                marginLeft: 6,
                backgroundColor: colors.bg_secondary_rgba,
                borderRadius: 8,
                width: 38,
                height: 38,
                justifyContent: "center",
            }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 17,
                }}>{rowScores.reduce((a, b) => a + b, 0)}</Text>
                <Text style={{ fontSize: 11, color: colors.text_muted }}>{rowPar ? `${(rowScores.reduce((a, b) => a + b, 0) - rowPar) < 0 ? "" : "+"}${rowScores.reduce((a, b) => a + b, 0) - rowPar}` : ""}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ marginTop: 10 }}>
            {renderRow(firstNine, firstNinePar, 0)}
            {secondNine.length > 0 && renderRow(secondNine, secondNinePar, 9)}
        </View>
    );
};

const ScorecardSummarizeScreen = ({ route }: ScreenNavigationProps<ScorecardStackParams, "ScorecardSummarizeScreen">) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();
    const { user_scorecard_id, fromList, user_id } = route.params;

    const [userScoreCard, setUserScoreCard] = useState<getUserScoreCardInterface | null>(null);

    useEffect(() => {
        if (user_scorecard_id) {
            client.userScoreCards.fetchOne(user_id, user_scorecard_id).then(response => {
                if (response.error) return handleToast(t(`errors.${response.error.code}`));
                if (response.data) setUserScoreCard(response.data);
            });
        }
    }, [user_scorecard_id, user_id]);

    if (!userScoreCard) return <SafeBottomContainer><Text style={{ padding: 20 }}>{t("commons.loading")}</Text></SafeBottomContainer>;

    const { golf_info, grid_info, teebox_info, holes, name, playing_date, total_score, players } = userScoreCard;
    const totalPar = grid_info?.par?.reduce((sum, val) => sum + val, 0);
    const scoreArr = holes ?? [];
    const totalScore = total_score ?? scoreArr.reduce((sum, h) => (sum ?? 0) + (h.score ?? 0), 0);

    // Statistiques simples
    const stats = {
        birdies: scoreArr.filter((h, i) => getScoreType(h.score ?? 0, grid_info?.par?.[i] ?? 0).label === "Birdie").length,
        eagles: scoreArr.filter((h, i) => getScoreType(h.score ?? 0, grid_info?.par?.[i] ?? 0).label === "Eagle").length,
        pars: scoreArr.filter((h, i) => getScoreType(h.score ?? 0, grid_info?.par?.[i] ?? 0).label === "Par").length,
        bogeys: scoreArr.filter((h, i) => getScoreType(h.score ?? 0, grid_info?.par?.[i] ?? 0).label === "Bogey").length,
        doubles: scoreArr.filter((h, i) => getScoreType(h.score ?? 0, grid_info?.par?.[i] ?? 0).label === "Double").length,
        triples: scoreArr.filter((h, i) => getScoreType(h.score ?? 0, grid_info?.par?.[i] ?? 0).label === "Triple+").length,
    };

    // Statistiques avancées
    const advancedStats = {
        putts: scoreArr.reduce((sum, h) => sum + (h.putts ?? h.puts ?? 0), 0),
        penalties: scoreArr.reduce((sum, h) => sum + (h.penalty ?? 0), 0),
        chips: scoreArr.reduce((sum, h) => sum + (h.chips ?? 0), 0),
        sandSaves: scoreArr.filter(h => h.sand === true).length,
        fairwaysHit: scoreArr.filter(h => h.fairway === 1).length,
        fairwaysTotal: scoreArr.filter((_, i) => grid_info?.par?.[i] === 4 || grid_info?.par?.[i] === 5).length,
        greensInReg: scoreArr.filter((h, i) => {
            // Green hit si h.green === 1 ET score <= par
            return h.green === 1 && (h.score ?? 0) <= (grid_info?.par?.[i] ?? 0);
        }).length,
    };

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
    if (teebox_info?.slope && teebox_info?.rating && totalPar) {
        // Formule WHS simplifiée
        const score = totalScore;
        const par = totalPar;
        const slope = teebox_info.slope;
        const rating = teebox_info.rating;
        // HCP = (Score - Rating) * 113 / Slope
        const hcpValue = ((score - rating) * 113) / slope;
        hcpCalc = {
            score, par, slope, rating,
            value: Math.round(hcpValue * 10) / 10
        };
    }

    return (
        <SafeBottomContainer>
            {/* Header inchangé */}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Appbar.Action icon={fromList ? "arrow-left" : "home"} onPress={() => fromList ? navigation.goBack() : navigation.navigate("BottomNavigation", {
                        screen: "ScorecardHomeScreen"
                    })} />
                    <ShrinkEffect onPress={() => golf_info?.golf_id && navigation.navigate("GolfsStack", {
                        screen: "GolfsProfileScreen",
                        "params": { golf_id: golf_info.golf_id }
                    })} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginLeft: 10 }} >
                        <Avatar url={client.golfs.avatar(golf_info?.golf_id ?? "")} />
                        <View>
                            <Text variant="titleMedium">{golf_info?.name ?? "-"}</Text>
                            <Text>{name}</Text>
                        </View>
                        <Appbar.Action icon={"chevron-right"} />
                    </ShrinkEffect>
                </View>
            </Appbar.Header>
            <ScrollView style={{ flex: 1, paddingHorizontal: 8 }}>
                {/* Carte de score style image, overlay sombre, texte blanc, flat */}
                <Card
                    style={{
                        marginBottom: 18,
                        borderRadius: 18,
                        overflow: "hidden",
                        elevation: 2,
                        backgroundColor: "#fff",
                        padding: 0,
                    }}
                >
                    <ImageBackground
                        resizeMode="cover"
                        style={{ width: "100%", height: 190, position: "relative" }}
                        imageStyle={{
                            width: "100%",
                            height: "100%",
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18,
                        }}
                        source={{ uri: client.golfs.cover(golf_info?.golf_id ?? "") }}
                    >
                        {/* Overlay sombre */}
                        <View style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: "rgba(0,0,0,0.45)",
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18,
                        }} />
                        {/* Infos principales */}
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            padding: 16,
                            zIndex: 2,
                        }}>
                            <View style={{
                                position: "absolute",
                                top: 10,
                                right: 16,
                                zIndex: 3,
                            }}>
                                <View style={{ flexDirection: "column", alignItems: "center" }}>
                                    <LogoWhite margin={0} size={25} />
                                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14, fontFamily: "Lobster-Regular" }}>FlyAway</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>
                                    {playing_date ? dayjs(playing_date).format("L") : "-"}
                                </Text>
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
                                    {golf_info?.name ?? name}
                                </Text>
                                <Text style={{ color: "#fff", fontSize: 13, marginTop: 2 }}>
                                    {teebox_info?.distances.length ?? 18} TROUS  PAR: {totalPar}  DÉPART: {teebox_info?.color?.name ?? teebox_info?.name ?? "-"}{teebox_info?.distances ? ` (${teebox_info.distances.reduce((sum: number, val: number) => sum + val, 0)}m)` : ""}
                                </Text>
                            </View>
                            <View style={{ alignItems: "flex-end", minWidth: 70 }}>
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 32 }}>
                                    {totalScore}
                                    <Text style={{ fontSize: 18, color: "#fff" }}> {totalScore - (totalPar ?? 0) > 0 ? `+${totalScore - (totalPar ?? 0)}` : totalScore - (totalPar ?? 0)}</Text>
                                </Text>
                            </View>
                        </View>
                        {/* Badges format/mode */}
                        <View style={{
                            position: "absolute",
                            top: 12,
                            left: 16,
                            flexDirection: "row",
                            zIndex: 3,
                        }}>
                            <View style={{
                                backgroundColor: "#fff2",
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                marginRight: 6,
                            }}>
                                <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.format_${userScoreCard.format}`)}</Text>
                            </View>
                            <View style={{
                                backgroundColor: "#fff2",
                                borderRadius: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                            }}>
                                <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.mode_${userScoreCard.game_mode}`)}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                    <View style={{ padding: 16, paddingTop: 10, backgroundColor: colors.bg_secondary }}>
                        {renderScoreTable(scoreArr, grid_info?.par ?? [], colors)}
                    </View>
                </Card>

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
                            <Icon source="trophy" color="#f39c12" size={20} />
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>Leaderboard</Text>
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
                        <Text style={{ flex: 2, color: colors.text_muted, fontWeight: "bold" }}>JOUEUR</Text>
                        <Text style={{ width: 60, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>DÉPART</Text>
                        <Text style={{ width: 60, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>SCORE</Text>
                        <Text style={{ width: 50, color: colors.text_muted, fontWeight: "bold", textAlign: "center" }}>TO PAR</Text>
                    </View>
                    <View style={{ flexDirection: "column" }}>
                        {leaderboard.length === 0 && (
                            <Text style={{ color: colors.text_muted, fontStyle: "italic", padding: 16 }}>Aucun joueur dans la partie</Text>
                        )}
                        {leaderboard.map((p, idx) => {
                            const user = p.user_info || {};
                            const teebox = p.scorecard_info?.teebox_info || {};
                            const teeboxColor = teebox.color?.hexadecimalRgbCode ?? colors.color_grey;
                            const score = typeof p.score === "number" ? p.score : sumScore(p.scorecard_info?.holes ?? []);
                            const scoreToPar = getScoreToPar(score, totalPar ?? 0);
                            return (
                                <View
                                    key={user.user_id ?? idx}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: colors.bg_secondary_rgba,
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
                                            P.HCP: {displayHCP(user.playing_hcp ?? user.current_hcp ?? "-")}
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
                                            color: "#fff",
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
                                </View>
                            );
                        })}
                    </View>
                </Card>

                {/* 3. Statistiques de la carte de score */}
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
                        <Icon source="chart-bar" color={colors.color_blue} size={22} />
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 8 }}>Statistiques</Text>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        padding: 18,
                        gap: 10,
                    }}>
                        <View style={{
                            backgroundColor: "#e3f2fd",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#2196f3" size={20} />
                            <Text style={{ color: "#2196f3", fontWeight: "bold", marginTop: 4 }}>Birdies</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{stats.birdies}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#e8f5e9",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#4caf50" size={20} />
                            <Text style={{ color: "#4caf50", fontWeight: "bold", marginTop: 4 }}>Pars</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{stats.pars}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#fff3e0",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#ff9800" size={20} />
                            <Text style={{ color: "#ff9800", fontWeight: "bold", marginTop: 4 }}>Bogeys</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{stats.bogeys}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#ffebee",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#f44336" size={20} />
                            <Text style={{ color: "#f44336", fontWeight: "bold", marginTop: 4 }}>Doubles</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{stats.doubles}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f3e5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#8e24aa" size={20} />
                            <Text style={{ color: "#8e24aa", fontWeight: "bold", marginTop: 4 }}>Triples+</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{stats.triples}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#e0f7fa",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#00bcd4" size={20} />
                            <Text style={{ color: "#00bcd4", fontWeight: "bold", marginTop: 4 }}>Eagles</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{stats.eagles}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#222" size={20} />
                            <Text style={{ color: "#222", fontWeight: "bold", marginTop: 4 }}>Putts</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{advancedStats.putts}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#222" size={20} />
                            <Text style={{ color: "#222", fontWeight: "bold", marginTop: 4 }}>Pénalités</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{advancedStats.penalties}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#222" size={20} />
                            <Text style={{ color: "#222", fontWeight: "bold", marginTop: 4 }}>Chips</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{advancedStats.chips}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#222" size={20} />
                            <Text style={{ color: "#222", fontWeight: "bold", marginTop: 4 }}>Sand saves</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{advancedStats.sandSaves}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#222" size={20} />
                            <Text style={{ color: "#222", fontWeight: "bold", marginTop: 4 }}>Fairways touchés</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                                {advancedStats.fairwaysHit} / {advancedStats.fairwaysTotal}
                            </Text>
                        </View>
                        <View style={{
                            backgroundColor: "#f5f5f5",
                            borderRadius: 12,
                            padding: 12,
                            flexBasis: "48%",
                            marginBottom: 10,
                            alignItems: "center",
                        }}>
                            <Icon source="golf" color="#222" size={20} />
                            <Text style={{ color: "#222", fontWeight: "bold", marginTop: 4 }}>Greens en régulation</Text>
                            <Text style={{ fontWeight: "bold", fontSize: 18 }}>{advancedStats.greensInReg}</Text>
                        </View>
                    </View>
                </Card>

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
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 8 }}>Calculateur de HCP</Text>
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
                                        <Text style={{ color: colors.color_blue, fontWeight: "bold" }}>Score</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#222" }}>{hcpCalc.score}</Text>
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
                                        <Text style={{ color: "#8e24aa", fontWeight: "bold" }}>Slope</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#222" }}>{hcpCalc.slope}</Text>
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
                                        <Text style={{ color: "#ff9800", fontWeight: "bold" }}>Rating</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#222" }}>{hcpCalc.rating}</Text>
                                    </View>
                                    <View style={{
                                        backgroundColor: "#e8f5e9",
                                        borderRadius: 10,
                                        paddingHorizontal: 12,
                                        paddingVertical: 6,
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}>
                                        <Text style={{ color: "#4caf50", fontWeight: "bold" }}>Par</Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 16, color: "#222" }}>{hcpCalc.par}</Text>
                                    </View>
                                </View>
                                <Text style={{
                                    fontSize: 22,
                                    fontWeight: "bold",
                                    color: "#2e7df6",
                                    marginBottom: 8,
                                }}>
                                    Index calculé : {hcpCalc.value}
                                </Text>
                                <Text style={{ color: "#888", fontSize: 13, textAlign: "center" }}>
                                    Calcul WHS : ((Score - Rating) × 113) / Slope
                                </Text>
                            </>
                        ) : (
                            <Text style={{ color: "#888", fontSize: 15, marginBottom: 8 }}>
                                Slope, rating ou par manquant pour le calcul.
                            </Text>
                        )}
                    </View>
                </Card>
            </ScrollView>
        </SafeBottomContainer>
    );
};

export default ScorecardSummarizeScreen;