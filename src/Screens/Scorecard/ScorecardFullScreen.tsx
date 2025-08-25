import { useTranslation } from "react-i18next";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Button, Appbar, IconButton, List, Icon } from "react-native-paper";
import { useState } from "react";
import { ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { ScrollView, View, Modal, Dimensions } from "react-native";
import { full_width } from "../../Style/style";
import { Avatar } from "../../Components/Member";

const getFairwayIcon = (fairway?: number) => {
    if (fairway === 1) return "check";
    if (fairway === 0) return "arrow-left";
    if (fairway === 2) return "arrow-right";
    return "minus";
};

const ScorecardFullScreen = ({ route, navigation }: ScreenNavigationProps<ScorecardStackParams, "ScorecardFullScreen">) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client } = useClient();
    const { golf, scorecard, grid, holes, name } = route.params;

    const holesCount = scorecard?.holesCount ?? 18;
    const totalScore = holes?.reduce((sum, h) => (sum ?? 0) + (h.score ?? 0), 0);
    const totalPar = grid?.par?.reduce((sum, val) => sum + val, 0);
    const [showLegend, setShowLegend] = useState(false);

    const screenWidth = Dimensions.get("window").width - 32; // padding horizontal
    const colCount = 6;
    const colWidth = screenWidth / colCount;

    const getScoreType = (score: number, par: number) => {
        if (score === 0 || par === 0) return { label: "-", color: "#bdbdbd" };
        const diff = score - par;
        if (diff <= -3) return { label: t("scorecard.albatros"), color: "#00bcd4" };
        if (diff === -2) return { label: t("scorecard.eagle"), color: "#2196f3" };
        if (diff === -1) return { label: t("scorecard.birdie"), color: "#4caf50" };
        if (diff === 0) return { label: t("scorecard.par"), color: "#8bc34a" };
        if (diff === 1) return { label: t("scorecard.bogey"), color: "#ff9800" };
        if (diff === 2) return { label: t("scorecard.double"), color: "#f44336" };
        if (diff >= 3) return { label: t("scorecard.triple"), color: "#d32f2f" };
        return { label: "-", color: "#bdbdbd" };
    };

    const scoreTypesLegend = [
        { label: t("scorecard.albatros"), color: "#00bcd4", desc: t("scorecard.albatros_desc") },
        { label: t("scorecard.eagle"), color: "#2196f3", desc: t("scorecard.eagle_desc") },
        { label: t("scorecard.birdie"), color: "#4caf50", desc: t("scorecard.birdie_desc") },
        { label: t("scorecard.par"), color: "#8bc34a", desc: t("scorecard.par") },
        { label: t("scorecard.bogey"), color: "#ff9800", desc: t("scorecard.bogey_desc") },
        { label: t("scorecard.double"), color: "#f44336", desc: t("scorecard.double_desc") },
        { label: t("scorecard.triple"), color: "#d32f2f", desc: t("scorecard.triple_desc") },
        { label: "-", color: "#bdbdbd", desc: t("scorecard.unknown_desc") },
    ];

    return (
        <SafeBottomContainer>
            <Appbar.Header style={{
                width: full_width,
                borderBottomColor: colors.bg_secondary,
                borderBottomWidth: 1,
                marginBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginLeft: 5, width: "65%" }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Avatar url={client.golfs.avatar(golf.golf_id)} />
                    <View>
                        <Text numberOfLines={1} variant="titleMedium">{golf.name}</Text>
                        <Text numberOfLines={1}>{name}</Text>
                    </View>
                </View>
                <View>
                    <Button
                        mode="outlined"
                        style={{ marginLeft: 12, alignSelf: "center" }}
                        onPress={() => setShowLegend(true)}
                    >
                        {t("scorecard.legend")}
                    </Button>
                </View>
            </Appbar.Header>

            <ScrollView style={{ flex: 1, paddingHorizontal: 8 }}>
                <View style={{
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 16,
                    padding: 8,
                    marginVertical: 8,
                    elevation: 2,
                    minWidth: screenWidth,
                }}>
                    <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.bg_secondary, paddingBottom: 6 }}>
                        <Text style={{ width: colWidth, fontWeight: "bold", textAlign: "center" }}>#</Text>
                        <Text style={{ width: colWidth, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.par")}</Text>
                        <Text style={{ width: colWidth, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.hcp")}</Text>
                        <Text style={{ width: colWidth, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.score")}</Text>
                        <Text style={{ width: colWidth, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.putts")}</Text>
                        <Text style={{ width: colWidth, fontWeight: "bold", textAlign: "center" }}>{t("scorecard.fairway")}</Text>
                    </View>
                    {Array.from({ length: holesCount }, (_, i) => {
                        const par = grid?.par?.[i];
                        const score = holes?.[i]?.score;
                        const fairway = holes?.[i]?.fairway;
                        const putts = holes?.[i]?.putts;
                        const hcp = grid?.handicap?.[i];
                        const scoreType = getScoreType(score ?? 0, par ?? 0);
                        return (
                            <View key={i} style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 6,
                                borderBottomWidth: i === holesCount - 1 ? 0 : 0.5,
                                borderBottomColor: colors.bg_secondary,
                                backgroundColor: i % 2 === 0 ? colors.bg_secondary : colors.bg_primary,
                                borderRadius: 8,
                            }}>
                                <Text style={{ width: colWidth, textAlign: "center", fontWeight: "bold" }}>{i + 1}</Text>
                                <Text style={{ width: colWidth, textAlign: "center" }}>{par ?? "-"}</Text>
                                <Text style={{ width: colWidth, textAlign: "center" }}>{hcp ?? "-"}</Text>
                                <View style={{ width: colWidth, alignItems: "center", justifyContent: "center" }}>
                                    <View style={{
                                        backgroundColor: scoreType.color,
                                        borderRadius: 20,
                                        width: 36,
                                        height: 36,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 2,
                                        shadowColor: scoreType.color,
                                        shadowOpacity: 0.15,
                                        shadowRadius: 2,
                                    }}>
                                        <Text style={{
                                            color: "#fff",
                                            fontWeight: "bold",
                                            fontSize: 17,
                                            textAlign: "center"
                                        }}>
                                            {score ?? "-"}
                                        </Text>
                                    </View>
                                    <Text style={{
                                        color: scoreType.color,
                                        fontWeight: "bold",
                                        fontSize: 13,
                                        marginTop: 2,
                                        textAlign: "center"
                                    }}>
                                        {scoreType.label}
                                    </Text>
                                </View>
                                <Text style={{ width: colWidth, textAlign: "center" }}>{putts ?? "-"}</Text>
                                <View style={{ width: colWidth, alignItems: "center", justifyContent: "center" }}>
                                    <IconButton
                                        icon={getFairwayIcon(fairway)}
                                        size={22}
                                        style={{ alignSelf: "center" }}
                                        iconColor={fairway === 1 ? colors.fa_primary : colors.text_muted}
                                    />
                                </View>
                            </View>
                        );
                    })}
                    {/* Total */}
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 10,
                        marginTop: 8,
                        borderTopWidth: 1,
                        borderTopColor: colors.bg_secondary,
                        backgroundColor: colors.bg_secondary,
                        borderRadius: 8,
                    }}>
                        <Text style={{ width: colWidth, textAlign: "center", fontWeight: "bold" }}>Σ</Text>
                        <Text style={{ width: colWidth, textAlign: "center", fontWeight: "bold" }}>{totalPar ?? "-"}</Text>
                        <Text style={{ width: colWidth, textAlign: "center" }}>-</Text>
                        <View style={{ width: colWidth, alignItems: "center", justifyContent: "center" }}>
                            <View style={{
                                borderRadius: 20,
                                width: 36,
                                height: 36,
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 2,
                                shadowOpacity: 0.15,
                                shadowRadius: 2,
                            }}>
                                <Text style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: 17,
                                    textAlign: "center"
                                }}>
                                    {totalScore ?? "-"}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ width: colWidth, textAlign: "center" }}>-</Text>
                        <Text style={{ width: colWidth, textAlign: "center" }}>-</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Modal légende */}
            <Modal
                visible={showLegend}
                animationType="slide"
                transparent
                onRequestClose={() => setShowLegend(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: "#00000088",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <View style={{
                        backgroundColor: colors.bg_primary,
                        borderRadius: 16,
                        padding: 24,
                        minWidth: 280,
                        maxWidth: 370,
                        alignItems: "center",
                        elevation: 6
                    }}>
                        <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 18 }}>
                            {t("scorecard.legend")}
                        </Text>
                        <View style={{ width: "100%" }}>
                            {scoreTypesLegend.map(type => (
                                <List.Item
                                    key={type.label}
                                    title={type.label}
                                    description={type.desc}
                                    left={() => (
                                        <Icon
                                            size={24}
                                            source="golf"
                                            color="#fff"
                                        />
                                    )}
                                    titleStyle={{ color: type.color, fontWeight: "bold", fontSize: 16 }}
                                    descriptionStyle={{ color: colors.text_muted, fontSize: 13 }}
                                    style={{ marginBottom: 4, borderRadius: 8 }}
                                />
                            ))}
                        </View>
                        <Button
                            mode="contained"
                            style={{ marginTop: 22, borderRadius: 12, width: "80%" }}
                            onPress={() => setShowLegend(false)}
                        >
                            {t("commons.close")}
                        </Button>
                    </View>
                </View>
            </Modal>
        </SafeBottomContainer>
    );
};

export default ScorecardFullScreen;