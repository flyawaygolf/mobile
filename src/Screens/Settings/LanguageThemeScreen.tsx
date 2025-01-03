import React from 'react';
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Avatar } from '../../Components/Member';
import { cdnbaseurl } from '../../Services/constante';
import { languageList } from '../../locales/i18n';
import { getStorageInfo, setStorage, settingsStorageI } from '../../Services/storage';
import { ScrollView } from 'react-native-gesture-handler';
import { Ithemes } from '../../Components/Container/Theme/Themes';

// https://github.com/skb1129/react-native-change-icon/blob/master/example/android/app/src/main/AndroidManifest.xml

function LanguageThemeScreen() {

    const { t, i18n } = useTranslation();
    const { theme, setTheme, colors } = useTheme();

    const changeStorage = (type: "theme" | "language", txt: string) => {
        const settings = getStorageInfo("settings") as settingsStorageI;

        switch (type) {
            case "theme":
                setStorage("settings", {
                    theme: txt,
                    locale: settings?.locale
                })
                break;
            case "language":
                setStorage("settings", {
                    theme: settings?.theme,
                    locale: txt
                })
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

    return (
        <SettingsContainer title={t("settings.lang_and_theme")}>
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
                                    backgroundColor: i18n.language === l.locale ? colors.bg_third : colors.bg_secondary,
                                    padding: 10,
                                    marginBottom: 5
                                }} onPress={() => {
                                    i18n.changeLanguage(l.locale)
                                    changeStorage("language", l.locale)
                                }}>
                                    <Avatar size={22} url={`${cdnbaseurl}/assets/icons/flags/${l.locale}.png`} />
                                    <Text>{l.language}</Text>
                                </TouchableOpacity>
                            </View>

                        )
                    }
                </View>
            </ScrollView>
        </SettingsContainer>
    )
}

export default LanguageThemeScreen;