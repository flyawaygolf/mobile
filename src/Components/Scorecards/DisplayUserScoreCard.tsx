import { Button, Card, Text } from "react-native-paper";
import { useClient, useTheme } from "../Container";
import { ImageBackground, StyleSheet } from "react-native";
import { View } from "react-native";
import LogoWhite from "../Elements/Assets/LogoWhite";
import { getUserScoreCardInterface, HoleScorecardSchemaInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { colorsInterface } from "../Container/Theme/Themes";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type SectionProps = {
    onPress?: () => any;
    scorecard: getUserScoreCardInterface;
}

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

export default function DisplayUserScoreCard({
    onPress,
    scorecard
}: SectionProps) {
    const { colors } = useTheme();
    const { client } = useClient();
    const { t } = useTranslation();
    const { golf_info, grid_info, teebox_info, holes, name, playing_date, total_score } = scorecard;

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

    const CardInfo = () => (
        <Card
            onPress={() => onPress && onPress()}
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
                            {teebox_info?.distances.length ?? 18} {t("scorecard.holes").toLocaleUpperCase()} • {t("scorecard.par").toLocaleUpperCase()}: {totalPar} • {t("scorecard.teebox").toLocaleUpperCase()}: {teebox_info?.color?.name ?? teebox_info?.name ?? "-"}{teebox_info?.distances ? ` (${teebox_info.distances.reduce((sum: number, val: number) => sum + val, 0)}m)` : ""}
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
                        <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.format_${scorecard.format}`)}</Text>
                    </View>
                    <View style={{
                        backgroundColor: "#fff2",
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                    }}>
                        <Text style={{ color: "#fff", fontSize: 12 }}>{t(`scorecard.mode_${scorecard.game_mode}`)}</Text>
                    </View>
                </View>
            </ImageBackground>
            <View style={{ padding: 16, paddingTop: 10, backgroundColor: colors.bg_secondary }}>
                {renderScoreTable(scoreArr, grid_info?.par ?? [], colors)}
                {onPress && (
                    <Button
                        mode="outlined"
                        style={{ marginTop: 10, borderRadius: 10, alignSelf: "flex-end" }}
                        onPress={() => onPress()}>
                        {t("scorecard.details")}
                    </Button>
                )}
            </View>
        </Card>
    );

    return <CardInfo />;
}