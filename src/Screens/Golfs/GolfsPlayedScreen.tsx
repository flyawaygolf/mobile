import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import { SettingsContainer, useClient, useTheme } from '../../Components/Container';
import { Avatar } from '../../Components/Member';
import { Loader } from '../../Other';
import { useAppDispatch, useAppSelector } from '../../Redux';
import { addGolfsPlayed, deleteGolfsPlayed, initGolfsPlayed } from '../../Redux/GolfsPlayed/action';
import { handleToast, navigationProps } from '../../Services';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { full_width } from '../../Style/style';

const GolfsPlayedScreen = () => {

    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const golfs = useAppSelector((state) => state.golfsPlayed);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [stats, setStats] = useState<{ total: number; played: number }>({ total: 30000, played: 0 });
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    async function getData() {
        const response = await client.golfs.played.playedGolfs(user.user_id, true, { pagination: { pagination_key: pagination_key } });
        setLoader(false)
        if (response.error || !response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initGolfsPlayed(response.data.golfs));
        setStats({ total: response.data.total, played: response.data.played });
    }

    useEffect(() => {
        getData()
    }, [])

    const bottomHandler = async () => {
        if (loader) return;
        setLoader(true)
        const response = await client.golfs.played.playedGolfs(user.user_id, false, { pagination: { pagination_key: pagination_key } });
        setLoader(false);
        if (response.error || !response.data) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(addGolfsPlayed(response.data.golfs));
    }

    const removePlayedGolf = async (golfInfo: golfInterface) => {
        if (!golfInfo.golf_id) return;

        Alert.alert(
            t('golf.confirm_delete_title'),
            t('golf.confirm_delete_message', { golfName: golfInfo.name }),
            [
                {
                    text: t('commons.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('commons.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        const response = await client.golfs.played.unmarkAsPlayed(golfInfo.golf_id);
                        if (response.error) return handleToast(t(`errors.${response.error.code}`));
                        if (response.data) {
                            handleToast(t(`commons.success`));
                            dispatch(deleteGolfsPlayed(golfInfo.golf_id));
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: golfInterface }) => (
            <Card style={{ margin: 5, width: full_width ? "auto" : 300, backgroundColor: colors.bg_secondary }}>
                <View style={{ width: "100%", height: 150, borderTopRightRadius: 10, borderTopLeftRadius: 10, overflow: "hidden", position: "relative" }}>
                    <FastImage
                        resizeMode="cover"
                        style={{ backgroundColor: colors.good_color, ...StyleSheet.absoluteFillObject }}
                        source={{ uri: client.golfs.cover(item.golf_id) }} />
                </View>
                <View style={{ padding: 20, paddingTop: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                        <Avatar style={{ borderColor: colors.bg_primary, borderWidth: 1 }} url={client.golfs.avatar(item.golf_id)} size={40} radius={8} />
                        <View>
                            <Text style={{ marginLeft: 5 }}>{item.name}</Text>
                            <Text style={{ marginLeft: 5 }}>{item.city}, {item.country}</Text>
                        </View>
                    </View>
                    <Card.Content style={{ flexDirection: "row",  flexWrap: "wrap", justifyContent: "flex-end", gap: 5 }}>
                        {
                            item.played && <Button mode='outlined' onPress={() => removePlayedGolf(item)} textColor={colors.badge_color}>{t('golf.delete_from_played')}</Button>
                        }
                        <Button mode='contained' onPress={() => navigation.navigate("GolfsStack", { screen: "GolfsProfileScreen", params: { golf_id: item.golf_id } })}>{t('golf.display_golf')}</Button>
                    </Card.Content>
                </View>
            </Card>
    )

    const memoizedValue = useMemo(() => renderItem, [golfs]);

    return (
        <SettingsContainer leftComponent={<Text style={{ fontSize: 16, fontWeight: '700', marginRight: 10 }}>{stats.played.toLocaleString('en-US')}/{stats.total.toLocaleString('en-US')}</Text>} title={t("golf.golfs_played")}>
            <FlatList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                onScrollEndDrag={() => bottomHandler()}
                data={golfs}
                renderItem={memoizedValue}
                keyExtractor={item => item.golf_id} />
        </SettingsContainer>
    );
};


export default GolfsPlayedScreen;
