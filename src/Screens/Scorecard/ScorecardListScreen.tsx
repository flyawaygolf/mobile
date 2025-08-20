import { useTranslation } from "react-i18next";
import { View, FlatList, ImageBackground, StyleSheet } from "react-native";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getUserScoreCardInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { useAppDispatch, useAppSelector } from "../../Redux";
import { Loader } from "../../Other";
import { addUserScoreCard, initUserScoreCard } from "../../Redux/UserScoreCard/action";
import { Avatar } from "../../Components/Member";
import { SettingsContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Card, Button } from "react-native-paper";
import { formatDistance } from "../../Services";
import LogoWhite from "../../Components/Elements/Assets/LogoWhite";

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

const ScorecardListScreen = () => {

    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();

    const userScorecards = useAppSelector((state) => state.userScorecards);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    async function getData() {
        const response = await client.userScoreCards.fetch({ pagination: { pagination_key: pagination_key } });
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
        const response = await client.userScoreCards.fetch({ pagination: { pagination_key: pagination_key } });
        setLoader(false);
        if (response.error || !response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (response.data.length < 1) return;
        dispatch(addUserScoreCard(response.data));
    }

    // Affiche le tableau des scores en deux lignes (1-9 et 10-18)
    const renderScoreTable = (item: getUserScoreCardInterface) => {
        const grid = item.grid_info;
        const holes = item.holes ?? [];
        const parArray = grid?.par ?? [];
        const scores = holes.map(h => h?.score ?? 0);

        // Split en deux lignes
        const firstNine = scores.slice(0, 9);
        const secondNine = scores.slice(9, 18);
        const firstNinePar = parArray.slice(0, 9).reduce((sum, val) => sum + val, 0);
        const secondNinePar = parArray.slice(9, 18).reduce((sum, val) => sum + val, 0);

        const renderRow = (rowScores: number[], rowPar: number, startIdx: number) => (
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                {rowScores.map((score, i) => {
                    const par = parArray[startIdx + i] ?? "-";
                    const scoreType = getScoreType(Number(score), Number(par));
                    return (
                        <View key={i} style={{ alignItems: "center", marginHorizontal: 2 }}>
                            <View style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                backgroundColor: scoreType.color,
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <Text style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: 15,
                                }}>{score}</Text>
                            </View>
                            <Text style={{ fontSize: 10, color: colors.text_muted }}>T{startIdx + i + 1}</Text>
                        </View>
                    );
                })}
                {/* Total ligne */}
                <View style={{ alignItems: "center", marginLeft: 6 }}>
                    <View style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: getScoreType(rowScores.reduce((a, b) => a + b, 0), rowPar).color,
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <Text style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 16,
                        }}>{rowScores.reduce((a, b) => a + b, 0)}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: colors.text_muted }}>Σ</Text>
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

    const renderItem = ({ item }: { item: getUserScoreCardInterface }) => {
        const scores = item.holes?.map(h => h?.score ?? 0) ?? [];
        const parArray = item.grid_info?.par ?? [];
        const totalScore = scores.reduce((sum, val) => sum + val, 0);
        const totalPar = parArray.reduce((sum, val) => sum + val, 0);
        const diff = totalScore - totalPar;

        return (
            <Card
                style={{
                    margin: 10,
                    borderRadius: 18,
                    overflow: "hidden",
                    elevation: 4,
                    backgroundColor: colors.bg_secondary,
                }}
                onPress={() => { }}
            >
                <ImageBackground
                    resizeMode="cover"
                    style={{ width: "100%", height: 180, position: "relative" }}
                    imageStyle={{
                        width: "100%",
                        height: "100%",
                        borderTopLeftRadius: 18,
                        borderTopRightRadius: 18,
                    }}
                    source={{ uri: client.golfs.cover(item.golf_id) }}
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
                            left: 16,
                            zIndex: 3,
                        }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <LogoWhite margin={0} size={25} />
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14, fontFamily: "Lobster-Regular" }}>FlyAway</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 2 }}>
                                {item.playing_date ? dayjs(item.playing_date).format("DD MMM YYYY").toUpperCase() : "-"}
                            </Text>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
                                {item.golf_info?.name ?? item.name}
                            </Text>
                            <Text style={{ color: "#fff", fontSize: 13, marginTop: 2 }}>
                                {t("scorecard.teebox")}: {item.teebox_info?.color?.name ?? "-"}
                            </Text>
                            <Text style={{ color: "#fff", fontSize: 13 }}>
                                {t("scorecard.par")} {parArray.reduce((sum, val) => sum + val, 0)} {item.teebox_info?.distances ? `• ${formatDistance(item.teebox_info.distances.reduce((sum: number, val: number) => sum + val, 0))}Km` : ""}
                            </Text>
                        </View>
                        <View style={{ alignItems: "flex-end", minWidth: 70 }}>
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 32 }}>
                                {totalScore === 0 ? item.holes.map(h => h?.score ?? 0).reduce((sum, val) => sum + val, 0) : totalScore}
                                <Text style={{ fontSize: 18, color: "#fff" }}> {diff > 0 ? `+${diff}` : diff}</Text>
                            </Text>
                        </View>
                    </View>
                    {/* Badges format/mode */}
                    <View style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
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
                            <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.format_${item.format}`)}</Text>
                        </View>
                        <View style={{
                            backgroundColor: "#fff2",
                            borderRadius: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                        }}>
                            <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.mode_${item.game_mode}`)}</Text>
                        </View>
                    </View>
                </ImageBackground>
                <View style={{ padding: 16, paddingTop: 10 }}>
                    {/* Avatar golf à gauche */}
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                        <Avatar url={client.golfs.avatar(item.golf_id)} size={40} radius={10} style={{ borderColor: "#fff", borderWidth: 2, marginRight: 10 }} />
                        <Text style={{ fontWeight: "bold", fontSize: 15, color: colors.fa_primary }}>{item.golf_info?.name}</Text>
                    </View>
                    {renderScoreTable(item)}
                    <Button
                        mode="outlined"
                        style={{ marginTop: 10, borderRadius: 10, alignSelf: "flex-end" }}
                        onPress={() => { }}>
                        {t("scorecard.details")}
                    </Button>
                </View>
            </Card>
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