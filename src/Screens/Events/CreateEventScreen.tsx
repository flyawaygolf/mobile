import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { TextInput, Button, Switch, Text, Chip, List } from 'react-native-paper';

import { EventsContainer, useClient, useTheme } from '../../Components/Container';
import { SearchBar } from '../../Components/Elements/Input';
import CategorySelector from '../../Components/Events/CategorySelector';
import CompetitionFormatSelector from '../../Components/Events/CompetitionFormatSelector';
import EquipmentSelector from '../../Components/Events/EquipmentSelector';
import EventTypeSelector from '../../Components/Events/EventTypeSelector';
import HandicapModal from '../../Components/Events/HandicapModal';
import SkillLevelSelector from '../../Components/Events/SkillLevelSelector';
import { DisplayGolfs } from '../../Components/Golfs';
import { Avatar, DisplayMember } from '../../Components/Member';
import { Br } from '../../Components/Text';
import { BottomModal } from '../../Other';
import { handleToast, navigationProps } from '../../Services';
import {
    CalendarEventType,
    CompetitionFormatEnum,
    SkillLevelEnum,
    CategoryInterface
} from '../../Services/Client/Managers/Interfaces/Events';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { displayHCP } from '../../Services/handicapNumbers';


export default function CreateEventScreen() {
    const { client, user, location } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    // Helper functions pour obtenir les libellés
    const getEventTypeLabel = (type: CalendarEventType) => {
        const typeNames = ['tournament', 'lesson', 'social', 'meeting'];
        return t(`event_type.${typeNames[type]}`);
    };

    const getFormatLabel = (format: CompetitionFormatEnum) => {
        const formatNames = ['', 'stroke_play', 'match_play', 'stableford', 'best_ball', 'scramble'];
        return t(`event_format.${formatNames[format]}`);
    };

    const getSkillLevelLabel = (level?: SkillLevelEnum) => {
        if (!level) return t('events.all_levels');
        const levelNames = ['', 'beginner', 'intermediate', 'advanced', 'professional'];
        return t(`skill.${levelNames[level]}`);
    };

    const getCategoriesLabel = (cats: CategoryInterface) => {
        const selected = [
            cats.male && t('event_categories.men'),
            cats.female && t('event_categories.women'),
            cats.senior && t('event_categories.seniors'),
            cats.kid && t('event_categories.juniors')
        ].filter(Boolean);
        return selected.length > 0 ? selected.join(', ') : t('events.none_selected');
    };
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Nouveaux champs suivant la logique du pro-website
    const [eventType, setEventType] = useState<CalendarEventType>(CalendarEventType.TOURNAMENT);
    const [competitionFormat, setCompetitionFormat] = useState<CompetitionFormatEnum>(CompetitionFormatEnum.STROKE_PLAY);
    const [skillLevel, setSkillLevel] = useState<SkillLevelEnum | undefined>(undefined);

    // Restrictions d'âge
    const [minAge, setMinAge] = useState<string>('');
    const [maxAge, setMaxAge] = useState<string>('');

    // Catégories autorisées
    const [categories, setCategories] = useState<CategoryInterface>({
        male: true,
        female: true,
        senior: false,
        kid: false
    });

    // Équipements requis
    const [equipmentRequired, setEquipmentRequired] = useState<string[]>([]);

    // Frais d'inscription et règles
    const [entryFee, setEntryFee] = useState<string>('0');
    const [specialRules, setSpecialRules] = useState('');
    const [cancellationPolicy, setCancellationPolicy] = useState('');
    const [dressCode, setDressCode] = useState(false);

    // Date limite d'inscription
    const [registrationDeadline, setRegistrationDeadline] = useState<Date | null>(null);
    const [isRegistrationDeadlinePickerVisible, setRegistrationDeadlinePickerVisibility] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const [golf, setGolf] = useState<golfInterface | undefined>(undefined);
    const [is_private, setIsPrivate] = useState(false);
    const [greenFee, setGreenFee] = useState<string>("0");
    const [maxParticipantsString, setMaxParticipants] = useState<string>("2");
    const [loading, setLoading] = useState(false);

    const [players, setPlayers] = useState<userInfo[]>([]);
    const [searchPlayersList, setSearchPlayersList] = useState<userInfo[]>([]);
    const [searchPlayers, setSearchPlayers] = useState("");
    const [playersModalVisible, setPlayersModalVisible] = useState(false);

    const [golfs, setGolfs] = useState<golfInterface[]>([]);
    const [golfModalVisible, setGolfModalVisible] = useState(false);
    const [searchGolf, setSearchGolf] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(dayjs(new Date()).add(1, 'day').toDate());

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const [minHandicapModalVisible, setMinHandicapModalVisible] = useState(false);

    // Inversion de la logique : minHandicap = le plus petit, maxHandicap = le plus grand
    const [maxHandicap, setMaxHandicap] = useState<number>(540);
    const [maxHandicapModalVisible, setMaxHandicapModalVisible] = useState(false);
    const [minHandicap, setMinHandicap] = useState<number>(-100);

    // États pour les nouveaux modals
    const [eventTypeModalVisible, setEventTypeModalVisible] = useState(false);
    const [competitionFormatModalVisible, setCompetitionFormatModalVisible] = useState(false);
    const [skillLevelModalVisible, setSkillLevelModalVisible] = useState(false);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);
    const [showOptionals, setShowOptionals] = useState(false);

    const changePrivateMode = (newMode: boolean) => {
        if (newMode) {
            setIsFavorite(false);
            setIsPrivate(true);
        } else {
            setIsPrivate(false);
        }
    };

    const changeFavoriteMode = (newMode: boolean) => {
        if (newMode) {
            setIsPrivate(false);
            setIsFavorite(true);
        } else {
            setIsFavorite(false);
        }
    };

    const searchGolfsMap = async (latitude: number, longitude: number) => {
        const response = await client.search.map.golfs({
            lat: latitude,
            long: longitude,
            max_distance: 50000
        });

        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setGolfs(response.data.golfs.items);
    }

    const searchPlayersMap = async (latitude: number, longitude: number) => {
        const response = await client.search.map.users({
            lat: latitude,
            long: longitude,
            max_distance: 50000
        });

        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setSearchPlayersList(response.data.users.items);
    }

    const start = async () => {
        await Promise.all([
            searchGolfsMap(location.latitude, location.longitude),
            searchPlayersMap(location.latitude, location.longitude)
        ]);
    }

    useEffect(() => {
        if (minHandicap > maxHandicap) setMinHandicap(maxHandicap);
    }, [minHandicap, maxHandicap]);

    // Ajustement automatique de la date de fin (logique du pro-website)
    useEffect(() => {
        if (startDate && (!endDate || endDate <= startDate)) {
            const newEndDate = new Date(startDate);
            newEndDate.setHours(startDate.getHours() + 2);
            setEndDate(newEndDate);
        }
    }, [startDate]);

    useEffect(() => {
        start();
    }, []);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const linkGolf = (golf: golfInterface) => {
        setGolf(golf);
        setGolfModalVisible(false);
    }

    const searchGolfModal = async (text?: string) => {
        // searchGolf
        const response = await client.search.golfs(text ?? searchGolf, {
            location: location ? {
                lat: location.latitude,
                long: location.longitude,
            } : undefined
        });

        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setGolfs(response.data.golfs.items);
    }

    const searchPlayersModal = async (text?: string) => {
        const response = await client.search.users(text ?? searchPlayers, {
            location: location ? {
                lat: location.latitude,
                long: location.longitude,
            } : undefined
        });
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setSearchPlayersList(response.data.users.items);
    }

    const handleCreateEvent = async () => {
        if (loading) return;
        const maxParticipants = parseInt(maxParticipantsString);
        if (!title.trim().substring(0, 512) || !description.trim().substring(0, 512) || !endDate || !startDate || !golf || !maxParticipants) return handleToast(t(`errors.verify_fields`));
        if (isNaN(maxParticipants) || maxParticipants < 2 || maxParticipants > 250) return handleToast(t(`errors.verify_fields`));
        if (is_private && players.length < 1) return handleToast(t(`errors.verify_fields`));

        // Validation des dates (logique du pro-website)
        if (endDate <= startDate) {
            return handleToast(t('errors.end_date_after_start'));
        }

        setLoading(true);
        const request = await client.events.create({
            title: title,
            description: description,
            end_date: endDate,
            start_date: startDate,
            event_type: eventType,
            format: competitionFormat,
            skill_level: skillLevel,
            age_restriction: (minAge || maxAge) ? {
                min_age: minAge ? parseInt(minAge) : undefined,
                max_age: maxAge ? parseInt(maxAge) : undefined
            } : undefined,
            category: categories,
            equipment_required: equipmentRequired.length > 0 ? equipmentRequired : undefined,
            entry_fee: entryFee ? parseInt(entryFee) : undefined,
            special_rules: specialRules || undefined,
            cancellation_policy: cancellationPolicy || undefined,
            dress_code: dressCode,
            registration_deadline: registrationDeadline || undefined,
            favorites: isFavorite,
            golf_id: golf.golf_id,
            max_participants: maxParticipants,
            is_private: is_private,
            players: !is_private ? undefined : players.map((player: userInfo) => player.user_id),
            greenfee: parseInt(greenFee),
            min_handicap: maxHandicap, // inversé
            max_handicap: minHandicap, // inversé
        })
        setLoading(false);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (!request.data) return handleToast(t(`errors.unknown`));
        if (request.data) {
            handleToast(t(`commons.success`));
            navigation.navigate("EventStack", {
                screen: "DisplayEventScreen",
                params: {
                    event_id: request.data.event_id
                }
            });
        }
    };

    const sectionTitle: StyleProp<TextStyle> = {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginTop: 8,
        color: colors.text_muted
    }

    return (
        <EventsContainer navigation={navigation} title={t('events.create_event')}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <BottomModal isVisible={golfModalVisible} onSwipeComplete={() => setGolfModalVisible(false)} dismiss={() => setGolfModalVisible(false)}>
                    <View style={{
                        height: 500 - keyboardHeight
                    }}>
                        <SearchBar
                            style={{ backgroundColor: colors.bg_primary }}
                            value={searchGolf}
                            onChangeText={(txt) => {
                                setSearchGolf(txt)
                                searchGolfModal(txt)
                            }}
                            placeholder={t("golf.search")}
                            onSearchPress={() => searchGolfModal(searchGolf)}
                            onClearPress={() => setSearchGolf("")}
                        />
                        <FlatList
                            data={golfs}
                            renderItem={({ item }) => <DisplayGolfs informations={item} onPress={() => linkGolf(item)} />}
                            keyExtractor={(item) => item.golf_id}
                        />
                    </View>
                </BottomModal>

                <BottomModal isVisible={playersModalVisible} onSwipeComplete={() => setPlayersModalVisible(false)} dismiss={() => setPlayersModalVisible(false)}>
                    <View style={{
                        height: 500 - keyboardHeight
                    }}>
                        <SearchBar
                            style={{ backgroundColor: colors.bg_primary }}
                            value={searchPlayers}
                            onChangeText={(txt) => {
                                setSearchPlayers(txt);
                                searchPlayersModal(txt);
                            }}
                            placeholder={t("events.search_players")}
                            onSearchPress={() => searchPlayersModal(searchPlayers)}
                            onClearPress={() => setSearchPlayers("")}
                        />
                        <FlatList
                            data={searchPlayersList.filter(p => p.user_id !== user.user_id)}
                            renderItem={({ item }) => (
                                <DisplayMember style={{ backgroundColor: players.some(p => p.user_id === item.user_id) ? colors.bg_third : colors.bg_secondary }} informations={item} onPress={() => {
                                    if (players.some(p => p.user_id === item.user_id)) {
                                        setPlayers(players.filter(p => p.user_id !== item.user_id));
                                    } else {
                                        setPlayers([...players, item]);
                                    }
                                }} />
                            )}
                            keyExtractor={(item) => item.user_id}
                        />
                    </View>
                </BottomModal>

                <HandicapModal
                    visible={maxHandicapModalVisible}
                    hideModal={() => setMaxHandicapModalVisible(false)}
                    min={540}
                    setModif={(value) => setMaxHandicap(value)}
                    handicap={maxHandicap}
                />
                <HandicapModal
                    visible={minHandicapModalVisible}
                    hideModal={() => setMinHandicapModalVisible(false)}
                    setModif={(value) => setMinHandicap(value)}
                    handicap={minHandicap}
                    min={maxHandicap}
                />

                {/* Nouveaux modals suivant la logique du pro-website */}
                <EventTypeSelector
                    visible={eventTypeModalVisible}
                    hideModal={() => setEventTypeModalVisible(false)}
                    value={eventType}
                    onChange={setEventType}
                />

                <CompetitionFormatSelector
                    visible={competitionFormatModalVisible}
                    hideModal={() => setCompetitionFormatModalVisible(false)}
                    value={competitionFormat}
                    onChange={setCompetitionFormat}
                />

                <SkillLevelSelector
                    visible={skillLevelModalVisible}
                    hideModal={() => setSkillLevelModalVisible(false)}
                    value={skillLevel}
                    onChange={setSkillLevel}
                />

                <CategorySelector
                    visible={categoryModalVisible}
                    hideModal={() => setCategoryModalVisible(false)}
                    value={categories}
                    onChange={setCategories}
                />

                <EquipmentSelector
                    visible={equipmentModalVisible}
                    hideModal={() => setEquipmentModalVisible(false)}
                    value={equipmentRequired}
                    onChange={setEquipmentRequired}
                />

                {/* DatePickers */}
                <DatePicker
                    modal
                    minimumDate={new Date()}
                    open={isStartDatePickerVisible}
                    date={startDate}
                    onConfirm={(date) => {
                        setStartDatePickerVisibility(false)
                        setStartDate(date)
                        // Ajuster automatiquement la date de fin si nécessaire
                        if (!endDate || endDate <= date) {
                            const newEndDate = new Date(date);
                            newEndDate.setHours(date.getHours() + 2);
                            setEndDate(newEndDate);
                        }
                    }}
                    onCancel={() => {
                        setStartDatePickerVisibility(false)
                    }}
                />

                <DatePicker
                    modal
                    minimumDate={startDate}
                    open={isEndDatePickerVisible}
                    date={endDate ?? new Date()}
                    onConfirm={(date) => {
                        setEndDatePickerVisibility(false)
                        setEndDate(date)
                    }}
                    onCancel={() => {
                        setEndDatePickerVisibility(false)
                    }}
                />

                <DatePicker
                    modal
                    maximumDate={startDate}
                    open={isRegistrationDeadlinePickerVisible}
                    date={registrationDeadline ?? new Date()}
                    onConfirm={(date) => {
                        setRegistrationDeadlinePickerVisibility(false)
                        setRegistrationDeadline(date)
                    }}
                    onCancel={() => {
                        setRegistrationDeadlinePickerVisibility(false)
                    }}
                />

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text>* {t('commons.required_fields')}</Text>
                    <Br />

                    {/* SECTION : INFORMATIONS GÉNÉRALES */}
                    <Text variant='headlineMedium' style={sectionTitle}>{t("events.general_info")}</Text>
                    <TextInput
                        label={t('events.title') + ' *'}
                        value={title}
                        onChangeText={setTitle}
                        mode="outlined"
                        maxLength={64}
                        style={styles.input}
                    />
                    <TextInput
                        label={t('events.description') + ' *'}
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        maxLength={512}
                        style={styles.input}
                    />
                    <Button
                        mode="outlined"
                        onPress={() => setEventTypeModalVisible(true)}
                        style={styles.input}
                        contentStyle={styles.buttonContent}
                    >
                        {t('events.event_type')}: {getEventTypeLabel(eventType)}
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => setCompetitionFormatModalVisible(true)}
                        style={styles.input}
                        contentStyle={styles.buttonContent}
                    >
                        {t('events.competition_format')}: {getFormatLabel(competitionFormat)}
                    </Button>

                    <Br />

                    {/* SECTION : DATES ET HORAIRES */}
                    <Text variant='headlineMedium' style={sectionTitle}>{t("events.dates_and_times")}</Text>

                    <Button
                        mode="outlined"
                        onPress={() => setStartDatePickerVisibility(true)}
                        style={styles.input}
                        contentStyle={styles.buttonContent}
                    >
                        {t('events.start_date')}: {startDate.toLocaleString()} *
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => setEndDatePickerVisibility(true)}
                        style={styles.input}
                        contentStyle={styles.buttonContent}
                    >
                        {t('events.end_date')}: {endDate ? endDate.toLocaleString() : t('events.select_end_date')} *
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => setRegistrationDeadlinePickerVisibility(true)}
                        style={styles.input}
                        contentStyle={styles.buttonContent}
                    >
                        {t('events.registration_deadline')}: {registrationDeadline ? registrationDeadline.toLocaleString() : t('commons.optional')}
                    </Button>

                    <Br />

                    {/* SECTION : LIEU ET TARIFS */}
                    <Text variant='headlineMedium' style={sectionTitle}>{t("events.location_and_fees")}</Text>

                    <Button
                        mode="outlined"
                        onPress={() => setGolfModalVisible(true)}
                        style={styles.input}
                        contentStyle={styles.buttonContent}
                    >
                        {t('events.golf')}: {golf ? golf.name : t('events.select_golf')} *
                    </Button>

                    <List.Accordion expanded={showOptionals} onPress={() => setShowOptionals(!showOptionals)} title={t("commons.optional_fields")} id="1">
                        <TextInput
                            label={t('events.greenfee')}
                            value={greenFee}
                            onChangeText={setGreenFee}
                            mode="outlined"
                            keyboardType="number-pad"
                            style={styles.input}
                        />

                        <TextInput
                            label={t('events.entry_fee')}
                            value={entryFee}
                            onChangeText={setEntryFee}
                            mode="outlined"
                            keyboardType="number-pad"
                            style={styles.input}
                        />
                    </List.Accordion>

                    <Br />

                    {/* SECTION : PARTICIPANTS ET RESTRICTIONS */}
                    <Text variant='headlineMedium' style={sectionTitle}>{t("events.participants_and_restrictions")}</Text>

                    <TextInput
                        label={t('events.max_participants') + ' *'}
                        value={maxParticipantsString}
                        onChangeText={setMaxParticipants}
                        mode="outlined"
                        keyboardType="number-pad"
                        style={styles.input}
                    />

                    <List.Accordion expanded={showOptionals} onPress={() => setShowOptionals(!showOptionals)} title={t("commons.optional_fields")} id="2">
                        <Button
                            mode="outlined"
                            onPress={() => setSkillLevelModalVisible(true)}
                            style={styles.input}
                            contentStyle={styles.buttonContent}
                        >
                            {t('events.skill_level')}: {getSkillLevelLabel(skillLevel)}
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => setCategoryModalVisible(true)}
                            style={styles.input}
                            contentStyle={styles.buttonContent}
                        >
                            {t('events.categories_allowed')}: {getCategoriesLabel(categories)}
                        </Button>

                        <View style={styles.ageContainer}>
                            <TextInput
                                label={t('events.min_age')}
                                value={minAge}
                                onChangeText={setMinAge}
                                mode="outlined"
                                keyboardType="number-pad"
                                style={[styles.input, styles.halfInput]}
                            />
                            <TextInput
                                label={t('events.max_age')}
                                value={maxAge}
                                onChangeText={setMaxAge}
                                mode="outlined"
                                keyboardType="number-pad"
                                style={[styles.input, styles.halfInput]}
                            />
                        </View>

                        <Br />

                        {/* SECTION : HANDICAP */}
                        <Text variant='headlineMedium' style={sectionTitle}>{t("events.handicap_restrictions")}</Text>
                        <Button
                            mode="outlined"
                            onPress={() => setMaxHandicapModalVisible(true)}
                            style={styles.input}
                            contentStyle={styles.buttonContent}
                        >
                            {t('events.select_max_handicap', { hcp: displayHCP(maxHandicap) })}
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => setMinHandicapModalVisible(true)}
                            style={styles.input}
                            contentStyle={styles.buttonContent}
                        >
                            {t('events.select_min_handicap', { hcp: displayHCP(minHandicap) })}
                        </Button>

                        <Br />

                        {/* SECTION : RÈGLES ET CONDITIONS */}
                        <Text variant='headlineMedium' style={sectionTitle}>{t("events.rules_and_conditions")}</Text>

                        <View style={styles.switchContainer}>
                            <Text>{t("events.dress_code_required")}</Text>
                            <Switch
                                value={dressCode}
                                onValueChange={setDressCode}
                            />
                        </View>

                        <Button
                            mode="outlined"
                            onPress={() => setEquipmentModalVisible(true)}
                            style={styles.input}
                            contentStyle={styles.buttonContent}
                        >
                            {t('events.equipment_required')}: {equipmentRequired.length > 0 ? `${equipmentRequired.length} ${t('events.items')}` : t('events.none')}
                        </Button>

                        <TextInput
                            label={t('events.special_rules')}
                            value={specialRules}
                            onChangeText={setSpecialRules}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />

                        <TextInput
                            label={t('events.cancellation_policy')}
                            value={cancellationPolicy}
                            onChangeText={setCancellationPolicy}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />

                        <Br />

                        {/* SECTION : VISIBILITÉ ET ACCÈS */}
                        <Text variant='headlineMedium' style={sectionTitle}>{t("events.visibility_and_access")}</Text>

                        <View style={styles.switchContainer}>
                            <Text>{t("events.favorites")}</Text>
                            <Switch
                                value={isFavorite}
                                onValueChange={changeFavoriteMode}
                            />
                        </View>

                        <View style={styles.switchContainer}>
                            <Text>{t("events.private")}</Text>
                            <Switch
                                value={is_private}
                                onValueChange={changePrivateMode}
                            />
                        </View>

                        {is_private && (
                            <View>
                                <Button
                                    mode="outlined"
                                    onPress={() => setPlayersModalVisible(true)}
                                    style={styles.input}
                                    contentStyle={styles.buttonContent}
                                >
                                    {t('events.select_players')}: {players.length > 0 ? `${players.length} ${t('events.selected')}` : t('events.none_selected')}
                                </Button>
                                <View style={styles.playersContainer}>
                                    {players.map((item) => (
                                        <Chip
                                            key={item.user_id}
                                            compact={false}
                                            style={{ backgroundColor: colors.bg_secondary }}
                                            avatar={<Avatar size={25} url={client.user.avatar(item.user_id, item.avatar)} />}
                                            onPress={() => setPlayers(players.filter(p => p.user_id !== item.user_id))}
                                        >
                                            {item.username}
                                        </Chip>
                                    ))}
                                </View>
                            </View>
                        )}
                    </List.Accordion>

                    <Br />
                    <Button
                        mode="contained"
                        onPress={handleCreateEvent}
                        style={styles.createButton}
                        loading={loading}
                        disabled={!title || !description || !endDate || !golf}
                    >
                        {t('events.create_event')}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </EventsContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
    },
    buttonContent: {
        justifyContent: 'flex-start',
        paddingVertical: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    ageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    halfInput: {
        flex: 1,
    },
    playersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    createButton: {
        marginTop: 24,
        paddingVertical: 8,
    },
    button: {
        marginTop: 16,
    },
});
