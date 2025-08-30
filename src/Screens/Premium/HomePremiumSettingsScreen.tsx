import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, ScrollView, View } from "react-native";
import { changeIcon, resetIcon } from 'react-native-change-icon';

import { SettingsContainer, useClient, useTheme } from '../../Components/Container';
import ShowAvailability from '../../Components/Premium/ShowAvalability';
import SettingsButtons from '../../Components/Settings/Settings/SettingsButtons';
import { handleToast, navigationProps } from '../../Services';
import { AvailabilitySlot } from '../../Services/Client/Managers/Interfaces/Me';
import { availabilityDefault, premiumAdvantages } from '../../Services/premiumAdvantages';
import { ShrinkEffect } from '../../Components/Effects';
import { cdnbaseurl } from '../../Services/constante';
import { Checkbox, Icon, Text } from 'react-native-paper';
import { Avatar } from '../../Components/Member';
import { getStorageInfo, setStorage, settingsStorageI } from '../../Services/storage';

export default function HomePremiumSettingsScreen() {

    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();
    const { colors } = useTheme();
    const { user } = useClient();

    const [schedule, setSchedule] = useState<AvailabilitySlot[]>(availabilityDefault);
    const [premiumSettings, setPremiumSettings] = useState<settingsStorageI | undefined>({
        auto_translate: false
    });

    useEffect(() => {
        if (user?.premium_settings?.availability) setSchedule(user.premium_settings.availability);
    }, [user])

    const advantages = premiumAdvantages(user.premium_type, user.flags);

    const needPremiumToast = () => handleToast(t("settings.premium_required"));

    const changeStorage = (txt: string) => {
        if(!advantages.translatePosts()) return needPremiumToast();
        const settings = getStorageInfo("settings") as settingsStorageI;

        setStorage("settings", {
            ...settings,
            auto_translate: txt === "true" ? true : false
        })
        setPremiumSettings({ ...premiumSettings, auto_translate: txt === "true" ? true : false })
        handleToast(t("commons.app_restart_required"))
    }

    const icons: string[] = [
        "Default",
        "Black",
        "BlueGreen",
        "Pink",
        "Green",
        "Orange"
    ]

    const getIconUrl = (iconName: string) => {
        if (Platform.OS === 'android') {
            return `@mipmap/ic_launcher${iconName === "Default" ? "" : `_${iconName.toLowerCase()}`}`;
        } else {
            // Pour iOS, utilisez un chemin vers vos assets ou une URL CDN
            return `${cdnbaseurl}/assets/icons/app_icons/${iconName.toLowerCase()}.png`;
        }
    };

    return (
        <SettingsContainer title={t("premium.settings_title")}>
            <ScrollView>
                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <SettingsButtons leftIcon={"alarm"} onPress={() => advantages.showAvailability() ? navigation.navigate("PremiumStack", {
                        screen: "AvailabilityPremiumSettingsScreen"
                    }) : needPremiumToast()} t={t("premium.availability_title")} />
                    <ShowAvailability schedule={schedule} />
                </View>
                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
                        <Text style={{ marginBottom: 10 }} variant='labelLarge'>{t("settings.app_icon")} :</Text>
                        <Icon source="star-shooting" size={16} />
                    </View>
                    <FlatList
                        data={icons}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ShrinkEffect
                                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 5, marginTop: 0, borderRadius: 5, width: 70, height: 70 }}
                                onPress={async () => {
                                    try {
                                        if (advantages.changeAppIcon() === false) {
                                            handleToast(t("settings.premium_required"));
                                            return;
                                        }
                                        if (item === 'Default') {
                                            await resetIcon();
                                        } else {
                                            await changeIcon(item);
                                        }
                                    } catch (error) {
                                        console.error('Error changing app icon:', error);
                                    }
                                }}
                            >
                                <Avatar size={50} url={getIconUrl(item)} />
                            </ShrinkEffect>
                        )}
                        keyExtractor={(item) => item}
                    />
                </View>

                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 5 }}>
                        <Icon source="star-shooting" size={16} />
                    </View>
                    <Checkbox.Item
                        disabled={advantages.translatePosts() ? false : true}
                        mode='android'
                        label={t("settings.autotranslate")}
                        status={premiumSettings?.auto_translate ? 'checked' : 'unchecked'}
                        onPress={() => changeStorage(!premiumSettings?.auto_translate ? "true" : "false")}
                    />
                </View>

                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 5 }}>
                        <Text style={{ marginBottom: 10 }} variant='labelLarge'>{t("settings.advantages")} :</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 25, paddingRight: 25, paddingBottom: 10 }}>
                        <Text>{t("settings.better_markown")}</Text>
                        <Icon source={advantages.betterMarkdown() ? "check" : "close"} size={16} color={advantages.betterMarkdown() ? colors.good_color : colors.warning_color} />
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 25, paddingRight: 25, paddingBottom: 10 }}>
                        <Text>{t("settings.file_size")}</Text>
                        <Text>{advantages.fileSize()} {t("settings.megabytes")}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingLeft: 25, paddingRight: 25, paddingBottom: 10 }}>
                        <Text>{t("settings.text_length")}</Text>
                        <Text>{advantages.textLength()} {t("settings.characters")}</Text>
                    </View>
                </View>
            </ScrollView>
        </SettingsContainer>
    )
}