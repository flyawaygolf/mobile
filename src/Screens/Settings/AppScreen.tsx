import { FlashList } from '@shopify/flash-list';
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View , Platform} from 'react-native';
import { changeIcon, resetIcon } from 'react-native-change-icon';
import { Checkbox, Divider, Icon, Text } from 'react-native-paper';

import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Ithemes } from '../../Components/Container/Theme/Themes';
import { ShrinkEffect } from '../../Components/Effects';
import { Avatar } from '../../Components/Member';
import { languageList } from '../../locales/i18n';
import { handleToast } from '../../Services';
import { cdnbaseurl } from '../../Services/constante';
import { premiumAdvantages } from '../../Services/premiumAdvantages';
import { getStorageInfo, setStorage, settingsStorageI } from '../../Services/storage';

export default function AppScreen() {

    const { user } = useClient();
    const { t, i18n } = useTranslation();
    const { theme, setTheme, colors } = useTheme();
    const [premiumSettings, setPremiumSettings] = React.useState<settingsStorageI | undefined>({
        auto_translate: false
    });
    const advantages = premiumAdvantages(user.premium_type, user.flags);

    const changeStorage = (type: "theme" | "language" | "autotranslate", txt: string) => {
        const settings = getStorageInfo("settings") as settingsStorageI;

        switch (type) {
            case "theme":
                setStorage("settings", {
                    ...settings,
                    theme: txt
                })
                setPremiumSettings({ ...premiumSettings, theme: txt as Ithemes })
                break;
            case "language":
                setStorage("settings", {
                    ...settings,
                    locale: txt
                })
                setPremiumSettings({ ...premiumSettings, locale: txt })
                break;
            case "autotranslate":
                if(!advantages.translatePosts()) return handleToast(t("settings.premium_required"));
                setStorage("settings", {
                    ...settings,
                    auto_translate: txt === "true" ? true : false
                })
                setPremiumSettings({ ...premiumSettings, auto_translate: txt === "true" ? true : false })
                handleToast(t("commons.app_restart_required"))
                break;
            default:
                break;
        }
    }

    const themes: { value: Ithemes, label: any, bg_color: string }[] = [
        {
            bg_color: colors.fa_primary,
            value: 'auto',
            label: t("settings.auto"),
        },
        {
            bg_color: "#3B3B98",
            value: 'white',
            label: t("settings.white"),
        },
        {
            bg_color: "#E0E0E0",
            value: 'dark',
            label: t("settings.dark"),
        }
    ]

    const icons: string[] = [
        "Default",
        "Black",
        "BlueGreen",
        "Pink",
        "Green",
        "Orange"
    ]

    useEffect(() => {
        setPremiumSettings(getStorageInfo("settings") as settingsStorageI)
    }, [])

    const getIconUrl = (iconName: string) => {
        if (Platform.OS === 'android') {
          return `@mipmap/ic_launcher${iconName === "Default" ? "" : `_${iconName.toLowerCase()}`}`;
        } else {
          // Pour iOS, utilisez un chemin vers vos assets ou une URL CDN
          return `${cdnbaseurl}/assets/icons/app_icons/${iconName.toLowerCase()}.png`;
        }
      };

    return (
        <SettingsContainer title={t("settings.app")}>
            <ScrollView style={{ padding: 5 }}>
                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <Text style={{ marginBottom: 10 }} variant='labelLarge'>{t("settings.theme")} :</Text>
                    <View>
                        {
                            themes.map((t, index) => (
                                <View style={{ marginBottom: 5, backgroundColor: theme === t.value ? colors.bg_primary_opacity : undefined }} key={index}>
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            padding: 10,
                                            marginBottom: 5
                                        }} onPress={() => {
                                            setTheme(t.value)
                                            changeStorage("theme", t.value)
                                        }}>
                                        <View style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: 60 / 2,
                                            marginRight: 5,
                                            marginLeft: 0,
                                            backgroundColor: t.bg_color
                                        }} />
                                        <Text>{t.label}</Text>
                                    </TouchableOpacity>
                                    {index !== themes.length - 1 && (
                                        <Divider bold theme={{
                                            colors: {
                                                outlineVariant: colors.bg_third
                                            }
                                        }} />
                                    )}
                                </View>
                            )
                            )
                        }
                    </View>
                </View>

                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <Text style={{ marginBottom: 10 }} variant='labelLarge'>{t("settings.language")} :</Text>
                    <View>
                        {
                            languageList.map((l, index) =>
                                <View style={{ marginBottom: 5, backgroundColor: i18n.language === l.code ? colors.bg_primary_opacity : undefined }} key={index}>
                                    <TouchableOpacity style={{
                                        flexDirection: "row",
                                        padding: 10,
                                        marginBottom: 5
                                    }} onPress={() => {
                                        i18n.changeLanguage(l.code)
                                        changeStorage("language", l.code)
                                    }}>
                                        <Avatar size={22} url={`${cdnbaseurl}/assets/icons/flags/${l.locale}.png`} />
                                        <Text>{l.language}</Text>
                                    </TouchableOpacity>
                                    {index !== languageList.length - 1 && (
                                        <Divider bold theme={{
                                            colors: {
                                                outlineVariant: colors.bg_third
                                            }
                                        }} />
                                    )}
                                </View>

                            )
                        }
                    </View>
                </View>

                <View style={{ backgroundColor: colors.bg_secondary, padding: 10, borderRadius: 5, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5 }}>
                        <Text style={{ marginBottom: 10 }} variant='labelLarge'>{t("settings.app_icon")} :</Text>
                        <Icon source="star-shooting" size={16} />
                    </View>
                    <FlashList
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
                        onPress={() => changeStorage("autotranslate", !premiumSettings?.auto_translate ? "true" : "false")}
                    />
                </View>
            </ScrollView>
        </SettingsContainer>
    )
}