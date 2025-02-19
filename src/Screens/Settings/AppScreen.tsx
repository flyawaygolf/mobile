import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Checkbox, Text } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Avatar } from '../../Components/Member';
import { cdnbaseurl } from '../../Services/constante';
import { languageList } from '../../locales/i18n';
import { getStorageInfo, setStorage, settingsStorageI } from '../../Services/storage';
import { Ithemes } from '../../Components/Container/Theme/Themes';
import { premiumAdvantages } from '../../Services/premiumAdvantages';
import { handleToast } from '../../Services';

// https://github.com/skb1129/react-native-change-icon/blob/master/example/android/app/src/main/AndroidManifest.xml

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

    useEffect(() => {
        setPremiumSettings(getStorageInfo("settings") as settingsStorageI)
    }, [])

    return (
        <SettingsContainer title={t("settings.app")}>
            <ScrollView style={{ padding: 5 }}>
                <Text variant='labelLarge'>{t("settings.theme")} :</Text>
                <View>
                    {
                        themes.map((t, index) => (
                            <View key={index}>
                                <TouchableOpacity
                                    style={{
                                        flexDirection: "row",
                                        backgroundColor: theme === t.value ? colors.bg_third : colors.bg_secondary,
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
                            </View>
                        )
                        )
                    }
                </View>
                <Text variant='labelLarge'>{t("settings.language")} :</Text>
                <View>
                    {
                        languageList.map((l, index) =>
                            <View key={index}>
                                <TouchableOpacity style={{
                                    flexDirection: "row",
                                    backgroundColor: i18n.language === l.code ? colors.bg_third : colors.bg_secondary,
                                    padding: 10,
                                    marginBottom: 5
                                }} onPress={() => {
                                    i18n.changeLanguage(l.code)
                                    changeStorage("language", l.code)
                                }}>
                                    <Avatar size={22} url={`${cdnbaseurl}/assets/icons/flags/${l.locale}.png`} />
                                    <Text>{l.language}</Text>
                                </TouchableOpacity>
                            </View>

                        )
                    }
                </View>
                <Text variant='labelLarge'>{t("settings.premium")} :</Text>
                <Checkbox.Item
                    disabled={advantages.translatePosts() ? false : true}
                    label={t("settings.autotranslate")}
                    status={premiumSettings?.auto_translate ? 'checked' : 'unchecked'}
                    onPress={() => changeStorage("autotranslate", !premiumSettings?.auto_translate ? "true" : "false")}
                />
            </ScrollView>
        </SettingsContainer>
    )
}