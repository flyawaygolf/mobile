import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Switch, Text, Icon, Chip } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { EventsContainer, useClient, useTheme } from '../../Components/Container';
import { handleToast, navigationProps } from '../../Services';
import { BottomModal } from '../../Other';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { DisplayGolfs } from '../../Components/Golfs';
import { SearchBar } from '../../Components/Elements/Input';
import HandicapModal from '../../Components/Events/HandicapModal';
import { displayHCP } from '../../Services/handicapNumbers';
import { Br } from '../../Components/Text';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { Avatar, DisplayMember } from '../../Components/Member';

export default function CreateEventScreen() {
    const { client, user, location } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

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
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const [minHandicapModalVisible, setMinHandicapModalVisible] = useState(false);
    const [minHandicap, setMinHandicap] = useState<number>(540);

    const [maxHandicapModalVisible, setMaxHandicapModalVisible] = useState(false);
    const [maxHandicap, setMaxHandicap] = useState<number>(-100);

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
        if (maxHandicap > minHandicap) setMaxHandicap(minHandicap);
    }, [minHandicap, maxHandicap]);

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

        setLoading(true);
        const request = await client.events.create({
            title: title,
            description: description,
            end_date: endDate,
            start_date: startDate,
            favorites: isFavorite,
            golf_id: golf.golf_id,
            max_participants: maxParticipants,
            is_private: is_private,
            players: !is_private ? undefined : players.map((player: userInfo) => player.user_id),
            greenfee: parseInt(greenFee),
            min_handicap: minHandicap,
            max_handicap: maxHandicap,
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
                    visible={minHandicapModalVisible}
                    hideModal={() => setMinHandicapModalVisible(false)}
                    setModif={(value) => setMinHandicap(value)}
                    handicap={minHandicap}
                />
                <HandicapModal
                    visible={maxHandicapModalVisible}
                    hideModal={() => setMaxHandicapModalVisible(false)}
                    min={minHandicap}
                    setModif={(value) => setMaxHandicap(value)}
                    handicap={maxHandicap}
                />
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text>* {t('commons.required_fields')}</Text>
                    <Br />
                    <Text variant='bodyLarge' style={{ textDecorationLine: "underline" }}>{t("events.general_info")}:</Text>
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
                    <TextInput
                        label={t('events.max_participants')}
                        value={maxParticipantsString}
                        onChangeText={(txt) => setMaxParticipants(txt)}
                        mode="outlined"
                        keyboardType="number-pad"
                        style={styles.input}
                    />

                    <Br />
                    <Text variant='bodyLarge' style={{ textDecorationLine: "underline" }}>{t("events.location")}:</Text>
                    <TextInput
                        label={t('events.greenfee')}
                        value={greenFee}
                        onChangeText={setGreenFee}
                        mode="outlined"
                        keyboardType="number-pad"
                        style={styles.input}
                    />
                    <Button
                        mode="outlined"
                        onPress={() => setGolfModalVisible(true)}
                        style={styles.input}>
                        {(golf ? golf.name : t('events.select_golf')) + ' *'}
                    </Button>

                    <Br />
                    <Text variant='bodyLarge' style={{ textDecorationLine: "underline" }}>{t("events.dates")}:</Text>
                    <Button
                        mode="outlined"
                        onPress={() => setStartDatePickerVisibility(true)}>
                        {(startDate ? startDate.toLocaleString() : t('events.select_start_date'))}
                    </Button>
                    <DatePicker
                        modal
                        minimumDate={new Date()}
                        open={isStartDatePickerVisible}
                        date={startDate}
                        onConfirm={(date) => {
                            setStartDatePickerVisibility(false)
                            setStartDate(date)
                        }}
                        onCancel={() => {
                            setStartDatePickerVisibility(false)
                        }}
                    />
                    <View style={{ display: "flex", flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 5 }}>
                        <Icon source={"arrow-down"} size={30} />
                    </View>
                    <Button
                        mode="outlined"
                        onPress={() => setEndDatePickerVisibility(true)}
                        style={styles.input}
                    >
                        {(endDate ? endDate.toLocaleString() : t('events.select_end_date')) + " *"}
                    </Button>
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

                    <Br />
                    <Text variant='bodyLarge' style={{ textDecorationLine: "underline" }}>{t("events.handicap")}:</Text>
                    <Button
                        mode="outlined"
                        onPress={() => setMinHandicapModalVisible(true)}
                        style={styles.input}>
                        {t('events.select_min_handicap', {
                            hcp: displayHCP(minHandicap)
                        })}
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => setMaxHandicapModalVisible(true)}
                        style={styles.input}>
                        {t('events.select_max_handicap', {
                            hcp: displayHCP(maxHandicap)
                        })}
                    </Button>


                    <Br />
                    <Text variant='bodyLarge' style={{ textDecorationLine: "underline" }}>{t("events.visibility")}:</Text>
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
                    {
                        is_private && (
                            <View>
                                <Button
                                    mode="outlined"
                                    onPress={() => setPlayersModalVisible(true)}
                                    style={styles.input}
                                >
                                    {t('events.select_players')}
                                </Button>
                                <View style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 8
                                }}>
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
                        )
                    }

                    <Br />
                    <Button
                        mode="contained"
                        onPress={handleCreateEvent}
                        style={styles.button}
                        loading={loading}
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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
    },
});
