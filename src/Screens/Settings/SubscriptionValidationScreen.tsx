import { useNavigation } from "@react-navigation/native";
import { useStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Text, Card, TextInput } from 'react-native-paper';

import { useClient, SettingsContainer, useTheme } from '../../Components/Container';
import { axiosInstance, handleToast, navigationProps, openURL } from '../../Services';
import { SubscriptionInterface } from '../../Services/Client/Managers/Interfaces';
import { usertokenkey } from '../../Services/constante';

function SubscriptionValidationScreen({ route }: any) {

    const { t } = useTranslation();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const navigation = useNavigation<navigationProps>();
    const client = useClient();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const { subscription }: { subscription: SubscriptionInterface.getSubscriptionsResponseInterface; title: string } = route.params;

    const fetchPaymentSheetParams = async (subscription_id: string, coupon_id?: string) => {
        const request = await axiosInstance.post(`/subscriptions/${subscription_id}/checkout`, { coupon_id: coupon_id }, {
            headers: {
                [usertokenkey]: client.user.token
            }
        })

        const response = request.data;
        if (response.data) {
            if (response.data.url) {
                return await openURL(response.data.url);
            } else {                
                return response.data.info;
            }
        } else {
            return handleToast(t(`errors.${response.error.code}`));
        }
    };

    const initializePaymentSheet = async (subscription_id: string) => {
        const request = await fetchPaymentSheetParams(subscription_id);
        if (!request) return handleToast(`[50] Error`);
        const { paymentIntent, ephemeralKey, customer } = request;

        const { error } = await initPaymentSheet({
            merchantDisplayName: "FlyAway",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: false,
        });
        setLoading(false)
        if (error) return console.log(error);
    };

    const openPaymentSheet = async () => {
        setLoading(true)
        const { error } = await presentPaymentSheet();

        if (error) {
            handleToast(`Error : ${error.message}`)
            setLoading(false)
        } else {
            const newUser = await client.client.user.myinformations();
            client.setValue(newUser);
            handleToast(`Success Your order is confirmed!`)
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'BottomNavigation' }] // Navigate to Home
                })
            }, 500)
        }
    };

    useEffect(() => {
        initializePaymentSheet(subscription.subscription_id)
    }, [subscription])

    return (
        <SettingsContainer title={t("settings.subscriptions_checkout")}>
            <Card>
                <Card.Content>
                    <Text variant="titleLarge">{t("subscription.recap")} :</Text>
                    <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.subscription") as string} value={t("settings.premium")} editable={false} />
                    <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.price") as string} value={t(`subscription.price_type_${subscription.interval}`, { subscription_price: `${(subscription.price / 100).toFixed(2)}` }) as string} editable={false} />
                    {
                        // <TextInput style={{ marginBottom: 5, marginTop: 5 }} mode='outlined' label={t("subscription.coupon")} value={coupon} disabled={true} />
                    }
                </Card.Content>
                <Card.Actions>
                    <Button onPress={() => navigation.goBack()}>{t("commons.cancel")}</Button>
                    <Button mode='elevated' textColor="#FFFFFF" theme={{ colors: { elevation: { level1: colors.good_color }} }} loading={loading} onPress={() => openPaymentSheet()}>{t("subscription.checkout")}</Button>
                </Card.Actions>
            </Card>
        </SettingsContainer>
    )
}

export default SubscriptionValidationScreen;