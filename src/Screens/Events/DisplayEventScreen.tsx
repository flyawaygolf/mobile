import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, ScrollView, Share, View } from 'react-native';
import { Button, Chip, Divider, IconButton, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SafeBottomContainer, useClient, useTheme } from '../../Components/Container';
import { ShrinkEffect } from '../../Components/Effects';
import EventParticipantsModal from '../../Components/Events/EventParticipantsModal';
import { Avatar } from '../../Components/Member';
import { BottomModal, Loader } from '../../Other';
import { handleToast, messageFormatDate, navigationProps } from '../../Services';
import { eventsInterface } from '../../Services/Client/Managers/Interfaces/Events';
import {
  CalendarEventType,
  CompetitionFormatEnum,
  EventStatusEnum,
  SkillLevelEnum
} from '../../Services/Client/Managers/Interfaces/Events';
import { eventurl } from '../../Services/constante';
import { displayHCP } from '../../Services/handicapNumbers';
import { full_width } from '../../Style/style';

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
  const [showTextModal, setShowTextModal] = useState(false);
  const [modalText, setModalText] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');

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
  };

  const isOwner = (eventInfo: eventsInterface) => eventInfo.owner_info.user_id === user.user_id;

  const isOfficial = (eventInfo: eventsInterface) => !!eventInfo.official;

  const displayJointButton = () => {
    if (eventInfo) {
      // Vérification du propriétaire
      if (isOwner(eventInfo)) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="delete" onPress={() => deleteEvent(eventInfo)}>
            {t('events.delete')}
          </Button>
        )
      }
      // Vérification si l'événement est non rejoignable
      else if (!eventInfo.joinable) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="block-helper">
            {t('events.not_joinable')}
          </Button>
        )
      }
      // Vérification du handicap utilisateur
      else if (
        typeof user?.golf_info?.handicap === "number" &&
        (
          (typeof eventInfo.min_handicap === "number" && user.golf_info.handicap < eventInfo.min_handicap) ||
          (typeof eventInfo.max_handicap === "number" && user.golf_info.handicap > eventInfo.max_handicap)
        )
      ) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="block-helper">
            {t('events.handicap_not_allowed')}
          </Button>
        )
      }
      // Vérification si l'événement a commencé
      else if (dayjs(new Date()).isAfter(eventInfo.start_date) && dayjs(new Date()).isBefore(eventInfo.end_date)) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="calendar-month">
            {t('events.started')}
          </Button>
        )
      }
      // Vérification si l'événement est terminé
      else if (dayjs(new Date()).isAfter(eventInfo.end_date)) {
        return (
          <Button textColor={colors.badge_color} style={{ width: "70%" }} mode='outlined' icon="calendar-month">
            {t('events.ended')}
          </Button>
        )
      }
      // Bouton rejoindre/quitter
      else {
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

  // Helpers pour récupérer la clé de traduction à partir de l'enum
  const getEventTypeKey = (type: CalendarEventType) => {
    switch (type) {
      case CalendarEventType.TOURNAMENT: return 'tournament';
      case CalendarEventType.LESSON: return 'lesson';
      case CalendarEventType.SOCIAL: return 'social';
      case CalendarEventType.MEETING: return 'meeting';
      default: return String(type);
    }
  };

  const getFormatKey = (format: CompetitionFormatEnum) => {
    switch (format) {
      case CompetitionFormatEnum.STROKE_PLAY: return 'stroke_play';
      case CompetitionFormatEnum.MATCH_PLAY: return 'match_play';
      case CompetitionFormatEnum.STABLEFORD: return 'stableford';
      case CompetitionFormatEnum.BEST_BALL: return 'best_ball';
      case CompetitionFormatEnum.SCRAMBLE: return 'scramble';
      default: return String(format);
    }
  };

  const getStatusKey = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.SCHEDULED: return 'scheduled';
      case EventStatusEnum.IN_PROGRESS: return 'in_progress';
      case EventStatusEnum.COMPLETED: return 'completed';
      case EventStatusEnum.CANCELLED: return 'cancelled';
      default: return String(status);
    }
  };

  const getSkillLevelKey = (level: SkillLevelEnum) => {
    switch (level) {
      case SkillLevelEnum.BEGINNER: return 'beginner';
      case SkillLevelEnum.INTERMEDIATE: return 'intermediate';
      case SkillLevelEnum.ADVANCED: return 'advanced';
      case SkillLevelEnum.PROFESSIONAL: return 'professional';
      default: return String(level);
    }
  };

  const openTextModal = (title: string, text: string) => {
    setModalTitle(title);
    setModalText(text);
    setShowTextModal(true);
  }

  return (
    <SafeBottomContainer padding={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <View style={{ flex: 1, backgroundColor: colors.bg_secondary }}>
        {/* Header fixé */}
        <ImageBackground
          style={{
            width: full_width,
            height: 220,
            justifyContent: 'flex-end',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            overflow: 'hidden',
            backgroundColor: colors.bg_secondary,
          }}
          source={{
            uri: eventInfo?.golf_info.slug
              ? client.golfs.cover(eventInfo?.golf_info.golf_id)
              : undefined,
            cache: "force-cache"
          }}
        >
          {/* Modal de partage et participants */}
          {eventInfo && (
            <>
              {/* Modal pour afficher le texte complet des règles spéciales ou de la politique d'annulation */}
              <BottomModal isVisible={showTextModal} onSwipeComplete={() => setShowTextModal(false)} dismiss={() => setShowTextModal(false)}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>{modalTitle}</Text>
                <Text style={{ marginBottom: 20 }}>{modalText}</Text>
                <Button uppercase textColor={colors.warning_color} onPress={() => setShowTextModal(false)} icon="keyboard-return">{t("commons.cancel")}</Button>
              </BottomModal>
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
          <View style={{
            position: "absolute",
            top: top + 10,
            left: 0,
            right: 0,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            zIndex: 10,
          }}>
            <IconButton onPress={() => navigation.goBack()} mode='contained' icon="chevron-left" />
            {eventInfo ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {
                  eventInfo.favorites && <IconButton mode='contained' iconColor={eventInfo.favorites ? colors.color_yellow : undefined} icon={`${eventInfo.favorites ? "star" : "star-outline"}`} />
                }
                <IconButton mode='contained' icon="share-variant" onPress={() => setShowModal(true)} />
                {/*eventInfo.joined && (
                  <IconButton mode='contained' icon="calendar-plus" onPress={addEvent} />
                )*/}
              </View>
            ) : <Loader />}
          </View>
          {/* Titre + badge officiel */}
          {eventInfo && (
            <View style={{
              padding: 20,
              paddingBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 28, color: 'white', flex: 1 }}>{eventInfo.title}</Text>
              {isOfficial(eventInfo) && (
                <Chip style={{ backgroundColor: colors.fa_primary, borderRadius: 100 }} theme={{ colors: { primary: "white" } }} icon="check-decagram" textStyle={{ color: 'white', fontWeight: 'bold' }}>
                  {t('events.official')}
                </Chip>
              )}
            </View>
          )}
        </ImageBackground>

        {/* ScrollView pour tout le contenu */}
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
            marginBottom: 90, // espace pour le bouton principal
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {eventInfo ? (
            <View style={{ flexDirection: "column", gap: 20 }}>
              {/* Type d'événement + format + badge officiel */}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: 'wrap' }}>
                <Chip style={{ borderRadius: 100 }} icon="calendar-month-outline">
                  {t(`event_type.${getEventTypeKey(eventInfo.event_type)}`)}
                </Chip>
                <Chip style={{ borderRadius: 100 }} icon="star">
                  {t('events.competition_format')}: {t(`event_format.${getFormatKey(eventInfo.format)}`)}
                </Chip>
                {isOfficial(eventInfo) && (
                  <Chip style={{ backgroundColor: colors.fa_primary, borderRadius: 100 }} theme={{ colors: { primary: "white" } }} icon="check-decagram" textStyle={{ fontWeight: 'bold' }}>
                    {t('events.official')}
                  </Chip>
                )}
                {/* Ajout du statut de l'événement */}
                <Chip style={{ borderRadius: 100 }} icon="information">
                  {t(`event_status.title`)}: {t(`event_status.${getStatusKey(eventInfo.status)}`)}
                </Chip>
                {/* Ajout du niveau de compétence */}
                {eventInfo.skill_level && (
                  <Chip style={{ borderRadius: 100 }} icon="school">
                    {t('events.skill_level')}: {t(`event_skill.${getSkillLevelKey(eventInfo.skill_level)}`)}
                  </Chip>
                )}
              </View>

              {/* Dates et horaires */}
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('events.dates_and_times')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: 'wrap' }}>
                <Chip style={{ borderRadius: 100 }} icon="calendar-start">
                  {t('events.start_date')}: {messageFormatDate(eventInfo.start_date).custom('LLL')}
                </Chip>
                <Chip style={{ borderRadius: 100 }} icon="calendar-end">
                  {t('events.end_date')}: {messageFormatDate(eventInfo.end_date).custom('LLL')}
                </Chip>
              </View>

              {/* Lieu */}
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('events.location_and_fees')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: 'wrap' }}>
                <ShrinkEffect onPress={() => navigation.navigate("GolfsStack", { screen: "GolfsProfileScreen", params: { golf_id: eventInfo.golf_info.golf_id } })} style={{ flexDirection: "row", alignItems: "center" }}>
                  <Chip style={{ borderRadius: 100 }} icon="map-marker-radius-outline">{eventInfo.golf_info.name}</Chip>
                </ShrinkEffect>
                <Chip style={{ borderRadius: 100 }} icon="cash-marker">{t("events.greenfee")} {eventInfo?.greenfee ?? 0}</Chip>
                {eventInfo.entry_fee !== undefined && (
                  <Chip style={{ borderRadius: 100 }} icon="cash-marker">{t("events.entry_fee")} {eventInfo.entry_fee}</Chip>
                )}
              </View>

              {/* Participants */}
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('events.participants_and_restrictions')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: 'wrap' }}>
                <Chip onPress={() => setDisplayParticipants(true)} style={{ borderRadius: 100 }} icon="account-group-outline">
                  {t("events.participants")} {eventInfo.participants} / {eventInfo?.max_participants ?? 2}
                </Chip>
                <Chip style={{ borderRadius: 100 }} avatar={<Avatar size={25} url={client.user.avatar(eventInfo.owner_info.user_id, eventInfo.owner_info.avatar)} />} onPress={() => navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: eventInfo.owner_info.nickname } })}>
                  {t("events.owner")} - {eventInfo.owner_info.username.substring(0, 20)}
                </Chip>
                {eventInfo.skill_level && (
                  <Chip style={{ borderRadius: 100 }} icon="school">
                    {t('events.skill_level')}: {t(`event_skill.${getSkillLevelKey(eventInfo.skill_level)}`)}
                  </Chip>
                )}
                <Chip style={{ borderRadius: 100 }} icon="sort-numeric-variant">
                  {t("events.handicap")} {displayHCP(eventInfo?.min_handicap ?? 520)} - {displayHCP(eventInfo?.max_handicap ?? -100)}
                </Chip>
                {eventInfo.category && (
                  <Chip style={{ borderRadius: 100 }} icon="account-group">
                    {t('events.categories_allowed')}: {Object.entries(eventInfo.category).filter(([_, v]) => v).map(([k]) => t(`event_categories.${k}`)).join(', ')}
                  </Chip>
                )}
                {(eventInfo.age_restriction?.min_age || eventInfo.age_restriction?.max_age) && (
                  <Chip style={{ borderRadius: 100 }} icon="calendar-account">
                    {t('events.age_restrictions')}: {eventInfo.age_restriction?.min_age ?? '-'} - {eventInfo.age_restriction?.max_age ?? '-'}
                  </Chip>
                )}
              </View>

              {/* Règles et conditions */}
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('events.rules_and_conditions')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: 'wrap' }}>
                {eventInfo.dress_code && (
                  <Chip style={{ borderRadius: 100 }} icon="tshirt-crew">{t('events.dress_code_required')}</Chip>
                )}
                {eventInfo.equipment_required && eventInfo.equipment_required.length > 0 && (
                  <Chip style={{ borderRadius: 100 }} icon="golf">{t('events.equipment_required')}: {eventInfo.equipment_required.join(', ')}</Chip>
                )}
                {eventInfo.special_rules && (
                  <Chip
                    style={{ borderRadius: 100 }}
                    icon="alert-circle-outline"
                    onPress={() => openTextModal(t('events.special_rules'), eventInfo.special_rules ?? '')}
                  >
                    {t('events.special_rules')}: {eventInfo.special_rules}
                  </Chip>
                )}
                {eventInfo.cancellation_policy && (
                  <Chip
                    style={{ borderRadius: 100, flexWrap: "wrap" }}
                    icon="cancel"
                    onPress={() => openTextModal(t('events.cancellation_policy'), eventInfo.cancellation_policy ?? '')}
                  >
                    {t('events.cancellation_policy')}: {eventInfo.cancellation_policy}
                  </Chip>
                )}
              </View>

              {/* Visibilité et accès */}
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('events.visibility_and_access')}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: 'wrap' }}>
                { 
                  eventInfo.favorites && <Chip style={{ borderRadius: 100 }} icon={eventInfo.favorites ? "star" : "star-outline"}>{t('events.favorites')}</Chip>
                }
                <Chip style={{ borderRadius: 100 }} icon={eventInfo.is_private ? "lock" : "lock-open"}>{eventInfo.is_private ? t('events.private') : t('events.public')}</Chip>
              </View>

              {/* Description */}
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{t('events.about_event')}</Text>
              <Text style={{ marginBottom: 10 }}>{eventInfo.description}</Text>
            </View>
          ) : <Loader />}
        </ScrollView>

        {/* Bouton principal fixé en bas */}
        <View style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 15,
          backgroundColor: colors.bg_primary,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          alignItems: "center",
        }}>
          {displayJointButton()}
        </View>
      </View>
    </SafeBottomContainer>
  );
}