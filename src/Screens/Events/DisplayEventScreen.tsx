import React, { useEffect, useState } from 'react';
import { ImageBackground, Platform, ScrollView, Share, View } from 'react-native';
import { SafeBottomContainer, useClient, useTheme } from '../../Components/Container';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Button, Chip, Divider, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { check, PERMISSIONS, request } from 'react-native-permissions';

import { eventsInterface } from '../../Services/Client/Managers/Interfaces/Events';
import { handleToast, messageFormatDate, navigationProps } from '../../Services';
import { full_height, full_width } from '../../Style/style';
import { BottomModal, Loader } from '../../Other';
import { ShrinkEffect } from '../../Components/Effects';
import { cdnbaseurl, eventurl } from '../../Services/constante';
import EventParticipantsModal from '../../Components/Events/EventParticipantsModal';
import { Avatar } from '../../Components/Member';
import { displayHCP } from '../../Services/handicapNumbers';

export default function DisplayEventScreen({ route }: any) {
  const { event_id } = route.params;
  const { client, user } = useClient();
  const { colors } = useTheme();
  const { t } = useTranslation()
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<navigationProps>()

  const [eventInfo, setEventInfo] = useState<eventsInterface | undefined>(undefined);
  const [displayParcitipants, setDisplayParticipants] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);

  const getInfo = async () => {
    if (!event_id) return;
    const response = await client.events.fetchOne(event_id);
    if (!response.data || response.error) return handleToast(t(`errors.${response.error?.code}`));
    setEventInfo(response.data);
  }

  const joinEvent = async (eventInfo: eventsInterface) => {
    const response = await client.events.join(eventInfo.event_id);
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    handleToast(t(`events.join_success`));
    setEventInfo({ ...eventInfo, joined: true, participants: eventInfo.participants + 1 });
  }

  const leaveEvent = async (eventInfo: eventsInterface) => {
    const response = await client.events.leave(eventInfo.event_id);
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    handleToast(t(`events.leave_success`));
    setEventInfo({ ...eventInfo, joined: false, participants: eventInfo.participants - 1 });
  }

  const deleteEvent = async (eventInfo: eventsInterface) => {
    const response = await client.events.update(eventInfo.event_id, {
      deleted: true
    });
    if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
    handleToast(t(`errors.success`));
    navigation.goBack();
  }

  const shareEventToPost = (eventInfo: eventsInterface) => {
    navigation.navigate("CreateStack", {
      screen: "PostCreatorScreen",
      params: {
        attached_event: eventInfo,
        attached_golf: eventInfo.golf_info,
        initContent: `${eventInfo.title} : \n${eventInfo.description}`,
      }
    })
  }

  useEffect(() => {
    getInfo()
  }, [event_id])

  const onShare = async () => {
    await Share.share({
      message: `${eventurl}/${eventInfo?.event_id}`,
      url: `${eventurl}/${eventInfo?.event_id}`
    });
  }

  const addEvent = async () => {
    /**
     * Modify for https://www.npmjs.com/package/expo-calendar
     */
    if (eventInfo) {
      const eventConfig = {
        title: eventInfo.title,
        startDate: eventInfo.start_date,
        endDate: eventInfo.end_date,
        location: eventInfo.golf_info.name,
        notes: eventInfo.description,
      };

      const check_perm = await check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CALENDARS : PERMISSIONS.ANDROID.WRITE_CALENDAR);
      if (check_perm === 'granted') AddCalendarEvent.presentEventCreatingDialog(eventConfig);
      else {
        const perm = Platform.OS === 'ios' ? await request(PERMISSIONS.IOS.CALENDARS) : await request(PERMISSIONS.ANDROID.WRITE_CALENDAR)
        if (perm === 'granted') {
          AddCalendarEvent.presentEventCreatingDialog(eventConfig);
        }
      }
    }
  };

  const isOwner = (eventInfo: eventsInterface) => eventInfo.owner_info.user_id === user.user_id;

  const displayJointButton = () => {
    if (eventInfo) {
      if (isOwner(eventInfo)) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="delete" onPress={() => deleteEvent(eventInfo)}>
            {t('events.delete')}
          </Button>
        )
      } else if (!eventInfo.joinable) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="block-helper">
            {t('events.not_joinable')}
          </Button>
        )
      } else if (dayjs(new Date()).isAfter(eventInfo.start_date) && dayjs(new Date()).isBefore(eventInfo.end_date)) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="calendar-month">
            {t('events.started')}
          </Button>
        )
      } else if (dayjs(new Date()).isAfter(eventInfo.end_date)) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="calendar-month">
            {t('events.ended')}
          </Button>
        )
      } else {
        return (
          <Button style={{ width: "70%" }} mode='contained' icon={eventInfo.joined ? "account-minus" : "account-plus"} onPress={() => eventInfo.joined ? leaveEvent(eventInfo) : joinEvent(eventInfo)}>
            {eventInfo.joined ? t('events.leave') : t('events.join')}
          </Button>
        )
      }
    } else {
      return (
        <Button loading={true} textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="account-plus">
          {t('events.join')}
        </Button>
      )
    }
  }

  return (
    <SafeBottomContainer padding={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <ImageBackground style={{ height: full_height, width: full_width, flex: 1, backgroundColor: colors.bg_secondary }} source={{ uri: `${cdnbaseurl}/golf_covers/${eventInfo?.golf_info.slug}/default.jpg`, cache: "force-cache" }}>
        <View style={{ zIndex: 99, position: "absolute", bottom: 0, width: full_width, padding: 10, flexDirection: "row", justifyContent: "center" }}>
          {eventInfo && (
            <>
              <EventParticipantsModal event={eventInfo} setVisible={setDisplayParticipants} visible={displayParcitipants} />
              <BottomModal isVisible={showModal} onSwipeComplete={() => setShowModal(false)} dismiss={() => setShowModal(false)}>
                <Button uppercase onPress={() => onShare()} icon="share-variant">{t("events.share")}</Button>
                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                <Button uppercase onPress={() => shareEventToPost(eventInfo)} icon="content-duplicate">{t("events.share_post")}</Button>
                <Divider bold theme={{ colors: { outlineVariant: colors.bg_primary } }} />
                <Button uppercase textColor={colors.warning_color} onPress={() => setShowModal(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
              </BottomModal>
            </>
          )}

        </View>
        <View style={{ position: "absolute", padding: 10, paddingTop: top + 10, width: full_width, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <IconButton onPress={() => navigation.goBack()} mode='contained' icon="chevron-left" />
          {
            // <Button mode='contained'>{t("events.event")}</Button>
          }
          {eventInfo ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton mode='contained' iconColor={eventInfo.favorites ? colors.color_yellow : undefined} icon={`${eventInfo.favorites ? "star" : "star-outline"}`} />
              <IconButton mode='contained' icon="share-variant" onPress={() => setShowModal(true)} />
              {
                eventInfo.joined && (
                  <>
                    <IconButton mode='contained' icon="calendar-plus" onPress={addEvent} />
                  </>
                )
              }
            </View>
          ) : <Loader />}
        </View>
        <View style={{ zIndex: 99, position: "absolute", bottom: 15, width: full_width, padding: 10, flexDirection: "row", justifyContent: "center" }}>
          {displayJointButton()}
        </View>
        <ScrollView style={{ top: full_height / 4, backgroundColor: colors.bg_primary, borderRadius: 30, padding: 30, }}>
          {
            eventInfo ? (
              <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 10 }}>{eventInfo.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <ShrinkEffect onPress={() => navigation.navigate("GolfsStack", { screen: "GolfsProfileScreen", params: { golf_id: eventInfo.golf_info.golf_id } })} style={{ flexDirection: "row", alignItems: "center" }}>
                      <Chip style={{ borderRadius: 100 }} icon="map-marker-radius-outline">{eventInfo.golf_info.name}</Chip>
                    </ShrinkEffect>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Chip style={{ borderRadius: 100 }} icon="calendar-month-outline">{messageFormatDate(eventInfo.start_date).custom('LL')} - {messageFormatDate(eventInfo.end_date).custom('LL')}</Chip>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Chip onPress={() => setDisplayParticipants(true)} style={{ borderRadius: 100, marginRight: 5 }} icon="account-group-outline">{t("events.participants")} {eventInfo.participants} /{eventInfo?.max_participants ?? 2}</Chip>
                    <Chip style={{ borderRadius: 100 }} onPress={() => navigation.navigate("ProfileStack", {
                      screen: "ProfileScreen",
                      params: {
                        nickname: eventInfo.owner_info.nickname
                      }
                    })} avatar={<Avatar size={25} url={client.user.avatar(eventInfo.owner_info.user_id, eventInfo.owner_info.avatar)} />}>{t("events.owner")} {eventInfo.owner_info.username.substring(0, 20)}</Chip>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                    <Chip style={{ borderRadius: 100, marginRight: 5 }} icon="cash-marker">{t("events.greenfee")} {eventInfo?.greenfee ?? 0}</Chip>
                    <Chip style={{ borderRadius: 100 }} icon="sort-numeric-variant">{t("events.handicap")} {displayHCP(eventInfo?.min_hancicap ?? 520)} - {displayHCP(eventInfo?.max_handicap ?? -100)}</Chip>
                  </View>
                  <View style={{ flexDirection: "column", alignItems: "flex-start", marginBottom: 20, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t("events.about_event")}</Text>
                    <Text>{eventInfo.description}</Text>
                  </View>
                </View>
              </View>
            ) : <Loader />
          }
        </ScrollView>
      </ImageBackground>
    </SafeBottomContainer>
  );
}