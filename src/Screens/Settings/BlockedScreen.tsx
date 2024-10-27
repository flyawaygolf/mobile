import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { FlatList, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Appbar, Button, Dialog, Paragraph, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { full_width } from '../../Style/style';
import { navigationProps } from '../../Services';
import { useClient, useTheme } from '../../Components/Container';
import { blockUserInformations } from '../../Services/Client/Managers/Interfaces/Block';
import { DisplayMember } from '../../Components/Member';

function BlockedScreen() {

    const [info, setInfo] = useState<blockUserInformations[]>([])
    const { t } = useTranslation();
    const { client } = useClient();
    const { colors } = useTheme();
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(0);
    const navigation = useNavigation<navigationProps>();

    const hideDialog = () => setVisible(false);

    useEffect(() => {
        async function getData() {
            const request = await client.block.fetch();
            if (request.error || !request.data) return;
            setInfo(request.data);

        }
        getData()
    }, [])

    const unblockUser = async (target_id: string) => {
        const response = await client.block.delete(target_id);
        if (response.error) return;
        setInfo(info.filter((u) => u.user_id !== target_id))
        setVisible(false)
    }

    return (
        <SafeAreaView style={{ backgroundColor: colors.bg_primary, height: "100%" }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", alignItems: "center" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Text variant="titleSmall">{t("settings.blocked")}</Text>
            </Appbar.Header>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>
                        <Paragraph>
                            {t("settings.sure_unblock", { username: info[selected]?.username ?? "" })}
                        </Paragraph>
                    </Dialog.Title>
                    <Dialog.Actions>
                        <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                        <Button uppercase={false} onPress={() => unblockUser(info[selected]?.user_id)}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FlatList
                data={info}
                ListEmptyComponent={<Text style={{ padding: 10 }}>{t("commons.nothing_display")}</Text>}
                keyExtractor={item => item.user_id}
                renderItem={({ item, index }) => (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <DisplayMember full_width informations={item} />
                        <Button
                            style={{
                                right: 10,
                                position: "absolute"
                            }}
                            uppercase={false}
                            onPress={() => {
                                setVisible(true)
                                setSelected(index)
                            }}
                            textColor={colors.text_normal}>{t("settings.block")}</Button>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default BlockedScreen;