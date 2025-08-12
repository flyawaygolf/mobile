import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, RadioButton, Text, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SkillLevelEnum } from '../../Services/Client/Managers/Interfaces/Events';
import styles from '../../Style/style';

type PropsType = {
    value?: SkillLevelEnum;
    visible: boolean;
    hideModal: () => void;
    onChange: (skillLevel?: SkillLevelEnum) => void;
}

const SkillLevelSelector = ({ value, visible, hideModal, onChange }: PropsType) => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<SkillLevelEnum | undefined>(value);

    const skillLevels = [
        { value: undefined, label: t('event_skill.all_levels') },
        { value: SkillLevelEnum.BEGINNER, label: t('event_skill.beginner') },
        { value: SkillLevelEnum.INTERMEDIATE, label: t('event_skill.intermediate') },
        { value: SkillLevelEnum.ADVANCED, label: t('event_skill.advanced') },
        { value: SkillLevelEnum.PROFESSIONAL, label: t('event_skill.professional') },
    ];

    const confirm = () => {
        onChange(selectedLevel);
        hideModal();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideModal}>
                <Dialog.Title>{t('event_skill.title')}</Dialog.Title>
                <Dialog.Content>
                    {skillLevels.map((level, index) => (
                        <TouchableRipple
                            key={index}
                            onPress={() => setSelectedLevel(level.value)}
                        >
                            <View style={styles.row}>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value={level.value?.toString() || 'all'}
                                        status={selectedLevel === level.value ? 'checked' : 'unchecked'}
                                    />
                                </View>
                                <Text style={{ paddingLeft: 8 }}>{level.label}</Text>
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

export default SkillLevelSelector;
