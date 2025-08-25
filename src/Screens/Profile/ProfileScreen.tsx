import { useNavigation } from '@react-navigation/native';
import { AnimatedFlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View, Animated, Platform } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { SafeBottomContainer, useClient, useProfile, useTheme } from '../../Components/Container';
import { DisplayGolfs } from '../../Components/Golfs';
import DisplayPost from '../../Components/Posts/DisplayPost';
import ProfileHeader from '../../Components/Profile/ProfileHeader';
import ProfileInfo from '../../Components/Profile/ProfileInfo';
import { Loader } from '../../Other';
import { handleToast, navigationProps } from '../../Services';
import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';


type SectionProps = {
  nickname: string;
}

const ProfileScreen = ({ nickname }: SectionProps) => {

  const { scrollY, setUserInfo, user_info, setNickname } = useProfile();
  const { client } = useClient();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<navigationProps>();

  const [pinedPost, setPinedPost] = useState<PostInterface.postInterface | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'posts' | 'golfs' | 'social_links'>('posts');

  const [loading, setLoading] = useState(false);

  const [golfPaginationKey, setGolfsPaginationKey] = React.useState<string | undefined>(undefined);
  const [golfs, setGolfs] = React.useState<golfInterface[]>([]);

  const [postsPaginationKey, setPostsPaginationKey] = React.useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<PostInterface.postInterface[]>([]);

  const [linksPaginationKey, setLinksPaginationKey] = useState<string | undefined>(undefined);
  const [links, setLinks] = useState<PostInterface.postInterface[]>([]);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const fetchData = async () => {
    if (!user_info?.user_id) return await getUserInfo();
  };

  const fetchTabData = async () => {
    if (activeTab === 'posts' && posts.length < 1) return await getPosts();
    if (activeTab === 'golfs' && golfs.length < 1) return await getGolfs();
    if (activeTab === 'social_links' && links.length < 1) return await getLinks();
  };

  useEffect(() => {
    fetchData();
  }, [user_info]);

  const getPinedPost = async (post_id: string) => {
    const response = await client.posts.getPinPost(post_id, i18n.language);
    if (response.error) return handleToast(t(`errors.${response.error.code}`));
    if (!response.data) return;
    setPinedPost(response.data);
  };

  const getUserInfo = async () => {
    const response = await client.user.profile(nickname);
    if (response.error) return handleToast(t(`errors.${response.error.code}`));
    if (!response.data) return;
    setUserInfo(response.data);
    if(response.data.pined_post) await getPinedPost(response.data.pined_post);
  };

  useEffect(() => {
    setNickname(nickname);
    fetchTabData();
  }, [nickname, activeTab]);

  const getPosts = async () => {
    if (loading) return;
    setLoading(true);
    const response = await client.posts.user.fetch(nickname, i18n.language, { pagination_key: postsPaginationKey });
    setLoading(false);
    if (response.error) return handleToast(t(`errors.${response.error.code}`))
    if (!response.data) return;
    if (response.pagination_key) setPostsPaginationKey(response.pagination_key);
    setPosts([...posts, ...response.data]);
  };

  const getLinks = async () => {
    if (loading) return;
    setLoading(true);
    const response = await client.posts.user.fetchSocialLinks(nickname, i18n.language, { pagination_key: linksPaginationKey });
    setLoading(false);
    if (response.error) return handleToast(t(`errors.${response.error.code}`))
    if (!response.data) return;
    if (response.pagination_key) setLinksPaginationKey(response.pagination_key);
    setLinks([...links, ...response.data]);
  };

  const getGolfs = async () => {
    if (loading) return;
    setLoading(true);
    const response = await client.golfs.link.golfs(user_info.user_id, { pagination: { pagination_key: golfPaginationKey } });
    setLoading(false);
    if (response.error) return handleToast(t(`errors.${response.error.code}`))
    if (!response.data) return;
    if (response.data.length < 1) return;
    if (response.pagination_key) setGolfsPaginationKey(response.pagination_key);
    if (golfs.length > 0) setGolfs([...golfs, ...response.data]);
    setGolfs(response.data);
  };

  const renderGolfs = useCallback(({ item }: { item: golfInterface }) => (
    <DisplayGolfs
      onPress={() => navigation.navigate("GolfsStack", {
        screen: "GolfsProfileScreen",
        params: {
          golf_id: item.golf_id,
        }
      })}
      informations={item} />
  ), []);

  const memoizedGolfs = useMemo(() => renderGolfs, [golfs]);

  const renderPosts = useCallback(({ item }: { item: PostInterface.postInterface }) => (
    <DisplayPost informations={item} />
  ), []);

  const memoizedLinks = useCallback(({ item }: { item: PostInterface.postInterface }) => (
    <DisplayPost informations={item} />
  ), []);

  const memoizedPosts = useMemo(() => renderPosts, [posts]);

  const tabs = [{
    name: 'posts',
    active: activeTab === 'posts',
    icon: "card-text-outline"
  }, {
    name: 'golfs',
    active: activeTab === 'golfs',
    icon: "golf-cart"
  },
  {
    name: 'social_links',
    active: activeTab === 'social_links',
    icon: "link"
  }]

  const renderProfileInfo = () => (
    <>
      <ProfileInfo setUserInfo={setUserInfo} navigation={navigation} />
      { pinedPost && <DisplayPost pined={true} comments={false} informations={pinedPost} /> }
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
                onPress={() => setActiveTab(tab.name as 'posts' | 'golfs' | 'social_links' )}>
                <Icon source={tab.icon} size={20} color={tab.active ? colors.fa_primary : colors.text_normal} />
                <Text>{t(`profile.${tab.name}`)}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      )}
    </>
  )

  return (
    <SafeBottomContainer padding={{
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }}>
      <ProfileHeader headerOpacity={headerOpacity} navigation={navigation} />
      {
        user_info.user_id ? activeTab === "golfs" ? (
          <AnimatedFlashList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            data={golfs}
            keyExtractor={(item) => item.golf_id}
            renderItem={memoizedGolfs}
            onScrollEndDrag={() => getGolfs()}
            ListEmptyComponent={loading ? <Loader /> : <Text style={{ textAlign: "center" }}>{t("profile.no_linked_golfs")}</Text>}
            ListHeaderComponent={renderProfileInfo()}
            scrollIndicatorInsets={Platform.OS === "ios" ? {
              right: 1
            } : undefined}
          />
        ) : activeTab === "posts" ? (
          <AnimatedFlashList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            data={posts}
            keyExtractor={(item) => item.post_id}
            renderItem={memoizedPosts}
            onScrollEndDrag={() => getPosts()}
            ListEmptyComponent={loading ? <Loader /> : <Text style={{ textAlign: "center" }}>{t("profile.no_posts")}</Text>}
            ListHeaderComponent={renderProfileInfo()}
            scrollIndicatorInsets={Platform.OS === "ios" ? {
              right: 1
            } : undefined}
          />
        ) : activeTab === "social_links" ? (
          <AnimatedFlashList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            data={links}
            keyExtractor={(item) => item.post_id}
            renderItem={memoizedLinks}
            onScrollEndDrag={() => getLinks()}
            ListEmptyComponent={loading ? <Loader /> : <Text style={{ textAlign: "center" }}>{t("profile.no_social_links_shared")}</Text>}
            ListHeaderComponent={renderProfileInfo()}
            scrollIndicatorInsets={Platform.OS === "ios" ? {
              right: 1
            } : undefined}
          />
        ) : <Loader /> : <Loader />
      }
    </SafeBottomContainer >
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5
  },
  activeTab: {
    borderBottomWidth: 2,
  },
});

export default ProfileScreen;
