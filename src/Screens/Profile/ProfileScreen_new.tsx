import React, { useEffect } from 'react';
import { Animated, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useClient, useProfile } from '../../Components/Container';
import { handleToast, navigationProps } from '../../Services';
import ProfileHeader from '../../Components/Profile/ProfileHeader';
import ProfileInfo from '../../Components/Profile/ProfileInfo';
import ProfileNavigator from './ProfileNavigator';
import { Loader } from '../../Other';

type SectionProps = {
  nickname: string;
}

const ProfileScreen = ({ nickname }: SectionProps) => {
  const { scrollY, setUserInfo, user_info, setNickname } = useProfile();
  const { client } = useClient();
  const { t } = useTranslation();
  const navigation = useNavigation<navigationProps>();

  const fetchData = async () => {
    if (!user_info?.user_id) return await getUserInfo();
  };

  useEffect(() => {
    setNickname(nickname);
  }, [nickname]);

  useEffect(() => {
    fetchData();
  }, [user_info]);

  const getUserInfo = async () => {
    const response = await client.user.profile(nickname);
    if (response.error) return handleToast(t(`errors.${response.error.code}`));
    if (!response.data) return;
    setUserInfo(response.data);
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderItem = () => (
    <>
      <ProfileInfo setUserInfo={setUserInfo} navigation={navigation} />
      <View style={{ minHeight: 500 }}>
        <ProfileNavigator />
      </View>
    </>
  );

  return (
    <>
      <ProfileHeader headerOpacity={headerOpacity} navigation={navigation} />
      {
        user_info.user_id ? (
          <Animated.FlatList
            data={[{ key: 'profile' }]}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
        ) : <Loader />
      }
    </>
  );
};

export default ProfileScreen;