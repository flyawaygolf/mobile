import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CalendarEventType } from '../../Services/Client/Managers/Interfaces/Events';
import styles from '../../Style/style';

type PropsType = {
    value: CalendarEventType;
    visible: boolean;
    hideModal: () => void;
    onChange: (eventType: CalendarEventType) => void;
}

const EventTypeSelector = ({ value, visible, hideModal, onChange }: PropsType) => {
    const { t } = useTranslation();
    const [selectedType, setSelectedType] = useState<CalendarEventType>(value);

    const eventTypes = [
        { value: CalendarEventType.TOURNAMENT, label: t('event_type.tournament') },
        { value: CalendarEventType.LESSON, label: t('event_type.lesson') },
        { value: CalendarEventType.SOCIAL, label: t('event_type.social') },
        { value: CalendarEventType.MEETING, label: t('event_type.meeting') },
    ];

    const confirm = () => {
        onChange(selectedType);
        hideModal();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideModal}>
                <Dialog.Title>{t('event_type.title')}</Dialog.Title>
                <Dialog.Content>
                    {eventTypes.map((type) => (
                        <TouchableRipple
                            key={type.value}
                            onPress={() => setSelectedType(type.value)}
                        >
                            <View style={styles.row}>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value={type.value.toString()}
                                        status={selectedType === type.value ? 'checked' : 'unchecked'}
                                    />
                                </View>
                                <Text style={{ paddingLeft: 8 }}>{type.label}</Text>
                            </View>
                        </TouchableRipple>
                    ))}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideModal}>{t('commons.cancel')}</Button>
                    <Button onPress={confirm}>{t('commons.confirm')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default EventTypeSelector;
