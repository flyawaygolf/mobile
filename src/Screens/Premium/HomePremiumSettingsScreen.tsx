import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from "react-native";

import { SettingsContainer, useClient, useTheme } from '../../Components/Container';
import ShowAvailability from '../../Components/Premium/ShowAvalability';
import SettingsButtons from '../../Components/Settings/Settings/SettingsButtons';
import { navigationProps } from '../../Services';
import { AvailabilitySlot } from '../../Services/Client/Managers/Interfaces/Me';
import { availabilityDefault } from '../../Services/premiumAdvantages';

export default function HomePremiumSettingsScreen() {

    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();
    const { colors } = useTheme();
    const { user } = useClient();

    const [schedule, setSchedule] = useState<AvailabilitySlot[]>(availabilityDefault);

    useEffect(() => {        
        if (user?.premium_settings?.availability) setSchedule(user.premium_settings.availability);
    }, [user])


    return (
        <SettingsContainer title={t("premium.settings_title")}>
            <ScrollView>
                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <SettingsButtons leftIcon={"alarm"} onPress={() => navigation.navigate("PremiumStack", {
                        screen: "AvailabilityPremiumSettingsScreen"
                    })} t={t("premium.availability_title")} />
                    <ShowAvailability schedule={schedule} />
                </View>
            </ScrollView>
        </SettingsContainer>
    )
}