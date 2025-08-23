import { useTranslation } from "react-i18next";
import { View, FlatList, ImageBackground, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getUserScoreCardInterface, HoleScorecardSchemaInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { useAppDispatch, useAppSelector } from "../../Redux";
import { Loader } from "../../Other";
import { addUserScoreCard, initUserScoreCard } from "../../Redux/UserScoreCard/action";
import { SettingsContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Card, Button } from "react-native-paper";
import { navigationProps } from "../../Services";
import LogoWhite from "../../Components/Elements/Assets/LogoWhite";
import { useNavigation } from "@react-navigation/native";
import { colorsInterface } from "../../Components/Container/Theme/Themes";

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

const ScorecardListScreen = () => {

    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const userScorecards = useAppSelector((state) => state.userScorecards);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    async function getData() {
        const response = await client.userScoreCards.fetch(user.user_id, { pagination: { pagination_key: pagination_key } });
        setLoader(false)
        if (response.error || !response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (response.data.length < 1) return;
        dispatch(initUserScoreCard(response.data));
    }

    useEffect(() => {
        getData()
    }, [])

    const bottomHandler = async () => {
        if (loader) return;
        setLoader(true)
        const response = await client.userScoreCards.fetch(user.user_id, { pagination: { pagination_key: pagination_key } });
        setLoader(false);
        if (response.error || !response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (response.data.length < 1) return;
        dispatch(addUserScoreCard(response.data));
    }

    const renderItem = ({ item }: { item: getUserScoreCardInterface }) => {
        const parArray = item.grid_info?.par ?? [];
        // Détection des trous réellement joués
        const filledScores = item.holes?.filter(h => typeof h.score === "number" && h.score > 0) ?? [];
        const holesPlayed = filledScores.length;

        // Calcul du score total
        let totalScore: number;
        if (holesPlayed === 0) {
            totalScore = item.total_score ?? 0;
        } else if (holesPlayed < item.holes.length) {
            totalScore = filledScores.reduce((sum, h) => sum + (h.score ?? 0), 0);
        } else {
            totalScore = item.holes.reduce((sum, h) => sum + (h.score ?? 0), 0);
        }

        // Calcul du par correspondant aux trous joués
        let totalPar: number;
        if (holesPlayed === 0) {
            totalPar = parArray.reduce((sum, val) => sum + val, 0);
        } else if (holesPlayed < item.holes.length) {
            const playedIndexes = item.holes
                .map((h, i) => (typeof h.score === "number" && h.score > 0 ? i : -1))
                .filter(i => i !== -1);
            totalPar = playedIndexes.reduce((sum, idx) => sum + (parArray[idx] ?? 0), 0);
        } else {
            totalPar = parArray.reduce((sum, val) => sum + val, 0);
        }

        const { format, game_mode, user_scorecard_id, golf_info, teebox_info, playing_date, name } = item;

        const navigateToSummarize = () => {
            navigation.navigate("ScorecardStack", {
                screen: "ScorecardSummarizeScreen",
                params: {
                    fromList: true,
                    user_id: user.user_id,
                    user_scorecard_id: user_scorecard_id

                }
            });
        }

        return (
            <Card
                style={{
                    margin: 10,
                    borderRadius: 18,
                    overflow: "hidden",
                    elevation: 4,
                    backgroundColor: colors.bg_secondary,
                }}
                onPress={() => navigateToSummarize()}
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
                                {teebox_info?.distances.length ?? 18} TROUS  PAR: {totalPar}  DÉPART: {teebox_info?.color?.name ?? item.teebox_info?.name ?? "-"}{item.teebox_info?.distances ? ` (${teebox_info?.distances.reduce((sum: number, val: number) => sum + val, 0)}m)` : ""}
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
                            <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.format_${format}`)}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#fff2",
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                        }}>
                            <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.mode_${game_mode}`)}</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{ padding: 16, paddingTop: 10 }}>
                    {renderScoreTable(item.holes, item.grid_info?.par ?? [], colors)}
                    <Button
                        mode="outlined"
                        style={{ marginTop: 10, borderRadius: 10, alignSelf: "flex-end" }}
                        onPress={() => navigateToSummarize()}>
                        {t("scorecard.details")}
                    </Button>
                </View>
            </Card >
        );
    };

    const memoizedValue = useMemo(() => renderItem, [userScorecards]);

    return (
        <SettingsContainer title={t("scorecard.list")}>
            <FlatList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                onScrollEndDrag={() => bottomHandler()}
                data={userScorecards}
                renderItem={memoizedValue}
                keyExtractor={item => item.user_scorecard_id} />
        </SettingsContainer>
    )
};

export default ScorecardListScreen;