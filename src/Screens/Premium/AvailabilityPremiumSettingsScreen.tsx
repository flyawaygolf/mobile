import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SettingsContainer, useClient, useTheme } from '../../Components/Container';
import { IconButton, Switch } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { AvailabilitySlot } from '../../Services/Client/Managers/Interfaces/Me';
import { availabilityDefault } from '../../Services/premiumAdvantages';
import { handleToast, messageFormatDate } from '../../Services';

export default function AvailabilityPremiumSettingsScreen() {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { user, client, setValue } = useClient();
    const all_client = useClient();

    const [schedule, setSchedule] = useState<AvailabilitySlot[]>(availabilityDefault);
    const [showAvailability, setShowAvailability] = useState<boolean>(false);

    useEffect(() => {
        if (user?.premium_settings?.availability) setSchedule(user.premium_settings.availability);
    }, [user]);

    const [showTimePicker, setShowTimePicker] = useState<{
        visible: boolean;
        day: number;
        type: 'start' | 'end';
    }>({ visible: false, day: 0, type: 'start' });

    const days = [
        { key: 1, label: t("premium.day_1"), icon: '📅' },
        { key: 2, label: t("premium.day_2"), icon: '📅' },
        { key: 3, label: t("premium.day_3"), icon: '📅' },
        { key: 4, label: t("premium.day_4"), icon: '📅' },
        { key: 5, label: t("premium.day_5"), icon: '📅' },
        { key: 6, label: t("premium.day_6"), icon: '🌅' },
        { key: 7, label: t("premium.day_7"), icon: '☀️' },
    ];

    const toggleDay = (dayIndex: number) => {
        setSchedule(prev => prev.map((slot, index) =>
            index === dayIndex
                ? { ...slot, available: !slot.available }
                : slot
        ));
    };

    const formatTime = (time: Date) => {
        return messageFormatDate(time).time()
    };

    const showTimeSelector = (day: number, type: 'start' | 'end') => {
        setShowTimePicker({ visible: true, day, type });
    };

    const onTimeChange = (_event: DateTimePickerEvent, selectedTime?: Date) => {
        setShowTimePicker({ visible: false, day: 0, type: 'start' });

        if (selectedTime && showTimePicker.day) {
            const { day, type } = showTimePicker;
            const dayIndex = day - 1; // Convertir la clé du jour (1-7) en index (0-6)

            setSchedule(prev => prev.map((slot, index) =>
                index === dayIndex
                    ? { ...slot, [type === 'start' ? 'start' : 'end']: selectedTime }
                    : slot
            ));
        }
    };

    const saveSchedule = async () => {
        try {
            const new_availability = schedule.map((slot, idx) => ({
                id: idx + 1,
                available: slot.available,
                start: slot.start,
                end: slot.end
            }));

            const request = await client.user.premium.edit({
                availability: new_availability,
                show_availability: showAvailability
            })
            if (request.error || !request.data) return handleToast(t(`erros.${request.error?.code}`));
            handleToast(t("errors.success"));
            setValue({
                ...all_client,
                user: {
                    ...user,
                    premium_settings: {
                        ...all_client.user.premium_settings,
                        availability: new_availability
                    }
                }
            })
            return;
        } catch (error) {
            console.log(error);
        }
    };

    const resetSchedule = () => {
        Alert.alert(
            t("premium.reset_schedule_title"),
            t("premium.reset_schedule_description"),
            [
                { text: t("commons.cancel"), style: 'cancel' },
                {
                    text: t("commons.continue"),
                    style: 'destructive',
                    onPress: () => setSchedule(availabilityDefault)
                }
            ]
        );
    };

    return (
        <SettingsContainer leftComponent={(
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton
                    onPress={() => resetSchedule()}
                    icon="refresh"
                />
                <IconButton
                    onPress={() => saveSchedule()}
                    icon="content-save"
                />
            </View>
        )} title={t("premium.availability_title")}>
            <ScrollView>
                <View style={styles.content}>
                    <View style={[{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                            <Text>
                                {t("premium.show_availability_title")}
                            </Text>
                            <Switch
                                value={showAvailability}
                                onValueChange={setShowAvailability}
                                thumbColor={'#FFFFFF'}
                            />
                        </View>
                        <Text>
                            {t("premium.show_availability_description")}
                        </Text>
                    </View>
                    {days.map(({ key, label, icon }, idx) => {
                        return (
                            <View key={idx} style={[
                                styles.dayCard,
                                {
                                    backgroundColor: colors.bg_secondary,
                                },
                                schedule[idx].available ? {
                                    borderColor: colors.fa_primary,
                                } : {
                                    borderColor: '#95A5A6',
                                }
                            ]}>
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayInfo}>
                                        <Text style={styles.dayIcon}>{icon}</Text>
                                        <Text style={[
                                            styles.dayLabel,
                                            schedule[idx].available ? {
                                                color: colors.text_normal
                                            } : styles.dayLabelDisabled
                                        ]}>
                                            {label}
                                        </Text>
                                    </View>
                                    <Switch
                                        value={schedule[idx].available}
                                        onValueChange={() => toggleDay(idx)}
                                        thumbColor={schedule[idx].available ? '#FFFFFF' : '#FFFFFF'}
                                    />
                                </View>

                                {schedule[idx].available && (
                                    <View style={styles.timeContainer}>
                                        <TouchableOpacity
                                            style={styles.timeButton}
                                            onPress={() => showTimeSelector(key, 'start')}
                                        >
                                            <Text style={styles.timeLabel}>{t("premium.start")}</Text>
                                            <Text style={styles.timeValue}>
                                                {formatTime(schedule[idx].start)}
                                            </Text>
                                        </TouchableOpacity>

                                        <View style={styles.timeSeparator}>
                                            <Text style={styles.timeSeparatorText}>→</Text>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.timeButton}
                                            onPress={() => showTimeSelector(key, 'end')}
                                        >
                                            <Text style={styles.timeLabel}>{t("premium.end")}</Text>
                                            <Text style={styles.timeValue}>
                                                {formatTime(schedule[idx].end)}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {!schedule[idx].available && (
                                    <View style={styles.disabledMessage}>
                                        <Text style={styles.disabledText}>🚫 {t("premium.not_available")}</Text>
                                    </View>
                                )}
                            </View>
                        )
                    })}
                </View>

                {showTimePicker.visible && (
                    <DateTimePicker
                        value={new Date(schedule[showTimePicker.day]?.[showTimePicker.type === 'start' ? 'start' : 'end']) || new Date()}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={(e, d) => onTimeChange(e, d)}
                    />
                )}
            </ScrollView>
        </SettingsContainer >
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 16,
    },
    dayCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dayIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    dayLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    dayLabelDisabled: {
        color: '#95A5A6',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timeButton: {
        flex: 1,
        backgroundColor: '#E8F5E8',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        color: '#27AE60',
        fontWeight: '500',
        marginBottom: 4,
    },
    timeValue: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: 'bold',
    },
    timeSeparator: {
        paddingHorizontal: 16,
    },
    timeSeparatorText: {
        fontSize: 20,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    disabledMessage: {
        alignItems: 'center',
        padding: 8,
    },
    disabledText: {
        color: '#95A5A6',
        fontSize: 14,
        fontStyle: 'italic',
    }
});
