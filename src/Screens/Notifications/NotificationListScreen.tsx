import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { RefreshControl } from 'react-native';
import { Text } from 'react-native-paper';
import { useClient, useTheme } from '../../Components/Container';
import { RootState, useAppDispatch, useAppSelector } from '../../Redux';
import { connect } from 'react-redux';
import { addNotificationFeed, initNotificationFeed, readOneNotificationFeed } from '../../Redux/NotificationFeed/action';
import { NotificationInterface } from '../../Services/Client/Managers/Interfaces';
import DisplayNotifications from '../../Components/Notifications/DisplayNotifications';
import { FlashList } from '@shopify/flash-list';

const NoficationListScreen = () => {

  const { colors } = useTheme();
  const { client } = useClient();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.notificationFeed);
  const [loading, setLoading] = useState(false);

  const notificationList = async (refresh: boolean) => {
    setLoading(true);
    const request = await client.notifications.fetch();
    setLoading(false);
    if(request.error) return Toast.show({ text1: t(`errors.${request.error.code}`) as string });
    if(!request.data) return;
    if(request.data.length < 1) return;
    dispatch(refresh ? initNotificationFeed(request.data) : addNotificationFeed(request.data));
  }

  const readOneNotification = async (notification_id: string) => {
    await client.notifications.readOne(notification_id)
    dispatch(readOneNotificationFeed(notification_id))
  }
  
  const renderItem = ({ item }: { item: NotificationInterface.notificationFetchResponseSchema }) => <DisplayNotifications readOneNotification={readOneNotification} info={item} />;

  const memoizedValue = useMemo(() => renderItem, [notifications]);

  return (
      <FlashList
        data={notifications}
        keyExtractor={item => item.notification_id}
        renderItem={memoizedValue}
        refreshControl={<RefreshControl refreshing={loading} progressBackgroundColor={colors.bg_primary} tintColor={colors.fa_primary} colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]} onRefresh={() => notificationList(true)} />}
        ListEmptyComponent={() => <Text style={{ padding: 5 }}>{t("notification.no_trends_interactions")}</Text>}
      />
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    notificationFeed: state.notificationFeed,
  };
};

const mapDispatchToProps = {
  initNotificationFeed,
  addNotificationFeed
};

export default connect(mapStateToProps, mapDispatchToProps)(NoficationListScreen);