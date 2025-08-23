import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { Appbar, Text, Card, Button, Avatar, TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { formatDistance, handleToast, ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { full_width } from "../../Style/style";
import { useTranslation } from "react-i18next";
import { golfInterface, scoreCardInterface, scorecardGridInterface, scorecardTeeboxInterface } from "../../Services/Client/Managers/Interfaces/Golf";
import { GameModeEnum } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { ScrollView, View, Image, KeyboardAvoidingView, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CompetitionFormatEnum } from "../../Services/Client/Managers/Interfaces/Events";
import BottomModal from "../../Other/BottomModal";
import { displayHCP } from "../../Services/handicapNumbers";
import dayjs from "dayjs";

const ScorecardCreateScreen = ({ route, navigation }: ScreenNavigationProps<ScorecardStackParams, "ScorecardCreateScreen">) => {
    const { golf_id } = route.params;
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client, location, user } = useClient();

    const [golfInfo, setGolfInfo] = useState<golfInterface | null>(null);
    const [selectedScorecard, setSelectedScorecard] = useState<scoreCardInterface | null>(null);
    const [selectedGrid, setSelectedGrid] = useState<scorecardGridInterface | null>(null);
    const [selectedTeebox, setSelectedTeebox] = useState<scorecardTeeboxInterface | null>(null);
    const [gameMode, setGameMode] = useState<GameModeEnum>(GameModeEnum.PUBLIC);
    const [format, setFormat] = useState<CompetitionFormatEnum>(CompetitionFormatEnum.STROKE_PLAY);
    const [playingDate, setPlayingDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [startingHole, setStartingHole] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [showFormatModal, setShowFormatModal] = useState(false);
    const [showModeModal, setShowModeModal] = useState(false);
    const [showGridModal, setShowGridModal] = useState(false);
    const [showTeeboxModal, setShowTeeboxModal] = useState(false);
    const [finalScore, setFinalScore] = useState<string>("");

    const getGolfInfo = async () => {
        if (!golf_id) return;
        const response = await client.golfs.fetch(golf_id, {
            location: {
                lat: location?.latitude,
                long: location?.longitude,
            }
        });
        if (response.data) {
            setGolfInfo(response.data);
            setName(response.data.name);
            setSelectedScorecard(response.data.scorecards?.[0] ?? null);
            setSelectedGrid(response.data.scorecards?.[0]?.grid?.[0] ?? null);
            setSelectedTeebox(response.data.scorecards?.[0]?.grid?.[0]?.teeboxes?.[0] ?? null);
        }
    };

    useEffect(() => {
        getGolfInfo();
    }, [golf_id]);

    // Validation simple
    const isValid = golfInfo && selectedScorecard && selectedGrid && selectedTeebox && name.length > 0;

    // Soumission
    const handleSubmit = () => {
        if (!isValid) return;
        const params = {
            golf: golfInfo,
            scorecard: selectedScorecard,
            grid: selectedGrid,
            teebox: selectedTeebox,
            game_mode: gameMode,
            format: format,
            playing_date: dayjs(playingDate).toDate(),
            starting_hole: startingHole,
            name: name,
        }
        navigation.navigate("ScorecardHoleFillScreen", params);
    };

    // Fonction à remplir pour l'enregistrement direct
    const sendCard = async () => {
        if (!isValid) return;
        const request = await client.userScoreCards.create({
            teebox_id: selectedTeebox.teebox_id,
            name: name,
            format: format,
            playing_date: dayjs(playingDate).toDate(),
            starting_hole: startingHole,
            game_mode: gameMode,
            holes: [],
            total_score: Number(finalScore) || 0
        });

        if(request.error) return handleToast(t(`errors.${request.error.code}`));
        if(request.data) {
            navigation.navigate("ScorecardSummarizeScreen", { 
                user_id: user.user_id,
                user_scorecard_id: request.data.user_scorecard_id 
            });
        }
    };

    // UI
    return (
        <SafeBottomContainer>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Text variant="titleMedium">{t("scorecard.create_title")}</Text>
            </Appbar.Header>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView style={{ flex: 1 }}>
                    {/* Cover */}
                    <View style={{ width: "100%", height: 180, position: "relative" }}>
                        <Image
                            source={{ uri: client.golfs.avatar(golfInfo?.golf_id ?? "") }}
                            style={{ width: "100%", height: "100%", backgroundColor: colors.bg_secondary, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
                            resizeMode="cover"
                        />
                        <View style={{
                            position: "absolute",
                            left: 16,
                            bottom: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: colors.bg_secondary + "CC",
                            borderRadius: 16,
                            padding: 8,
                        }}>
                            <Avatar.Image
                                size={48}
                                source={{ uri: client.golfs.cover(golfInfo?.golf_id ?? "") }}
                                style={{ marginRight: 12, backgroundColor: "#fff" }}
                            />
                            <View>
                                <Text variant="titleMedium">{golfInfo?.name}</Text>
                                <Text variant="bodySmall">{golfInfo?.city}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Infos minimales */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginVertical: 16,
                    }}>
                        <View style={{ alignItems: "center" }}>
                            <Text variant="labelSmall">{t("scorecard.holes")}</Text>
                            <Text variant="titleLarge">{selectedScorecard?.holesCount ?? golfInfo?.holes ?? "?"}</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text variant="labelSmall">{t("scorecard.city")}</Text>
                            <Text variant="titleLarge">{golfInfo?.city}</Text>
                        </View>
                        <View style={{ alignItems: "center" }}>
                            <Text variant="labelSmall">{t("scorecard.handicap")}</Text>
                            <Text variant="titleLarge">{displayHCP(user?.golf_info?.handicap) ?? "-"}</Text>
                        </View>
                    </View>

                    {/* Nom de la carte */}
                    <TextInput
                        label={t("scorecard.name")}
                        value={name}
                        onChangeText={setName}
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        mode="outlined"
                    />

                    {/* Date de départ */}
                    <Button
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        onPress={() => setShowDatePicker(true)}
                        icon="calendar"
                    >
                        {t("scorecard.playing_date") + ": " + playingDate.toLocaleDateString()}
                    </Button>
                    {showDatePicker && (
                        <DateTimePicker
                            value={playingDate}
                            mode="date"
                            display="default"
                            onChange={(_, date) => {
                                setShowDatePicker(false);
                                if (date) setPlayingDate(date);
                            }}
                        />
                    )}

                    {/* Format de jeu */}
                    <Button
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        onPress={() => setShowFormatModal(true)}
                        icon="golf"
                    >
                        {t("scorecard.format") + ": " + t(`scorecard.format_${format}`)}
                    </Button>
                    <BottomModal isVisible={showFormatModal} dismiss={() => setShowFormatModal(false)}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>{t("scorecard.choose_format")}</Text>
                        {[
                            { label: t(`scorecard.format_${CompetitionFormatEnum.STROKE_PLAY}`), value: CompetitionFormatEnum.STROKE_PLAY },
                            { label: t(`scorecard.format_${CompetitionFormatEnum.MATCH_PLAY}`), value: CompetitionFormatEnum.MATCH_PLAY },
                            { label: t(`scorecard.format_${CompetitionFormatEnum.STABLEFORD}`), value: CompetitionFormatEnum.STABLEFORD },
                            { label: t(`scorecard.format_${CompetitionFormatEnum.SCRAMBLE}`), value: CompetitionFormatEnum.SCRAMBLE },
                        ].map(opt => (
                            <Button
                                key={opt.value}
                                mode={format === opt.value ? "contained" : "text"}
                                style={{ marginBottom: 8 }}
                                onPress={() => { setFormat(opt.value); setShowFormatModal(false); }}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </BottomModal>

                    {/* Mode de jeu */}
                    <Button
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        onPress={() => setShowModeModal(true)}
                        icon="account-group"
                    >
                        {t("scorecard.game_mode") + ": " + t(`scorecard.mode_${gameMode}`)}
                    </Button>
                    <BottomModal isVisible={showModeModal} dismiss={() => setShowModeModal(false)}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>{t("scorecard.choose_mode")}</Text>
                        {[
                            { label: t(`scorecard.mode_${GameModeEnum.PUBLIC}`), value: GameModeEnum.PUBLIC },
                            { label: t(`scorecard.mode_${GameModeEnum.PRIVATE}`), value: GameModeEnum.PRIVATE },
                            { label: t(`scorecard.mode_${GameModeEnum.TOURNAMENT}`), value: GameModeEnum.TOURNAMENT },
                        ].map(opt => (
                            <Button
                                key={opt.value}
                                mode={gameMode === opt.value ? "contained" : "text"}
                                style={{ marginBottom: 8 }}
                                onPress={() => { setGameMode(opt.value); setShowModeModal(false); }}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </BottomModal>

                    {/* Grid (genre) */}
                    <Button
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        onPress={() => setShowGridModal(true)}
                        icon="gender-male-female"
                    >
                        {t("scorecard.grid") + ": " + (selectedGrid?.teeboxType === "0" ? t("scorecard.male") : t("scorecard.female"))}
                    </Button>
                    <BottomModal isVisible={showGridModal} dismiss={() => setShowGridModal(false)}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>{t("scorecard.choose_grid")}</Text>
                        {selectedScorecard?.grid?.map(grid => (
                            <Button
                                key={grid.grid_id}
                                mode={selectedGrid?.grid_id === grid.grid_id ? "contained" : "text"}
                                style={{ marginBottom: 8 }}
                                onPress={() => { setSelectedGrid(grid); setSelectedTeebox(grid.teeboxes?.[0] ?? null); setShowGridModal(false); }}
                            >
                                {grid.teeboxType === "0" ? t("scorecard.male") : t("scorecard.female")}
                            </Button>
                        ))}
                    </BottomModal>

                    {/* Teebox */}
                    <Button
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        onPress={() => setShowTeeboxModal(true)}
                        icon="flag"
                    >
                        {t("scorecard.teebox") + ": " + (selectedTeebox?.name ?? "-")}
                    </Button>
                    <BottomModal isVisible={showTeeboxModal} dismiss={() => setShowTeeboxModal(false)}>
                        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>{t("scorecard.choose_teebox")}</Text>
                        {selectedGrid?.teeboxes?.map(teebox => (
                            <Card
                                key={teebox.teebox_id}
                                style={{
                                    marginBottom: 12,
                                    backgroundColor: teebox.color.hex + "22",
                                    borderWidth: selectedTeebox?.teebox_id === teebox.teebox_id ? 2 : 0,
                                    borderColor: colors.fa_primary,
                                }}
                                onPress={() => { setSelectedTeebox(teebox); setShowTeeboxModal(false); }}
                            >
                                <Card.Title
                                    title={teebox.name}
                                    left={() => (
                                        <View style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 12,
                                            backgroundColor: teebox.color.hex,
                                            borderWidth: 1,
                                            borderColor: "#ccc",
                                            marginRight: 8,
                                        }} />
                                    )}
                                    subtitle={t("scorecard.teebox_distance") + ": " + formatDistance(teebox.distances.reduce((a, b) => a + b, 0)) + "Km"}
                                />
                                <Card.Content>
                                    <Text variant="bodySmall">{t("scorecard.slope")}: {teebox.slope} | {t("scorecard.rating")}: {teebox.rating}</Text>
                                </Card.Content>
                            </Card>
                        ))}
                    </BottomModal>

                    {/* Trou de départ */}
                    <TextInput
                        label={t("scorecard.starting_hole")}
                        value={String(startingHole)}
                        onChangeText={v => {
                            let num = Number(v);
                            if (isNaN(num)) num = 1;
                            if (num < 1) num = 1;
                            if (num > (selectedScorecard?.holesCount ?? 18)) num = selectedScorecard?.holesCount ?? 18;
                            setStartingHole(num);
                        }}
                        keyboardType="numeric"
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        maxLength={2}
                    />

                    {/* Score final */}
                    <TextInput
                        label={t("scorecard.final_score") ?? "Score final"}
                        value={finalScore}
                        onChangeText={setFinalScore}
                        keyboardType="numeric"
                        mode="outlined"
                        style={{ marginBottom: 12, marginHorizontal: 16 }}
                        maxLength={4}
                    />

                    <Button
                        mode="contained"
                        onPress={finalScore ? sendCard : handleSubmit}
                        disabled={!isValid}
                        style={{ margin: 24, borderRadius: 24 }}
                        icon="arrow-right"
                    >
                        {finalScore ? (t("scorecard.save_card") ?? "Enregistrer la carte de score") : (t("scorecard.create_next") ?? "Créer une partie")}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeBottomContainer>
    );
};

export default ScorecardCreateScreen;