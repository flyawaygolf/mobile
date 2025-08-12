import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, Checkbox, Text, TouchableRipple } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { CategoryInterface } from '../../Services/Client/Managers/Interfaces/Events';
import styles from '../../Style/style';

type PropsType = {
    value: CategoryInterface;
    visible: boolean;
    hideModal: () => void;
    onChange: (categories: CategoryInterface) => void;
}

const CategorySelector = ({ value, visible, hideModal, onChange }: PropsType) => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<CategoryInterface>(value);

    const categoryOptions = [
        { key: 'male' as keyof CategoryInterface, label: t('event_categories.men') },
        { key: 'female' as keyof CategoryInterface, label: t('event_categories.women') },
        { key: 'senior' as keyof CategoryInterface, label: t('event_categories.seniors') },
        { key: 'kid' as keyof CategoryInterface, label: t('event_categories.juniors') },
    ];

    const toggleCategory = (key: keyof CategoryInterface) => {
        setCategories(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const confirm = () => {
        onChange(categories);
        hideModal();
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideModal}>
                <Dialog.Title>{t('event_categories.title')}</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ marginBottom: 16, color: 'gray' }}>
                        {t('event_categories.help')}
                    </Text>
                    {categoryOptions.map((option) => (
                        <TouchableRipple
                            key={option.key}
                            onPress={() => toggleCategory(option.key)}
                        >
                            <View style={styles.row}>
                                <View pointerEvents="none">
                                    <Checkbox
                                        status={categories[option.key] ? 'checked' : 'unchecked'}
                                    />
                                </View>
                                <Text style={{ paddingLeft: 8 }}>{option.label}</Text>
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

export default CategorySelector;
