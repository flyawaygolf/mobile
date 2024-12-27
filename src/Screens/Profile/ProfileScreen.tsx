import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { SafeBottomContainer, useClient, useTheme } from '../../Components/Container';
import { handleToast, navigationProps } from '../../Services';
import { ProfileStackParams, ScreenNavigationProps } from '../../Services';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Search';
import { DisplayGolfs } from '../../Components/Golfs';
import ProfileHeader from '../../Components/Profile/ProfileHeader';
import ProfileInfo from '../../Components/Profile/ProfileInfo';
import { PostInterface } from '../../Services/Client/Managers/Interfaces';
import DisplayPost from '../../Components/Posts/DisplayPost';
import { Loader } from '../../Other';
import { profileInformationsInterface } from '../../Services/Client/Managers/Interfaces/User';

const ProfileScreen = ({ route }: ScreenNavigationProps<ProfileStackParams, "ProfileScreen">) => {
  const [scrollY] = useState(new Animated.Value(0));
  const { nickname } = route.params;
  const { client } = useClient();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<navigationProps>();
  const [user_info, setUserInfo] = React.useState<profileInformationsInterface>({} as profileInformationsInterface);
  const [activeTab, setActiveTab] = useState<'posts' | 'golfs'>('posts');

  const [loading, setLoading] = useState(false);

  const [golfPaginationKey, setGolfsPaginationKey] = React.useState<string | undefined>(undefined);
  const [golfs, setGolfs] = React.useState<golfInterface[]>([]);

  const [postsPaginationKey, setPostsPaginationKey] = React.useState<string | undefined>(undefined);
  const [posts, setPosts] = useState<PostInterface.postInterface[]>([])

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const fetchData = async () => {
    if (!user_info.user_id) return await getUserInfo();
  };

  const fetchTabData = async () => {
      if (activeTab === 'posts' && posts.length < 1) return await getPosts();
      if (activeTab === 'golfs' && golfs.length < 1) return await getGolfs();
  };

  useEffect(() => {
    fetchData();
  }, [user_info]);

  useEffect(() => {
    fetchTabData();
  }, [nickname, activeTab]);

  const getUserInfo = async () => {
    const response = await client.user.profile(nickname);
    if (response.error) return handleToast(t(`errors.${response.error.code}`));
    if (!response.data) return;
    setUserInfo(response.data);
  };

  const getPosts = async () => {
    if(loading) return;
    setLoading(true);
    const response = await client.posts.user.fetch(nickname, { pagination_key: postsPaginationKey });
    setLoading(false);
    if (response.error) return handleToast(t(`errors.${response.error.code}`))
    if (!response.data) return;
    if (response.pagination_key) setPostsPaginationKey(response.pagination_key);
    setPosts([...posts, ...response.data]);
  };

  const getGolfs = async () => {    if(loading) return;
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

  const memoizedPosts = useMemo(() => renderPosts, [posts]);

  const tabs = [{
    name: 'posts',
    active: activeTab === 'posts',
  }, {
    name: 'golfs',
    active: activeTab === 'golfs'
  }]

  const renderProfileInfo = () => (
    <>
      <ProfileInfo setUserInfo={setUserInfo} navigation={navigation} user_info={user_info} />
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
                onPress={() => setActiveTab(tab.name as 'posts' | 'golfs')}
              >
                <Text>{t(`profile.${tab.name}`)}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      )}
    </>
  )

  return (
      <SafeBottomContainer padding={0}>
          <ProfileHeader user_info={user_info} headerOpacity={headerOpacity} navigation={navigation} />
          {
            user_info.user_id ? activeTab === "golfs" ? (
              <Animated.FlatList
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
            ) : (
              <Animated.FlatList
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
            ) : <Loader />
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
  },
  activeTab: {
    borderBottomWidth: 2,
  },
});

export default ProfileScreen;
