import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Button, Dialog, Portal, RadioButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { SettingsContainer, useClient } from '../../Components/Container';
import PremiumButtons from '../../Components/Settings/Settings/PremiumButtons';
import { SubscriptionInterface } from '../../Services/Client/Managers/Interfaces';
import { handleToast, navigationProps, openURL } from '../../Services';
import { useNavigation } from '@react-navigation/native';

export default function PremiumScreen() {

    const { t } = useTranslation();
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();

    const [functionnalities] = useState([
        {
            icon: "file-plus",
            title: "premium.heavier_files_title",
            description: "premium.heavier_files_description"
        },
        {
            icon: "card-text",
            title: "premium.more_text_title",
            description: "premium.more_text_description"
        },
        {
            icon: "translate",
            title: "premium.automatic_translate_title",
            description: "premium.automatic_translate_description"
        },
        {
            icon: "eye",
            title: "premium.view_post_impressions_title",
            description: "premium.view_post_impressions_description"
        },
        {
            icon: "format-line-style",
            title: "premium.better_markdown_title",
            description: "premium.better_markdown_description"
        },
        {
            icon: "star-shooting",
            title: "premium.premium_badge_title",
            description: "premium.premium_badge_description"
        },
        {
            icon: "apps",
            title: "premium.app_icon_title",
            description: "premium.app_icon_description",
            soon: true
        },
        {
            icon: "map-marker-radius",
            title: "premium.location_choose_title",
            description: "premium.location_choose_description",
            soon: true
        },
        {
            icon: "comment",
            title: "premium.golf_comment_title",
            description: "premium.golf_comment_description",
            soon: true
        },
        {
            icon: "calendar-multiselect",
            title: "premium.availability_title",
            description: "premium.availability_description",
            soon: true
        },
        {
            icon: "bell",
            title: "premium.personnalize_notification_title",
            description: "premium.personnalize_notification_description",
            soon: true
        },
        {
            icon: "shield-account-variant",
            title: "premium.private_account_title",
            description: "premium.private_account_description",
            soon: true
        },
        {
            icon: "cctv-off",
            title: "premium.no_ads_title",
            description: "premium.no_ads_description",
            soon: true
        }
    ])

    const [loading, setLoading] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [subscriptions, setSubscriptions] = useState<SubscriptionInterface.getSubscriptionsResponseInterface[]| undefined>(undefined);
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionInterface.intervalType>("year");

    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);

    const openDashboardPage = async () => {
        if (loading) return;
        setLoading(true)
        const request = await client.subscription.dashboard();

        const response = request;

        if (response.data) {
            hideDialog()
            setLoading(false)
            openURL(response.data.url)

        } else {
            hideDialog()
            setLoading(false)
            handleToast(t(`errors.${request?.error?.code}`))
        }
    }

    const getSubscriptions = async () => {
        const request = await client.subscription.fetch();        
        const response = request.data;
        if (response) return setSubscriptions(response.sort((a, b) => a.price - b.price))
    }

    useEffect(() => {
        getSubscriptions()
    }, [])

    const openCheckOutPage = async () => {
        if(!subscriptions) return;
        const find_sub = subscriptions.find(s => s.interval === subscriptionType);
        if(!find_sub) return;
        setLoading(true)
        hideDialog()
        setLoading(false)
        navigation.navigate("SettingsStack", {
            screen: "SubscriptionValidationScreen",
            params: {
                subscription: find_sub
            }
        })
    }

    // Définition des couleurs du gradient sous forme de HSL
    const getGradientColor = (index: number, total: number) => {
        // Commence à orange (30°) et fait le tour du cercle chromatique
        const hue = 30 + (300 * index / (total - 1));
        return {
            background: `hsla(${hue}, 90%, 95%, 1)`,
            tint: `hsl(${hue}, 80%, 50%)`
        };
    };


    return (
        <SettingsContainer title={t("settings.premium")}>
            <Portal>
                <Dialog visible={visible} onDismiss={loading ? undefined : hideDialog}>
                    <Dialog.Title>{t("subscription.make_your_choice")}</Dialog.Title>
                    <Dialog.Content>
                        {
                            subscriptions?.map((s, idx) => (
                                <RadioButton.Item
                                    key={idx}
                                    label={t(`subscription.price_type_${s.interval}`, {
                                        subscription_price: `${(s.price / 100).toFixed(2)}`,
                                    })}
                                    value={s.interval}
                                    status={subscriptionType === s.interval ? 'checked' : 'unchecked'}
                                    onPress={() => setSubscriptionType(s.interval)}
                                />
                            ))
                        }
                    </Dialog.Content>
                    <Dialog.Actions>
                        {loading ? false : <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>}
                        <Button uppercase={false} loading={loading} onPress={() => openCheckOutPage()}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <ScrollView style={{ padding: 5 }}>
                {
                    functionnalities.map((item, index) => {
                        const colors = getGradientColor(index, functionnalities.length);
                        return (
                            <PremiumButtons
                                soon={item.soon}
                                colors={colors}
                                key={index}
                                title={t(item.title)}
                                description={t(item.description)}
                                leftIcon={item.icon}
                            />
                        );
                    })
                }
                <View style={{ marginBottom: 20 }}>
                {
                    Platform.OS === "ios" ? <Button>{t("subscription.ios_blocked")}</Button> : user.premium_type !== 0 ? <Button mode='contained' style={{ marginTop: 10 }} loading={loading} focusable={!loading} onPress={() => openDashboardPage()}>{t("subscription.dashboard")}</Button> : <Button mode='contained' style={{ marginTop: 10 }} onPress={() => showDialog()}>{t("subscription.subscribe")}</Button>
                }     
                </View>    
            </ScrollView>
        </SettingsContainer>
    )
}