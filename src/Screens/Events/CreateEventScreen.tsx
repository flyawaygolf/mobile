import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Switch, Text } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import { useTranslation } from 'react-i18next';
import { EventsContainer, useClient, useTheme } from '../../Components/Container';
import { getCurrentLocation, handleToast, navigationProps } from '../../Services';
import { BottomModal } from '../../Other';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Search';
import { DisplayGolfs } from '../../Components/Golfs';
import { SearchBar } from '../../Components/Elements/Input';
import { useNavigation } from '@react-navigation/native';

type LocationType = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

export default function CreateEventScreen() {
    const { client } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [isFavorite, setIsFavorite] = useState(false);
    const [golf, setGolf] = useState<golfInterface | undefined>(undefined);
    const [minHandicap, setMinHandicap] = useState<number | undefined>(undefined);
    const [maxHandicap, setMaxHandicap] = useState<number | undefined>(undefined);
    const [maxParticipants, setMaxParticipants] = useState<number>(2);
    const [loading, setLoading] = useState(false);

    const [golfs, setGolfs] = useState<golfInterface[]>([]);
    const [golfModalVisible, setGolfModalVisible] = useState(false);
    const [searchGolf, setSearchGolf] = useState("");
    const [location, setLocation] = useState<LocationType | undefined>(undefined);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);


    const searchMap = async (latitude: number, longitude: number) => {
        const response = await client.search.map.golfs({
            lat: latitude,
            long: longitude,
            max_distance: 50000
        });

        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setGolfs(response.data.golfs.items);
    }

    const start = async () => {
        try {
            const position = await getCurrentLocation();
            if (position) {
                const crd = position.coords;
                const init_location = {
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }
                setLocation(init_location);
                await searchMap(crd.latitude, crd.longitude);
            }
        } catch (error) {
            handleToast(JSON.stringify(error))
        }
    }

    useEffect(() => {
        golfModalVisible && start();
    }, [golfModalVisible]);

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

    const handleCreateEvent = async () => {
        if (loading) return;
        if (!title.trim().substring(0, 512) || !description.trim().substring(0, 512) || !endDate || !startDate || !golf || !maxParticipants) return handleToast(t(`errors.verify_fields`));
        if(maxParticipants < 2 || maxParticipants > 250) return handleToast(t(`errors.verify_fields`));

        setLoading(true);
        const request = await client.events.create({
            title: title,
            description: description,
            end_date: endDate,
            start_date: startDate,
            favorites: isFavorite,
            golf_id: golf.golf_id,
            max_participants: maxParticipants,
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
                <BottomModal isVisible={golfModalVisible} dismiss={() => setGolfModalVisible(false)}>
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
                            onSearchPress={() => searchGolfModal()}
                            onClearPress={() => {
                                setSearchGolf("")
                                start()
                            }}
                        />
                        <FlatList
                            data={golfs}
                            renderItem={({ item }) => (
                                <DisplayGolfs informations={item} onPress={() => linkGolf(item)} />
                            )}
                            keyExtractor={(item) => item.golf_id}
                        />
                    </View>
                </BottomModal>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TextInput
                        label={t('events.title')}
                        value={title}
                        onChangeText={setTitle}
                        mode="outlined"
                        maxLength={64}
                        style={styles.input}
                    />
                    <TextInput
                        label={t('events.description')}
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        maxLength={512}
                        style={styles.input}
                    />
                    <TextInput
                        label={t('events.max_participants')}
                        value={maxParticipants.toString()}
                        onChangeText={(txt) => setMaxParticipants(parseInt(txt))}
                        mode="outlined"
                        keyboardType="number-pad"
                        style={styles.input}
                    />
                    
                    <Button
                        mode="outlined"
                        onPress={() => setStartDatePickerVisibility(true)}
                        style={styles.input}
                    >
                        {startDate ? startDate.toLocaleString() : t('events.select_start_date')}
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
                    <Button
                        mode="outlined"
                        onPress={() => setEndDatePickerVisibility(true)}
                        style={styles.input}
                    >
                        {endDate ? endDate.toLocaleString() : t('events.select_end_date')}
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

                    <Button
                        mode="outlined"
                        onPress={() => setGolfModalVisible(true)}
                        style={styles.input}
                    >
                        {golf ? golf.name : t('events.select_golf')}
                    </Button>
                    <View style={styles.switchContainer}>
                        <Text>{t("events.favorites")}</Text>
                        <Switch
                            value={isFavorite}
                            onValueChange={setIsFavorite}
                        />
                    </View>
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
