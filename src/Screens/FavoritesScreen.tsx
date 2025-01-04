import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { FlatList, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Appbar, Button, Dialog, Paragraph, Portal, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { favoritesInterface } from '../Services/Client/Managers/Interfaces/Favorites';
import { ScreenContainer, useClient, useTheme } from '../Components/Container';
import { handleToast, navigationProps } from '../Services';
import { full_width } from '../Style/style';
import { DisplayMember } from '../Components/Member';

function FavoritesScreen() {

    const [info, setInfo] = useState<favoritesInterface[]>([])
    const { t } = useTranslation();
    const { client } = useClient();
    const { colors } = useTheme();
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(0);
    const navigation = useNavigation<navigationProps>();

    const hideDialog = () => setVisible(false);

    useEffect(() => {
        async function getData() {
            const request = await client.favorites.fetch();
            if (request.error || !request.data) return;
            setInfo(request.data);

        }
        getData()
    }, [])

    const unFavoriteUser = async (target_id: string) => {
        const response = await client.favorites.delete(target_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        setInfo(info.filter((u) => u.user_info.user_id !== target_id))
        handleToast(t("commons.success"))
        setVisible(false)
    }

    return (
        <ScreenContainer>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", alignItems: "center" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Text variant="titleSmall">{t("favorites.title")}</Text>
            </Appbar.Header>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>
                        <Paragraph>
                            {t("favorites.sure_delete", { username: info[selected]?.user_info.username ?? "" })}
                        </Paragraph>
                    </Dialog.Title>
                    <Dialog.Actions>
                        <Button uppercase={false} onPress={() => hideDialog()}>{t("commons.cancel")}</Button>
                        <Button uppercase={false} onPress={() => unFavoriteUser(info[selected]?.user_info.user_id)}>{t("commons.continue")}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <FlatList
                data={info}
                ListEmptyComponent={<Text style={{ padding: 10 }}>{t("favorites.no_favorites")}</Text>}
                keyExtractor={item => item.user_id}
                renderItem={({ item, index }) => (
                    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                        <DisplayMember onPress={() => navigation.navigate("ProfileStack", {
                            screen: "ProfileScreen",
                            params: { nickname: item.user_info.nickname },
                        })} full_width style={{
                            width: full_width - 10,
                        }} informations={item.user_info} />
                        <Button
                            style={{
                                right: 10,
                                position: "absolute",
                            }}
                            uppercase={false}
                            onPress={() => {
                                setVisible(true)
                                setSelected(index)
                            }}
                            textColor={colors.text_normal}>{t("favorites.delete")}</Button>
                    </View>
                )}
            />
        </ScreenContainer>
    )
}

export default FavoritesScreen;
