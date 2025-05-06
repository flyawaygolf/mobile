import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';
import { changeIcon, resetIcon } from 'react-native-change-icon';
import { Checkbox, Divider, Icon, Text } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import SettingsContainer from '../../Components/Container/SettingsContainer';
import { Avatar } from '../../Components/Member';
import { cdnbaseurl } from '../../Services/constante';
import { languageList } from '../../locales/i18n';
import { getStorageInfo, setStorage, settingsStorageI } from '../../Services/storage';
import { Ithemes } from '../../Components/Container/Theme/Themes';
import { premiumAdvantages } from '../../Services/premiumAdvantages';
import { handleToast } from '../../Services';
import { ShrinkEffect } from '../../Components/Effects';

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

    const icons: string[] = [
        "Default",
        "Pink",
        "Orange",
        "Green",
        "Black"
    ]

    useEffect(() => {
        setPremiumSettings(getStorageInfo("settings") as settingsStorageI)
    }, [])

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
                                <Avatar size={50} url={`@mipmap/ic_launcher${item === "Default" ? "" : `_` + item.toLowerCase()}`} />
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
                        label={t("settings.autotranslate")}
                        status={premiumSettings?.auto_translate ? 'checked' : 'unchecked'}
                        onPress={() => changeStorage("autotranslate", !premiumSettings?.auto_translate ? "true" : "false")}
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