import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { FlatList, View } from 'react-native';
import { Text, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { SettingsContainer, useClient, useTheme } from '../../Components/Container';
import { handleToast } from '../../Services';
import { fetchSessionsResponseSchema } from '../../Services/Client/Managers/Interfaces/Session';
import SessionBox from '../../Components/Settings/Session/SessionBox';

function SessionScreen() {

    const { t } = useTranslation();
    const { client, user } = useClient();
    const { colors } = useTheme();
    const [visible, setVisible] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [error] = useState("");
    const [loading] = useState(false);
    const [all, setAll] = useState(false);
    const [info, setInfo] = useState<fetchSessionsResponseSchema[] | undefined>(undefined)

    const hideDialog = () => setVisible(false);

    useEffect(() => {
        async function getData() {
            const request = await client.sessions.fetch();
            if (request.error || !request.data) return;
            setInfo(request.data as fetchSessionsResponseSchema[])
        }

        getData()
    }, [])

    const deleteOneSession = async (target_id?: string) => {
        if (!target_id) return;
        const response = await client.sessions.deleteOne(target_id, { password: password });
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        setInfo(info?.filter((u) => u.session_id !== target_id))
        setVisible(false)
    }

    const deleteAllSession = async () => {
        const response = await client.sessions.deleteAll(password);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        setInfo(info?.filter((s) => s.session_id === user.session_id))
        setVisible(false)
    }

    const renderItem = useCallback(({ item }: { item: fetchSessionsResponseSchema }) => (
        <View style={{ flex: 1, height: "100%" }}>
            <SessionBox onPress={() => {
                setVisible(true)
                setSelected(item.session_id)
            }} session_id={user.session_id} item={item} />
        </View>
    ), [])

    const memoizedValue = useMemo(() => renderItem, [info?.filter(i => i.session_id !== user.session_id)]);

    return (
        <SettingsContainer title={t("settings.sessions")}>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>{t(all ? "settings.close_all_session" : "settings.close_session")}</Dialog.Title>
                    {error.length > 0 && <Dialog.Content>
                        <Text style={{ color: colors.warning_color }}>{error}</Text>
                    </Dialog.Content>}
                    <Dialog.ScrollArea>
                        <TextInput
                            label={`${t("login.password")}`}
                            autoCapitalize="none"
                            secureTextEntry={showPass}
                            returnKeyType="next"
                            mode="flat"
                            right={<TextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off"} />}
                            value={password}
                            onChangeText={(text: string) => setPassword(text)}
                        />
                    </Dialog.ScrollArea>
                    <Dialog.Actions>
                        <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                        <Button uppercase={false} loading={loading} onPress={() => all ? deleteAllSession() : deleteOneSession(selected)}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FlatList
                data={info?.filter(i => i.session_id !== user.session_id)}
                keyExtractor={item => item.session_id}
                renderItem={memoizedValue}
                ListHeaderComponent={info && info.length > 0 ? <Button onPress={() => {
                    setVisible(true)
                    setAll(true)
                }}>{t("commons.delete_all")}</Button> : undefined}
                ListEmptyComponent={<Text style={{ padding: 10 }}>{t("commons.nothing_display")}</Text>}
            />
        </SettingsContainer>
    )
}

export default SessionScreen;
