import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Linking, Platform, Pressable, RefreshControl, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, Button, Card, IconButton, List, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';

import { SafeBottomContainer, useClient, useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import { formatDistance, golfAvatarUrl, golfCoverUrl, GolfsStackParams, handleToast, navigationProps, openURL } from '../../Services';
import { ScreenNavigationProps } from '../../Services';
import { golfurl } from '../../Services/constante';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { Loader } from '../../Other';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { Avatar, DisplayMember } from '../../Components/Member';
import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import DisplayPost from '../../Components/Posts/DisplayPost';
import { eventsInterface } from '../../Services/Client/Managers/Interfaces/Events';
import EventCard from '../../Components/Events/EventCard';
import ScorecardDisplay from '../../Components/Golfs/ScorecardDisplay';

const GolfProfileScreen = ({ route }: ScreenNavigationProps<GolfsStackParams, "GolfsProfileScreen">) => {
    const { golf_id } = route.params;
    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const [showDetails, setShowDetails] = useState(true);

    const [golfInfo, setGolfInfo] = useState<golfInterface>({} as golfInterface);
    const [activeTab, setActiveTab] = useState<'community_posts' | 'users' | 'events' | 'social_links'>('community_posts');

    const [loading, setLoading] = useState(false);

    const [usersPaginationKey, setUsersPaginationKey] = useState<string | undefined>(undefined);
    const [users, setUsers] = useState<userInfo[]>([]);
    const [usersLoader, setUsersLoader] = useState(false);

    const [communityPostsPaginationKey, setCommunityPostsPaginationKey] = useState<string | undefined>(undefined);
    const [community_posts, setCommunityPosts] = useState<PostInterface.postInterface[]>([])
    const [communityPostsLoader, setCommunityPostsLoader] = useState(false);

    const [eventsPaginationKey, setEventsPaginationKey] = useState<string | undefined>(undefined);
    const [events, setEvents] = useState<eventsInterface[]>([]);
    const [eventsLoader, setEventsLoader] = useState(false);

    const [linksPaginationKey, setLinksPaginationKey] = useState<string | undefined>(undefined);
    const [links, setLinks] = useState<PostInterface.postInterface[]>([]);
    const [linksLoader, setLinksLoader] = useState(false);

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
        if (activeTab === 'events' && events.length < 1) return await getGolfEvents();
        if (activeTab === 'social_links' && links.length < 1) return await getGolfSocialLinks();
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

    const onShare = async () => {
        await Share.share({
            message: `${golfurl}/${golfInfo.golf_id}`,
            url: `${golfurl}/${golfInfo.golf_id}`
        });
    }

    const getGolfUsers = async (refresh: boolean = false) => {
        if (loading) return;
        if (refresh) {
            setUsersLoader(true)
            if (usersLoader) return
        }
        setLoading(true);
        const response = await client.golfs.link.users(golf_id, { pagination: { pagination_key: refresh ? undefined : usersPaginationKey } });
        setLoading(false);
        if (refresh) setUsersLoader(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.pagination_key) setUsersPaginationKey(response.pagination_key);
        if (refresh) setUsers(response.data);
        else setUsers([...users, ...response.data]);
    };

    const getGolfCommunityPosts = async (refresh: boolean = false) => {
        if (loading) return;
        if (refresh) {
            setCommunityPostsLoader(true)
            if (communityPostsLoader) return;
        }
        setLoading(true);
        const response = await client.golfs.communityPosts(golf_id, { pagination: { pagination_key: refresh ? undefined : communityPostsPaginationKey } });
        setLoading(false);
        if (refresh) setCommunityPostsLoader(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.pagination_key) setCommunityPostsPaginationKey(response.pagination_key);
        if (refresh) setCommunityPosts(response.data);
        else setCommunityPosts([...community_posts, ...response.data]);
    };

    const getGolfSocialLinks = async (refresh: boolean = false) => {
        if (loading) return;
        if (refresh) {
            setLinksLoader(true)
            if (linksLoader) return;
        }
        setLoading(true);
        const response = await client.golfs.communitySocialLinksPosts(golf_id, { pagination: { pagination_key: refresh ? undefined : linksPaginationKey } });
        setLoading(false);
        if (refresh) setLinksLoader(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.pagination_key) setLinksPaginationKey(response.pagination_key);
        if (refresh) setLinks(response.data);
        else setLinks([...links, ...response.data]);
    };

    const getGolfEvents = async (refresh: boolean = false) => {
        if (loading) return;
        if (refresh) {
            setEventsLoader(true)
            if (eventsLoader) return;
        }
        setLoading(true);
        const response = await client.golfs.events(golf_id, { pagination: { pagination_key: refresh ? undefined : eventsPaginationKey } });
        setLoading(false);
        if (refresh) setEventsLoader(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (!response.data) return;
        if (response.pagination_key) setEventsPaginationKey(response.pagination_key);
        if (refresh) setEvents(response.data);
        else setEvents([...events, ...response.data]);
    };

    const addPlayedGolf = async () => {
        if (!golfInfo.golf_id) return;
        const response = await client.golfs.played.markAsPlayed(golfInfo.golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.data) {
            handleToast(t(`golf.added_as_played`));
            setGolfInfo({ ...golfInfo, played: true });
        }
    }

    const removePlayedGolf = async () => {
        if (!golfInfo.golf_id) return;
        const response = await client.golfs.played.unmarkAsPlayed(golfInfo.golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.data) {
            handleToast(t(`commons.success`));
            setGolfInfo({ ...golfInfo, played: false });
        }
    };

    const tabs = [{
        name: 'community_posts',
        active: activeTab === 'community_posts',
    }, {
        name: 'users',
        active: activeTab === 'users'
    },
    {
        name: 'events',
        active: activeTab === 'events'
    },
    {
        name: 'social_links',
        active: activeTab === 'social_links'
    }];

    const renderUsers = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember
            onPress={() => navigation.navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: {
                    nickname: item.nickname
                }
            })}
            informations={item} />
    ), [navigation]);

    const renderCommunityPosts = useCallback(({ item }: { item: PostInterface.postInterface }) => (
        <DisplayPost informations={item} />
    ), []);

    const renderSocialLinks = useCallback(({ item }: { item: PostInterface.postInterface }) => (
        <DisplayPost informations={item} />
    ), []);

    const renderEvents = useCallback(({ item }: { item: eventsInterface }) => (
        <EventCard full_width event={item} />
    ), []);

    const golfHeader = () => golfInfo && (
        (
            <>
                <View style={{ height: 125, backgroundColor: colors.bg_secondary }}>
                    <FastImage source={{ uri: golfCoverUrl(golfInfo.slug) }} style={{ width: full_width, height: "100%", ...StyleSheet.absoluteFillObject }} />
                </View>
                <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                    <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                        <Avatar
                            size={80}
                            style={{
                                borderColor: colors.bg_primary,
                                borderWidth: 3,
                                marginTop: -20,
                                marginLeft: 10,
                            }}
                            radius={8}
                            url={golfAvatarUrl(golfInfo.slug)}
                        />
                    </View>
                    <View style={{ justifyContent: "flex-start", flexDirection: "column", gap: 5, marginLeft: 5, marginTop: 5, flex: 1, paddingRight: 5 }}>
                        <Text ellipsizeMode='tail' style={{ fontSize: 20, fontWeight: "bold", flexWrap: "wrap" }} numberOfLines={1}>{golfInfo.name}</Text>
                        {
                            golfInfo.city && golfInfo.country && (
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail">{golfInfo.city}, {golfInfo.country}</Text>
                                </View>
                            )
                        }
                    </View>
                </View>
                <View style={{ marginTop: 5, marginLeft: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap", maxWidth: "50%" }}>
                        {
                            golfInfo.email && (
                                <Pressable onPress={() => Linking.openURL(`mailto:${golfInfo.email}`)} style={{ flexDirection: "column", alignItems: "center" }}>
                                    <IconButton iconColor={colors.fa_primary} mode='contained' containerColor={colors.bg_third} size={20} icon={"email-fast"} />
                                    <Text>{t("golf.email")}</Text>
                                </Pressable>
                            )
                        }
                        {
                            golfInfo.phone && (
                                <Pressable onPress={() => Linking.openURL(`tel:${golfInfo.phone}`)} style={{ flexDirection: "column", alignItems: "center" }}>
                                    <IconButton iconColor={colors.fa_primary} mode='contained' containerColor={colors.bg_third} size={20} icon={"phone"} />
                                    <Text>{t("golf.phone")}</Text>
                                </Pressable>
                            )
                        }
                        {
                            golfInfo.website && (
                                <Pressable onPress={() => openURL(golfInfo.website)} style={{ flexDirection: "column", alignItems: "center" }}>
                                    <IconButton iconColor={colors.fa_primary} mode='contained' containerColor={colors.bg_third} size={20} icon={"web"} />
                                    <Text>{t("golf.website")}</Text>
                                </Pressable>
                            )
                        }
                    </View>

                    <View style={{ position: "absolute", rowGap: 5, right: 10, top: 10, flexDirection: "row", alignItems: "center", gap: 5, maxWidth: "50%" }}>
                        {golfInfo.played ? <Button icon="check-circle" onPress={() => removePlayedGolf()}>{t("golf.played")}</Button> : <Button icon="check-circle-outline" onPress={() => addPlayedGolf()}>{t("golf.not_played")}</Button>}
                        {golfInfo.linked ? <Button icon="link-variant-off" onPress={() => unlinkGolf()}>{t("golf.unlink")}</Button> : <Button icon="link-variant" onPress={() => linkGolf()}>{t("golf.link")}</Button>}
                    </View>
                </View>
                <List.Accordion expanded={showDetails} onPress={() => setShowDetails(!showDetails)} title={t("golf.details")} id="1">
                    <Card style={{ margin: 5 }} mode="contained">
                        <Card.Content>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                                {
                                    golfInfo.holes && (
                                        <View style={{ flexDirection: "column", alignItems: "center", backgroundColor: colors.bg_primary, padding: 10, borderRadius: 5, minWidth: 100, minHeight: 60 }}>
                                            <Text>{t("golf.holes")}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '900' }}>{golfInfo.holes}</Text>
                                        </View>
                                    )
                                }
                                {
                                    golfInfo.scorecards?.[0]?.grid?.[0]?.par && (
                                        <View style={{ flexDirection: "column", alignItems: "center", backgroundColor: colors.bg_primary, padding: 10, borderRadius: 5, minWidth: 100, minHeight: 60 }}>
                                            <Text>{t("golf.par")}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '900' }}>{golfInfo.scorecards[0].grid[0].par.reduce((sum, hole) => sum + (typeof hole === 'number' ? hole : 0), 0)}</Text>
                                        </View>
                                    )
                                }
                                {
                                    golfInfo.yearBuilt && (
                                        <View style={{ flexDirection: "column", alignItems: "center", backgroundColor: colors.bg_primary, padding: 10, borderRadius: 5, minWidth: 100, minHeight: 60 }}>
                                            <Text>{t("golf.year_built")}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '900' }}>{golfInfo.yearBuilt}</Text>
                                        </View>
                                    )
                                }
                                {
                                    golfInfo.architect && (
                                        <View style={{ flexDirection: "column", alignItems: "center", backgroundColor: colors.bg_primary, padding: 10, borderRadius: 5, minWidth: 100, minHeight: 60 }}>
                                            <Text>{t("golf.architect")}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '900' }}>{golfInfo.architect}</Text>
                                        </View>
                                    )
                                }
                                {
                                    golfInfo.distance && (
                                        <View style={{ flexDirection: "column", alignItems: "center", backgroundColor: colors.bg_primary, padding: 10, borderRadius: 5, minWidth: 100, minHeight: 60 }}>
                                            <Text>{t("golf.distance")}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '900' }}>{formatDistance(golfInfo.distance)}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        </Card.Content>
                        <Card.Content>
                            {
                                golfInfo.scorecards && <ScorecardDisplay scorecards={golfInfo.scorecards} />
                            }
                        </Card.Content>
                    </Card>
                </List.Accordion>

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
        <SafeBottomContainer padding={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }}>
            <Appbar.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 }}>
                    <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                    <Text
                        style={{ fontSize: 16, fontWeight: '700', marginLeft: 5, flex: 1 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {golfInfo ? golfInfo.name : "..."}
                    </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Appbar.Action icon="share-variant" onPress={() => onShare()} />
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
                        renderItem={renderUsers}
                        refreshControl={<RefreshControl
                            refreshing={usersLoader}
                            progressBackgroundColor={colors.bg_primary}
                            tintColor={colors.fa_primary}
                            colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                            onRefresh={() => getGolfUsers(true)} />}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("golf.no_linked_users")}</Text>}
                        scrollIndicatorInsets={Platform.OS === "ios" ? {
                            right: 1
                        } : undefined}
                    />
                ) : activeTab === "community_posts" ? (
                    <FlatList
                        ListHeaderComponent={golfHeader()}
                        onScrollEndDrag={() => getGolfCommunityPosts()}
                        scrollEventThrottle={16}
                        data={community_posts}
                        keyExtractor={(item) => item.post_id}
                        renderItem={renderCommunityPosts}
                        refreshControl={<RefreshControl
                            refreshing={communityPostsLoader}
                            progressBackgroundColor={colors.bg_primary}
                            tintColor={colors.fa_primary}
                            colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                            onRefresh={() => getGolfCommunityPosts(true)} />}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("golf.no_posts")}</Text>}
                        scrollIndicatorInsets={Platform.OS === "ios" ? {
                            right: 1
                        } : undefined}
                    />
                ) : activeTab === "events" ? (
                    <FlatList
                        ListHeaderComponent={golfHeader()}
                        onScrollEndDrag={() => getGolfEvents()}
                        scrollEventThrottle={16}
                        data={events}
                        keyExtractor={(item) => item.event_id}
                        renderItem={renderEvents}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("events.no_events")}</Text>}
                        refreshControl={<RefreshControl
                            refreshing={eventsLoader}
                            progressBackgroundColor={colors.bg_primary}
                            tintColor={colors.fa_primary}
                            colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                            onRefresh={() => getGolfEvents(true)} />}
                        scrollIndicatorInsets={Platform.OS === "ios" ? {
                            right: 1
                        } : undefined}
                    />) : activeTab === "social_links" ? (
                        <FlatList
                            ListHeaderComponent={golfHeader()}
                            onScrollEndDrag={() => getGolfSocialLinks()}
                            scrollEventThrottle={16}
                            data={links}
                            keyExtractor={(item) => item.post_id}
                            renderItem={renderSocialLinks}
                            refreshControl={<RefreshControl
                                refreshing={linksLoader}
                                progressBackgroundColor={colors.bg_primary}
                                tintColor={colors.fa_primary}
                                colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                                onRefresh={() => getGolfSocialLinks(true)} />}
                            ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("golf.no_social_links")}</Text>}
                            scrollIndicatorInsets={Platform.OS === "ios" ? {
                                right: 1
                            } : undefined}
                        />
                    ) : <Loader /> : <Loader />
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
