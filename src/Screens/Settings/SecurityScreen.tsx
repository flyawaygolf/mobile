import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ScrollView, View } from 'react-native';
import { Text, Button, Dialog, Paragraph, Portal, TextInput as PaperTextInput, Appbar, TextInput } from 'react-native-paper';
import { useRealm } from '@realm/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useClient, useTheme } from '../../Components/Container';
import { cguLink, cgvLink, navigationProps, openURL, privacyLink } from '../../Services';
import { deleteUser } from '../../Services/Realm/userDatabase';
import { full_width } from '../../Style/style';
import SettingsButtons from '../../Components/Settings/Settings/SettingsButtons';

function SecurityScreen() {

    const navigation = useNavigation<navigationProps>();
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const client = useClient();
    const { colors } = useTheme();
    const realm = useRealm();

    const hideDialog = () => setVisible(false);

    const deleteAccount = async () => {
        if (loading) return;
        setLoading(true);

        const response = await client.client.user.delete(password);

        setLoading(false);
        if (response.error) return setError(t(`errors.${response.error.code}`) as string);

        deleteUser(realm, client.user.user_id)

        client.setValue({ ...client, client: client.client, token: client.token, user: client.user, state: "switch_user" })
    }


    return (
        <SafeAreaView style={{ backgroundColor: colors.bg_primary, height: "100%" }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", alignItems: "center" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Text variant="titleSmall">{t("settings.security")}</Text>
            </Appbar.Header>
            <View style={{ padding: 5 }}>
                <SettingsButtons onPress={() => openURL(cguLink(i18n.language))} t={t("settings.terms_of_use")} />
                <SettingsButtons onPress={() => openURL(cgvLink(i18n.language))} t={t("settings.terms_of_sales")} />
                <SettingsButtons onPress={() => openURL(privacyLink(i18n.language))} t={t("settings.privacy")} />
                <SettingsButtons onPress={() => setVisible(true)} t={t("settings.delete_account")} />
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>{t("settings.delete_account")}</Dialog.Title>
                        {error.length > 0 && <Dialog.Content>
                            <Text style={{ color: colors.warning_color }}>{error}</Text>
                        </Dialog.Content>}
                        <Dialog.ScrollArea>
                            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
                                <Paragraph>
                                    {t("settings.sure_delete_account")}
                                </Paragraph>
                                <TextInput
                                    label={`${t("login.password")}`}
                                    autoCapitalize="none"
                                    secureTextEntry={showPass}
                                    returnKeyType="next"
                                    right={<PaperTextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off"} />}
                                    value={password}
                                    onChangeText={(text: string) => setPassword(text)}
                                />
                            </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                            <Button uppercase={false} loading={loading} onPress={() => deleteAccount()}>{t("commons.continue")}</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </SafeAreaView>
    )
}

export default SecurityScreen;
