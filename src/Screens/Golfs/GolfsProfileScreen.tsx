import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { SafeBottomContainer, ScreenContainer, useClient, useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import { formatDistance, GolfsStackParams, handleToast, navigationProps } from '../../Services';
import { ScreenNavigationProps } from '../../Services';
import { cdnbaseurl } from '../../Services/constante';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Search';
import { Loader } from '../../Other';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { DisplayMember } from '../../Components/Member';

const GolfProfileScreen = ({ route }: ScreenNavigationProps<GolfsStackParams, "GolfsProfileScreen">) => {
    const { golf_id } = route.params;
    const [golfInfo, setGolfInfo] = React.useState<golfInterface | null>(null);
    const [users, setUsers] = React.useState<userInfo[]>([]);
    const [paginationKey, setPaginationKey] = React.useState<string | undefined>(undefined);
    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const fetchGolf = async () => {
        const response = await client.golfs.fetch(golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        setGolfInfo(response.data);
    };

    useEffect(() => {
        fetchGolf();
        getGolfUsers();
    }, [golf_id]);

    const linkGolf = async () => {
        if (!golfInfo) return;
        const response = await client.golfs.link.create(golfInfo.golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.data) {
            handleToast(t(`commons.success`));
            setUsers((prev) => [...prev, user as any]);
            setGolfInfo({ ...golfInfo, linked: true });
        }
    }

    const unlinkGolf = async () => {
        if (!golfInfo) return;
        const response = await client.golfs.link.delete(golfInfo.golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.data) {
            handleToast(t(`commons.success`));
            setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
            setGolfInfo({ ...golfInfo, linked: false });
        }
    };

    const getGolfUsers = async () => {
        const response = await client.golfs.link.users(golf_id, { pagination: { pagination_key: paginationKey } });
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if(response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if(users.length > 0) setUsers([...users, ...response.data]);
        setUsers(response.data);
    };

    const renderItem = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember
            onPress={() => navigation.navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: {
                    user_id: item.user_id
                }
            })}
            informations={item} />
    ), []);

    const memoizedValue = useMemo(() => renderItem, [users]);

    return (
        <ScreenContainer>
            <Appbar.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{golfInfo ? golfInfo.name : "..."}</Text>
                </View>
            </Appbar.Header>
            <SafeBottomContainer padding={0}>
                {
                    !golfInfo ? <Loader /> : (
                        <FlatList
                            ListHeaderComponent={() => (
                                <>
                                    <View style={{ height: 150, backgroundColor: colors.bg_secondary }}>
                                        <Image source={{ uri: golfInfo?.banner ? `${cdnbaseurl}/golfs_banners/${golf_id}/${golfInfo.banner}` : `${cdnbaseurl}/assets/background/default.jpg` }} style={{ width: full_width, height: "100%", ...StyleSheet.absoluteFillObject }} />
                                    </View>
                                    <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                        <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                                            <Avatar.Text
                                                size={80}
                                                style={{
                                                    borderRadius: 80 / 2,
                                                    borderColor: colors.bg_primary,
                                                    borderWidth: 3,
                                                    marginTop: -40,
                                                    marginLeft: 10,
                                                    backgroundColor: colors.bg_secondary,
                                                }}
                                                label={golfInfo.name.substring(0, 2).toUpperCase()}
                                            />
                                        </View>
                                        <View style={{ position: "absolute", right: 5 }}>
                                            {golfInfo.linked ? <Button icon="link-variant-off" onPress={() => unlinkGolf()}>{t("golf.unlink")}</Button> : <Button icon="link-variant" onPress={() => linkGolf()}>{t("golf.link")}</Button>}
                                        </View>
                                    </View>
                                    <Card style={{ margin: 5 }} mode="contained">
                                        <Card.Content>
                                            <View style={{ marginBottom: 5 }}>
                                                <Text style={{ fontWeight: '900' }}>{t("golf.name")}</Text>
                                                <Text>{golfInfo.name}</Text>
                                            </View>
                                            <View style={{ marginBottom: 5 }}>
                                                <Text style={{ fontWeight: '900' }}>{t("golf.location")}</Text>
                                                <Text>{golfInfo.city}, {golfInfo.country}</Text>
                                            </View>
                                            {
                                                golfInfo.distance && (
                                                    <View style={{ marginBottom: 5 }}>
                                                        <Text style={{ fontWeight: '900' }}>{t("golf.distance")}</Text>
                                                        <Text>{formatDistance(golfInfo.distance)}</Text>
                                                    </View>
                                                )
                                            }
                                        </Card.Content>
                                    </Card>
                                    <Text style={{ fontWeight: '900', padding: 5 }}>{t("golf.users")} :</Text>
                                </>
                            )}
                            onScrollEndDrag={() => getGolfUsers()}
                            data={users}
                            keyExtractor={(item) => item.user_id}
                            renderItem={memoizedValue}
                            ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("golf.no_linked_users")}</Text>}
                        />
                    )
                }
            </SafeBottomContainer>
        </ScreenContainer>
    );
};

export default GolfProfileScreen;
