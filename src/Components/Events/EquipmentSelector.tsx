import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, TextInput, Chip, Text, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../Components/Container';

type PropsType = {
    value: string[];
    visible: boolean;
    hideModal: () => void;
    onChange: (equipment: string[]) => void;
}

const EquipmentSelector = ({ value, visible, hideModal, onChange }: PropsType) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [equipmentList, setEquipmentList] = useState<string[]>(value);
    const [newEquipment, setNewEquipment] = useState('');

    const addEquipment = () => {
        if (newEquipment.trim() && !equipmentList.includes(newEquipment.trim())) {
            setEquipmentList(prev => [...prev, newEquipment.trim()]);
            setNewEquipment('');
        }
    };

    const removeEquipment = (index: number) => {
        setEquipmentList(prev => prev.filter((_, i) => i !== index));
    };

    const confirm = () => {
        onChange(equipmentList);
        hideModal();
    };

    const cancel = () => {
        setEquipmentList(value);
        setNewEquipment('');
        hideModal();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancel} style={{ maxHeight: '80%' }}>
                <Dialog.Title>{t('events.equipment_required')}</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ marginBottom: 16, color: 'gray' }}>
                        {t('events.equipment_help')}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <TextInput
                            style={{ flex: 1, marginRight: 8 }}
                            mode="outlined"
                            label={t('events.add_equipment')}
                            value={newEquipment}
                            onChangeText={setNewEquipment}
                            onSubmitEditing={addEquipment}
                            returnKeyType="done"
                        />
                        <IconButton
                            icon="plus"
                            mode="contained"
                            onPress={addEquipment}
                            disabled={!newEquipment.trim()}
                        />
                    </View>

                    {equipmentList.length > 0 ? (
                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 8,
                            maxHeight: 200
                        }}>
                            {equipmentList.map((equipment, index) => (
                                <Chip
                                    key={index}
                                    onClose={() => removeEquipment(index)}
                                    style={{ backgroundColor: colors.bg_secondary }}
                                >
                                    {equipment}
                                </Chip>
                            ))}
                        </View>
                    ) : (
                        <Text style={{ textAlign: 'center', color: 'gray', fontStyle: 'italic' }}>
                            {t('events.no_equipment_added')}
                        </Text>
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={cancel}>{t('common.cancel')}</Button>
                    <Button onPress={confirm}>{t('common.confirm')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default EquipmentSelector;
