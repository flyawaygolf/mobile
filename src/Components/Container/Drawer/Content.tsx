import React from 'react';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Title, Caption, Drawer } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import FastImage from '@d11/react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import globalStyles from '../../../Style/style';
import useClient from '../Client/useClient';
import useTheme from '../Theme/useTheme';

export default function DrawerContent({ navigation }: DrawerContentComponentProps) {

  const { user, client } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      alwaysBounceVertical={false}
      bounces={false}
      bouncesZoom={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flex: 1, flexDirection: 'column', justifyContent: 'space-between',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingStart: insets.left,
        paddingEnd: insets.right,
      }}
      style={{ flex: 1, backgroundColor: colors.bg_secondary }}>
      <View>
        <View style={{ height: 90 }}>
          {
            user?.banner ?
              <FastImage style={[globalStyles.banner_image_drawer, { backgroundColor: colors.bg_secondary }]} source={{ uri: `${client.user.banner(user.user_id, user.banner)}` }} />
              : <View style={[globalStyles.banner_image, { backgroundColor: user.accent_color }]} />
          }
        </View>
        <View style={{ padding: 12 }}>
          <FastImage style={[globalStyles.pdp50, { marginTop: -30, backgroundColor: colors.bg_secondary }]} source={{ uri: `${client.user.avatar(user?.user_id, user?.avatar)}` }} />
          <Title style={{ marginTop: 5, fontWeight: 'bold' }}>{user?.username}</Title>
          <Caption style={styles.caption}>@{user?.nickname}</Caption>
        </View>
        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
          <Drawer.Section style={styles.drawerSection}>
            <Drawer.Item icon="plus-circle" label={t('commons.create')} onPress={() => navigation.navigate("MainNavigation", {
              screen: "CreateStack",
              params: {
                screen: "PostCreatorScreen",
                params: {
                  attached_post_id: '',
                  initFiles: [],
                  initContent: '',
                },
              }
            })} />
            <Drawer.Item icon="account" label={t('commons.profile')} onPress={() => navigation.navigate('MainNavigation', {
              screen: 'ProfileStack',
              params: {
                screen: 'ProfileScreen',
                params: {
                  nickname: user?.nickname,
                },
              }
            })} />
            <Drawer.Item icon="calendar-month" label={t('events.create_event')} onPress={() => navigation.navigate('MainNavigation', {
              screen: 'EventStack',
              params: {
                screen: 'CreateEventScreen',
              }
            })} />
            <Drawer.Item icon="star" label={t('guilds.favorites')} onPress={() => navigation.navigate('MainNavigation', {
              screen: 'FavoritesScreen'
            })} />
            <Drawer.Item icon="bookmark" label={t('posts.bookmarks')} onPress={() => navigation.navigate('MainNavigation', {
              screen: 'PostsStack',
              params: {
                screen: 'BookmarksScreen',
                params: {
                  target_id: user?.user_id,
                },
              }
            })} />
            <Drawer.Item icon="cog" label={t('commons.settings')} onPress={() => navigation.navigate("MainNavigation", {
              screen: 'SettingsStack',
              params: {
                screen: "HomeSettingsScreen"
              }
            })} />
          </Drawer.Section>
          {
            /**
             *           <Drawer.Section title={t('drawer.preferences')}>
            <Drawer.Item icon="theme-light-dark" label={t('drawer.change_theme')} onPress={() => changeStorage("theme", theme === "auto" || theme === "white" ? "dark" : "white")} />
            <Drawer.Item icon="translate" label={t('drawer.language')} onPress={() => navigation.navigate("MainNavigation", {
              screen: "SettingsStack",
              params: {
                screen: "LanguageThemeScreen"
              }
            })} />
          </Drawer.Section>
             */
          }
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 10,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
