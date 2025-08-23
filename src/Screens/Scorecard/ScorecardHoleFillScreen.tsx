import { useTranslation } from "react-i18next";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Button, TextInput, Appbar, IconButton, Switch } from "react-native-paper";
import { useState } from "react";
import { handleToast, ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { HoleScorecardSchemaInterface, scorecardCreatorParams } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { full_width } from "../../Style/style";
import { Avatar } from "../../Components/Member";
import BottomModal from "../../Other/BottomModal";

const fairwayOptions = [
    { label: "arrow-left", value: 0, desc: "Miss gauche" },
    { label: "check", value: 1, desc: "Fairway touché" },
    { label: "arrow-right", value: 2, desc: "Miss droite" },
];
const greenOptions = [
    { label: "arrow-left", value: 0, desc: "Miss gauche" },
    { label: "check", value: 1, desc: "Green touché" },
    { label: "arrow-right", value: 2, desc: "Miss droite" },
    { label: "arrow-down", value: 3, desc: "Court" },
    { label: "arrow-up", value: 4, desc: "Long" },
];

const ScorecardHoleFillScreen = ({ route, navigation }: ScreenNavigationProps<ScorecardStackParams, "ScorecardHoleFillScreen">) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client, user } = useClient();
    const { golf, scorecard, grid, starting_hole } = route.params;

    const holesCount = scorecard?.holesCount ?? 18;
    const [currentHole, setCurrentHole] = useState<number>(starting_hole || 1);
    const [holesData, setHolesData] = useState<HoleScorecardSchemaInterface[]>(
        Array.from({ length: holesCount }, (_, i) => ({
            hole_number: i + 1,
        }))
    );
    const [showHoleGridModal, setShowHoleGridModal] = useState(false);

    // Récupère les données du trou courant
    const holeData = holesData[currentHole - 1];

    // Handlers pour chaque champ
    const updateHoleField = (field: keyof HoleScorecardSchemaInterface, value: any) => {
        setHolesData(prev => {
            const updated = [...prev];
            updated[currentHole - 1] = { ...updated[currentHole - 1], [field]: value };
            return updated;
        });
    };

    // Navigation entre les trous
    const goToHole = (num: number) => {
        if (num < 1 || num > holesCount) return;
        setCurrentHole(num);
    };

    // Validation putts+chips+penalties >= score
    const putts = holeData.putts ?? 0;
    const chips = holeData.chips ?? 0;
    const penalty = holeData.penalty ?? 0;
    const score = holeData.score ?? 0;

    // Helper pour changer valeur numérique
    const handleNumberChange = (field: keyof HoleScorecardSchemaInterface, value: number) => {
        if (value < 0) value = 0;
        // Mise à jour du champ
        updateHoleField(field, value);

        // Si on modifie un champ optionnel, on vérifie la contrainte sur le score
        if (["putts", "chips", "penalty"].includes(field)) {
            // On récupère les valeurs actuelles ou la nouvelle valeur
            const newPutts = field === "putts" ? value : holeData.putts ?? 0;
            const newChips = field === "chips" ? value : holeData.chips ?? 0;
            const newPenalty = field === "penalty" ? value : holeData.penalty ?? 0;
            const sumOptions = newPutts + newChips + newPenalty;
            const currentScore = holeData.score ?? 0;
            if (sumOptions > currentScore) {
                updateHoleField("score", sumOptions);
            }
        }
    };

    const handleSubmit = async () => {
        const total_score = holesData.reduce((sum, h) => (sum ?? 0) + (h.score ?? 0), 0);

        const params: scorecardCreatorParams = {
            teebox_id: route.params.teebox.teebox_id,
            name: route.params.name,
            format: route.params.format,
            game_mode: route.params.game_mode,
            starting_hole: route.params.starting_hole,
            playing_date: route.params.playing_date,
            holes: holesData,
            total_score,
            // event_id, status, players peuvent être ajoutés si présents dans route.params
        };

        const request = await client.userScoreCards.create(params);
        if (request.error) return handleToast(t(`errors.${request?.error?.code}`));
        if (request.data) {
            navigation.navigate("ScorecardSummarizeScreen", {
                user_id: user.user_id,
                user_scorecard_id: request.data.user_scorecard_id
            });
        }
    };

    // Ajout d'une fonction pour afficher la fiche de score
    const handleShowScorecard = () => {
        navigation.navigate("ScorecardFullScreen", {
            ...route.params,
            holes: holesData
        });
    };

    return (
        <SafeBottomContainer>
            <Appbar.Header style={{ width: full_width, borderBottomColor: colors.bg_secondary, borderBottomWidth: 1, marginBottom: 10, paddingLeft: 15 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar url={client.golfs.avatar(golf.golf_id)} />
                    <View>
                        <Text variant="titleMedium">{golf.name}</Text>
                        <Text>{t("scorecard.total_score")} {holesData.map(h => h.score).reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0)} / {grid.par.reduce((sum: number, val: number) => sum + val, 0)}</Text>
                    </View>
                </View>
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                >
                    {/* Score obligatoire */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.score")}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <IconButton
                                icon="minus"
                                size={24}
                                onPress={() => handleNumberChange("score", Math.max(0, score - 1))}
                                style={{ marginHorizontal: 0 }}
                            />
                            <TextInput
                                value={score !== undefined && score !== null ? String(score) : ""}
                                onChangeText={v => {
                                    // On laisse vide si l'utilisateur efface
                                    if (v === "") updateHoleField("score", undefined);
                                    else handleNumberChange("score", Number(v));
                                }}
                                onBlur={() => {
                                    if (
                                        score === undefined ||
                                        score === null ||
                                        (typeof score === "string" && score === "")
                                    ) updateHoleField("score", 0);
                                }}
                                keyboardType="numeric"
                                mode="outlined"
                                style={{
                                    width: 54,
                                    height: 38,
                                    textAlign: "center",
                                    marginHorizontal: 0,
                                    borderRadius: 8,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            />
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => handleNumberChange("score", score + 1)}
                                style={{ marginHorizontal: 0 }}
                            />
                        </View>
                    </View>

                    {/* Putts */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.putts")}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {putts > 0 && (
                                <IconButton
                                    icon="minus"
                                    size={24}
                                    onPress={() => handleNumberChange("putts", putts - 1)}
                                    style={{ marginHorizontal: 0 }}
                                />
                            )}
                            <TextInput
                                value={putts !== undefined && putts !== null ? String(putts) : ""}
                                onChangeText={v => {
                                    // On laisse vide si l'utilisateur efface
                                    if (v === "") updateHoleField("putts", "");
                                    else handleNumberChange("putts", Number(v));
                                }}
                                onBlur={() => {
                                    if (
                                        putts === undefined ||
                                        putts === null ||
                                        (typeof putts === "string" && putts === "") ||
                                        isNaN(Number(putts))
                                    ) updateHoleField("putts", 0);
                                }}
                                keyboardType="numeric"
                                mode="outlined"
                                style={{
                                    width: 54,
                                    height: 38,
                                    textAlign: "center",
                                    marginHorizontal: 0,
                                    borderRadius: 8,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            />
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => handleNumberChange("putts", (Number(putts) || 0) + 1)}
                                style={{ marginHorizontal: 0 }}
                            />
                        </View>
                    </View>

                    {/* Chips */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.chips")}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {chips > 0 && (
                                <IconButton
                                    icon="minus"
                                    size={24}
                                    onPress={() => handleNumberChange("chips", chips - 1)}
                                    style={{ marginHorizontal: 0 }}
                                />
                            )}
                            <TextInput
                                value={chips !== undefined && chips !== null ? String(chips) : ""}
                                onChangeText={v => {
                                    if (v === "") updateHoleField("chips", "");
                                    else handleNumberChange("chips", Number(v));
                                }}
                                onBlur={() => {
                                    if (
                                        chips === undefined ||
                                        chips === null ||
                                        (typeof chips === "string" && chips === "") ||
                                        isNaN(Number(chips))
                                    ) updateHoleField("chips", 0);
                                }}
                                keyboardType="numeric"
                                mode="outlined"
                                style={{
                                    width: 54,
                                    height: 38,
                                    textAlign: "center",
                                    marginHorizontal: 0,
                                    borderRadius: 8,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            />
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => handleNumberChange("chips", (Number(chips) || 0) + 1)}
                                style={{ marginHorizontal: 0 }}
                            />
                        </View>
                    </View>

                    {/* Penalty */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.penalty")}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {penalty > 0 && (
                                <IconButton
                                    icon="minus"
                                    size={24}
                                    onPress={() => handleNumberChange("penalty", penalty - 1)}
                                    style={{ marginHorizontal: 0 }}
                                />
                            )}
                            <TextInput
                                value={penalty !== undefined && penalty !== null ? String(penalty) : ""}
                                onChangeText={v => {
                                    if (v === "") updateHoleField("penalty", "");
                                    else handleNumberChange("penalty", Number(v));
                                }}
                                onBlur={() => {
                                    if (
                                        penalty === undefined ||
                                        penalty === null ||
                                        (typeof penalty === "string" && penalty === "") ||
                                        isNaN(Number(penalty))
                                    ) updateHoleField("penalty", 0);
                                }}
                                keyboardType="numeric"
                                mode="outlined"
                                style={{
                                    width: 54,
                                    height: 38,
                                    textAlign: "center",
                                    marginHorizontal: 0,
                                    borderRadius: 8,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            />
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => handleNumberChange("penalty", (Number(penalty) || 0) + 1)}
                                style={{ marginHorizontal: 0 }}
                            />
                        </View>
                    </View>

                    {/* Fairway - ligne d'IconButton */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.fairway")}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {fairwayOptions.map(opt => (
                                <IconButton
                                    key={opt.value}
                                    icon={opt.label}
                                    size={28}
                                    mode="contained"
                                    iconColor={holeData.fairway === opt.value ? colors.fa_primary : colors.text_muted}
                                    onPress={() => updateHoleField("fairway", opt.value)}
                                    style={{ marginHorizontal: 2 }}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Green - ligne d'IconButton */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.green")}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            {greenOptions.map(opt => (
                                <IconButton
                                    key={opt.value}
                                    icon={opt.label}
                                    size={28}
                                    mode="contained"
                                    iconColor={holeData.green === opt.value ? colors.fa_primary : colors.text_muted}
                                    onPress={() => updateHoleField("green", opt.value)}
                                    style={{ marginHorizontal: 2 }}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Sand - Switch */}
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <Text style={{ width: 90 }}>{t("scorecard.sand")}</Text>
                        <Switch
                            value={holeData.sand ?? false}
                            onValueChange={v => updateHoleField("sand", v)}
                            color={colors.fa_primary}
                        />
                    </View>

                    {/* Notes */}
                    <TextInput
                        label={t("scorecard.notes")}
                        value={holeData.notes ?? ""}
                        onChangeText={v => updateHoleField("notes", v)}
                        mode="outlined"
                        style={{ marginBottom: 10 }}
                        multiline
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Barre de navigation trous en bas */}
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                backgroundColor: colors.bg_secondary,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                elevation: 8,
            }}>
                {/* Flèche gauche */}
                <IconButton
                    icon="chevron-left"
                    iconColor={colors.fa_primary}
                    disabled={currentHole === 1}
                    onPress={() => goToHole(currentHole - 1)}
                    style={{ borderRadius: 24 }}
                />
                {/* Centre : numéro, par, handicap */}
                <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => setShowHoleGridModal(true)}>
                    <Text variant="titleMedium" style={{ marginHorizontal: 8 }}>
                        {t("scorecard.hole")} {currentHole}
                    </Text>
                    <Text style={{ marginHorizontal: 8, color: colors.text_muted }}>
                        {t("scorecard.par")} {grid.par[currentHole - 1]} | {t("scorecard.hcp")} {grid.handicap[currentHole - 1]}
                    </Text>
                </Pressable>
                {/* Flèche droite */}
                <IconButton
                    icon="chevron-right"
                    iconColor={colors.fa_primary}
                    disabled={false}
                    onPress={() => {
                        if (currentHole === holesCount) {
                            setShowHoleGridModal(true);
                        } else {
                            goToHole(currentHole + 1);
                        }
                    }}
                    style={{ borderRadius: 24 }}
                />
                {/* Bouton grid */}
            </View>

            {/* BottomModal pour la sélection rapide des trous */}
            <BottomModal isVisible={showHoleGridModal} dismiss={() => setShowHoleGridModal(false)}>
                <View style={{
                    alignItems: "center",
                    paddingTop: 8,
                    paddingBottom: 16,
                    backgroundColor: colors.bg_secondary,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                }}>
                    <Text style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        marginBottom: 4,
                        color: colors.fa_primary
                    }}>
                        {t("scorecard.select_hole")}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: colors.text_muted,
                        marginBottom: 16,
                        textAlign: "center"
                    }}>
                        {t("scorecard.select_hole_desc") ?? "Accédez rapidement à n'importe quel trou pour le remplir ou consulter."}
                    </Text>
                    <View style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        marginBottom: 18,
                        gap: 0,
                    }}>
                        {Array.from({ length: holesCount }, (_, i) => {
                            const filled = holesData[i].score !== undefined && holesData[i].score !== null;
                            return (
                                <Button
                                    key={i + 1}
                                    mode={currentHole === i + 1 ? "contained" : filled ? "outlined" : "text"}
                                    style={{
                                        margin: 4,
                                        minWidth: 48,
                                        borderRadius: 24,
                                        paddingHorizontal: 0,
                                        backgroundColor: currentHole === i + 1
                                            ? colors.fa_primary
                                            : filled
                                                ? colors.bg_primary
                                                : colors.bg_secondary,
                                        borderColor: filled ? colors.fa_primary : colors.text_muted,
                                        borderWidth: filled ? 2 : 1,
                                    }}
                                    labelStyle={{
                                        color: currentHole === i + 1
                                            ? "#fff"
                                            : filled
                                                ? colors.fa_primary
                                                : colors.text_normal,
                                        fontWeight: "bold"
                                    }}
                                    onPress={() => {
                                        setCurrentHole(i + 1);
                                        setShowHoleGridModal(false);
                                    }}
                                >
                                    {i + 1}
                                    {filled ? ` • ${holesData[i].score}` : ""}
                                </Button>
                            );
                        })}
                    </View>
                    <View style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: colors.text_muted,
                        marginBottom: 18,
                        opacity: 0.2,
                    }} />
                    <View style={{ flexDirection: "column", width: "100%", paddingHorizontal: 12 }}>
                        <Button
                            mode="contained"
                            icon="content-save"
                            onPress={() => {
                                setShowHoleGridModal(false);
                                handleSubmit();
                            }}
                            style={{
                                borderRadius: 24,
                                paddingVertical: 6,
                                backgroundColor: colors.fa_primary,
                                marginBottom: 12,
                            }}
                            labelStyle={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}
                        >
                            {t("commons.save")}
                        </Button>
                        <Button
                            mode="outlined"
                            icon="clipboard-list"
                            onPress={() => {
                                setShowHoleGridModal(false);
                                handleShowScorecard();
                            }}
                            style={{
                                borderRadius: 24,
                                paddingVertical: 6,
                                borderColor: colors.fa_primary,
                            }}
                            labelStyle={{ fontWeight: "bold", fontSize: 16, color: colors.fa_primary }}
                        >
                            {t("scorecard.show_summary")}
                        </Button>
                    </View>
                </View>
            </BottomModal>
        </SafeBottomContainer>
    );
};

export default ScorecardHoleFillScreen;