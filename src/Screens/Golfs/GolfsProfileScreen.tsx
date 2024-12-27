import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import DisplayPost from '../../Components/Posts/DisplayPost';

const GolfProfileScreen = ({ route }: ScreenNavigationProps<GolfsStackParams, "GolfsProfileScreen">) => {
    const { golf_id } = route.params;
    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const [golfInfo, setGolfInfo] = useState<golfInterface>({} as golfInterface);
    const [activeTab, setActiveTab] = useState<'community_posts' | 'users'>('community_posts');

    const [loading, setLoading] = useState(false);

    const [usersPaginationKey, setUsersPaginationKey] = useState<string | undefined>(undefined);
    const [users, setUsers] = useState<userInfo[]>([]);

    const [communityPostsPaginationKey, setCommunityPostsPaginationKey] = useState<string | undefined>(undefined);
    const [community_posts, setCommunityPosts] = useState<PostInterface.postInterface[]>([])

    const fetchData = async () => {
        if (!golfInfo.golf_id) return await fetchGolf();
    };

    const fetchGolf = async () => {
        const response = await client.golfs.fetch(golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        setGolfInfo(response.data);
    };

    const fetchTabData = async () => {
        if (activeTab === 'users' && users.length < 1) return await getGolfUsers();
        if (activeTab === 'community_posts' && community_posts.length < 1) return await getGolfCommunityPosts();
    };

    useEffect(() => {
        fetchData();
    }, [golfInfo]);

    useEffect(() => {
        fetchTabData();
    }, [golf_id, activeTab]);

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
        if (loading) return;
        setLoading(true);
        const response = await client.golfs.link.users(golf_id, { pagination: { pagination_key: usersPaginationKey } });
        setLoading(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setUsersPaginationKey(response.pagination_key);
        if (users.length > 0) setUsers([...users, ...response.data]);
        setUsers(response.data);
    };

    const getGolfCommunityPosts = async () => {
        if (loading) return;
        setLoading(true);
        const response = await client.golfs.communityPosts(golf_id, { pagination: { pagination_key: communityPostsPaginationKey } });
        setLoading(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setCommunityPostsPaginationKey(response.pagination_key);
        if (community_posts.length > 0) setCommunityPosts([...community_posts, ...response.data]);
        setCommunityPosts(response.data);
    };

    const tabs = [{
        name: 'community_posts',
        active: activeTab === 'community_posts',
    }, {
        name: 'users',
        active: activeTab === 'users'
    }]

    const renderUsers = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember
            onPress={() => navigation.navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: {
                    nickname: item.nickname
                }
            })}
            informations={item} />
    ), []);

    const memoizedUsers = useMemo(() => renderUsers, [users]);

    const renderCommunityPosts = useCallback(({ item }: { item: PostInterface.postInterface }) => (
        <DisplayPost informations={item} />
    ), []);

    const memoizedCommunityPosts = useMemo(() => renderCommunityPosts, [community_posts]);

    const golfHeader = () => golfInfo && (
        (
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
                {(
                    <View style={[styles.tabs, { borderColor: colors.bg_secondary }]}>
                        {
                            tabs.map((tab, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.tab, tab.active && {
                                        borderBottomColor: colors.fa_primary,
                                        borderBottomWidth: 2,
                                    }]}
                                    onPress={() => setActiveTab(tab.name as 'community_posts' | 'users')}
                                >
                                    <Text>{t(`golf.${tab.name}`)}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                )}
            </>
        )
    );

    return (
        <SafeBottomContainer>
            <Appbar.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{golfInfo ? golfInfo.name : "..."}</Text>
                </View>
            </Appbar.Header>
            {
                golfInfo.golf_id ? activeTab === "users" ? (
                    <FlatList
                        ListHeaderComponent={golfHeader()}
                        onScrollEndDrag={() => getGolfUsers()}
                        scrollEventThrottle={16}
                        data={users}
                        keyExtractor={(item) => item.user_id}
                        renderItem={memoizedUsers}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("golf.no_linked_users")}</Text>}
                        scrollIndicatorInsets={Platform.OS === "ios" ? {
                            right: 1
                        } : undefined}
                    />
                ) : (
                    <FlatList
                        ListHeaderComponent={golfHeader()}
                        onScrollEndDrag={() => getGolfCommunityPosts()}
                        scrollEventThrottle={16}
                        data={community_posts}
                        keyExtractor={(item) => item.post_id}
                        renderItem={memoizedCommunityPosts}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("golf.no_posts")}</Text>}
                        scrollIndicatorInsets={Platform.OS === "ios" ? {
                            right: 1
                        } : undefined}
                    />
                ) : <Loader />
            }
        </SafeBottomContainer>
    );
};

const styles = StyleSheet.create({
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
    },
    activeTab: {
        borderBottomWidth: 2,
    },
});


export default GolfProfileScreen;
