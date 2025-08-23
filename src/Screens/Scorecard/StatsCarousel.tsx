import React from "react";
import { View } from "react-native";
import { Text, Card } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import { useTheme } from "../../Components/Container";
import { HoleScorecardSchemaInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { full_width } from "../../Style/style";
import { AbstractChartConfig } from "react-native-chart-kit/dist/AbstractChart";
import { useTranslation } from "react-i18next";

interface StatsCarouselProps {
    holes: HoleScorecardSchemaInterface[];
    grid_info: {
        grid_id: string;
        par: number[];
        handicap: number[];
    };
}

const StatsCarousel: React.FC<StatsCarouselProps> = ({
    holes,
    grid_info
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    // Calculs
    const scores = holes.map(h => h.score ?? 0);
    const parArray = grid_info?.par ?? [];
    const totalScore = scores.reduce((sum, val) => sum + val, 0);
    const totalPar = parArray.reduce((sum, val) => sum + val, 0);
    const scoreDiff = totalScore - totalPar;

    const putts = holes.reduce((sum, h) => sum + (h.putts ?? 0), 0);
    const penalties = holes.reduce((sum, h) => sum + (h.penalty ?? 0), 0);
    const chips = holes.reduce((sum, h) => sum + (h.chips ?? 0), 0);
    const sandSaves = holes.filter(h => h.sand === true).length;

    // Putts
    const puttsArr = holes.map(h => h.putts ?? h.puts ?? 0);
    const puttsAvg = puttsArr.length > 0 ? (puttsArr.reduce((sum, v) => sum + v, 0) / puttsArr.length).toFixed(1) : "-";

    // GIR %
    const girCount = holes.filter((h, i) => h.green === 1 && (h.score ?? 0) <= (parArray[i] ?? 0)).length;
    const girPct = holes.length > 0 ? Math.round((girCount / holes.length) * 100) : 0;

    // Fairways %
    const fairwayCount = holes.filter(h => h.fairway === 1).length;
    const fairwayTotal = holes.filter((_, i) => parArray[i] === 4 || parArray[i] === 5).length;
    const fairwaysPct = fairwayTotal > 0 ? Math.round((fairwayCount / fairwayTotal) * 100) : 0;

    // Score par type
    let scoreTypes = { albatros: 0, eagle: 0, birdie: 0, par: 0, bogey: 0, double: 0, triple: 0 };
    scores.forEach((score, i) => {
        const par = parArray[i] ?? 0;
        const diff = score - par;
        if (diff <= -3) scoreTypes.albatros++;
        if (diff <= -2) scoreTypes.eagle++;
        else if (diff === -1) scoreTypes.birdie++;
        else if (diff === 0) scoreTypes.par++;
        else if (diff === 1) scoreTypes.bogey++;
        else if (diff === 2) scoreTypes.double++;
        else if (diff >= 3) scoreTypes.triple++;
    });

    // Score / Par (Par 3, 4, 5)
    let scorePar = { par3: 0, par4: 0, par5: 0, par6: 0 };
    holes.forEach((h, i) => {
        const par = parArray[i] ?? 0;
        if (par === 3) scorePar.par3 += h.score ?? 0;
        if (par === 4) scorePar.par4 += h.score ?? 0;
        if (par === 5) scorePar.par5 += h.score ?? 0;
        if (par === 6) scorePar.par6 += h.score ?? 0;
    });

    const chartConfig: AbstractChartConfig = {
        backgroundGradientFrom: colors.bg_primary,
        backgroundGradientTo: colors.bg_third,
        color: () => colors.fa_primary,
        labelColor: () => colors.text_normal,
        strokeWidth: 2,
        decimalPlaces: 0,
        barPercentage: 0.7
    };

    const chartConfigScores = {
        ...chartConfig,
        color: () => colors.fa_secondary,
    };

    return (
        <View style={{ marginVertical: 10 }}>
            {/* Tuiles statistiques */}
            <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                marginBottom: 8,
                gap: 8,
            }}>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.score_diff")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{totalScore}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.score")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{puttsAvg}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.putts_per_hole")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{girPct} %</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.gir")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{fairwaysPct} %</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.fairways")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{putts}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.putts")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{penalties}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.penalties")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{chips}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.chips")}</Text>
                </View>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 10,
                    padding: 12,
                    width: "32%",
                    alignItems: "center",
                    marginBottom: 8,
                    elevation: 1,
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{sandSaves}</Text>
                    <Text style={{ color: colors.text_muted, fontSize: 13, marginTop: 2 }}>{t("scorecard.sand_saves")}</Text>
                </View>
            </View>
            {/* Graphiques */}
            <View style={{ flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
                <Card style={{
                    flex: 1,
                    borderRadius: 14,
                    padding: 10,
                    backgroundColor: colors.bg_secondary,
                    elevation: 2,
                    marginRight: 4,
                    width: "100%",
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 6 }}>{t("scorecard.score_by_par")}</Text>
                    <BarChart
                        yAxisLabel=""
                        yAxisSuffix=""
                        data={{
                            labels: [`${t("scorecard.par")} 3`, `${t("scorecard.par")} 4`, `${t("scorecard.par")} 5`],
                            datasets: [{ data: [scorePar.par3, scorePar.par4, scorePar.par5] }]
                        }}
                        width={full_width * 0.9}
                        height={167}
                        chartConfig={chartConfig}
                        fromZero
                        showValuesOnTopOfBars
                        withInnerLines={false}
                        style={{ borderRadius: 10, backgroundColor: colors.bg_secondary }}
                    />
                </Card>
                <Card style={{
                    flex: 1,
                    borderRadius: 14,
                    padding: 10,
                    backgroundColor: colors.bg_secondary,
                    elevation: 2,
                    marginLeft: 4,
                    width: "100%",
                }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 6 }}>{t("scorecard.my_scores")}</Text>
                    <BarChart
                        yAxisLabel=""
                        yAxisSuffix=""
                        data={{
                            labels: [
                                t("scorecard.albatros"),
                                t("scorecard.eagle"),
                                t("scorecard.birdie"),
                                t("scorecard.par"),
                                t("scorecard.bogey"),
                                t("scorecard.double"),
                                t("scorecard.triple")
                            ].filter((_label, idx) => {
                                const values = [
                                    scoreTypes.albatros,
                                    scoreTypes.eagle,
                                    scoreTypes.birdie,
                                    scoreTypes.par,
                                    scoreTypes.bogey,
                                    scoreTypes.double,
                                    scoreTypes.triple
                                ];
                                return values[idx] > 0;
                            }),
                            datasets: [{
                                data: [
                                    scoreTypes.albatros,
                                    scoreTypes.eagle,
                                    scoreTypes.birdie,
                                    scoreTypes.par,
                                    scoreTypes.bogey,
                                    scoreTypes.double,
                                    scoreTypes.triple
                                ].filter(v => v > 0)
                            }]
                        }}
                        width={full_width * 0.9}
                        withInnerLines={false}
                        height={170}
                        chartConfig={chartConfigScores}
                        fromZero
                        showValuesOnTopOfBars
                        style={{ borderRadius: 10 }}
                    />
                </Card>
            </View>
        </View>
    );
};

export default StatsCarousel;