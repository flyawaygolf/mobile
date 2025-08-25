import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text, TouchableRipple } from 'react-native-paper';

import { CompetitionFormatEnum } from '../../Services/Client/Managers/Interfaces/Events';
import styles from '../../Style/style';

type PropsType = {
    value: CompetitionFormatEnum;
    visible: boolean;
    hideModal: () => void;
    onChange: (format: CompetitionFormatEnum) => void;
}

const CompetitionFormatSelector = ({ value, visible, hideModal, onChange }: PropsType) => {
    const { t } = useTranslation();
    const [selectedFormat, setSelectedFormat] = useState<CompetitionFormatEnum>(value);

    const formats = [
        { value: CompetitionFormatEnum.STROKE_PLAY, label: t('event_format.stroke_play') },
        { value: CompetitionFormatEnum.MATCH_PLAY, label: t('event_format.match_play') },
        { value: CompetitionFormatEnum.STABLEFORD, label: t('event_format.stableford') },
        { value: CompetitionFormatEnum.BEST_BALL, label: t('event_format.best_ball') },
        { value: CompetitionFormatEnum.SCRAMBLE, label: t('event_format.scramble') },
    ];

    const confirm = () => {
        onChange(selectedFormat);
        hideModal();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideModal}>
                <Dialog.Title>{t('event_format.title')}</Dialog.Title>
                <Dialog.Content>
                    {formats.map((format) => (
                        <TouchableRipple
                            key={format.value}
                            onPress={() => setSelectedFormat(format.value)}
                        >
                            <View style={styles.row}>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value={format.value.toString()}
                                        status={selectedFormat === format.value ? 'checked' : 'unchecked'}
                                    />
                                </View>
                                <Text style={{ paddingLeft: 8 }}>{format.label}</Text>
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

export default CompetitionFormatSelector;
