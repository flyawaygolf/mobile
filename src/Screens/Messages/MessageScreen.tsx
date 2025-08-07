import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Text, IconButton, Surface, Divider } from 'react-native-paper';
import { connect, useDispatch } from 'react-redux';
import { View, KeyboardAvoidingView, Platform, FlatList, StyleSheet, Animated, TextInput } from 'react-native';

import { SafeBottomContainer, useClient, useTheme, useWebSocket } from '../../Components/Container';
import { RootState, useAppSelector } from '../../Redux';
import { changeLastMessageGuildList, modifyGuildList } from '../../Redux/guildList/action';
import { addGuildMessages, addScrollGuildMessages, initGuildMessages } from '../../Redux/guildMessages/action';
import Client, { webSocketRoutes } from '../../Services/Client';
import { fetchMessageResponseInterface } from '../../Services/Client/Managers/Interfaces/Message';
import MessageBoxHeader from '../../Components/Messages/MessageBoxHeader';
import MessageBubble from '../../Components/Messages/MessageBubble';
import { handleToast, MessageStackParams, ScreenNavigationProps } from '../../Services';
import { premiumAdvantages } from '../../Services/premiumAdvantages';
import MessagesContext from '../../Contexts/MessagesContext';
import { messageInfoInterface } from '../../Redux/guildMessages';

const formatMessages = (messages: fetchMessageResponseInterface[], guild_id: string, client: Client, sending = false): messageInfoInterface[] => messages.map(((m) => {
  return {
    author: {
      id: m.from.user_id,
      firstName: m.from.username,
      imageUrl: client.user.avatar(m.from.user_id, m.from.avatar),
    },
    guild_id: guild_id,
    id: m.message_id,
    status: sending ? "sending" : undefined,
    text: m.content,
    type: "text",
    createdAt: dayjs(m.created_at).toDate().getTime(),
  }
}))

const MessageScreen = ({ route }: ScreenNavigationProps<MessageStackParams, "MessageScreen">) => {

  const { colors } = useTheme();
  const { guild } = route.params;
  const { client, user } = useClient();
  const { t } = useTranslation();
  const { notification } = useWebSocket();
  const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined)
  const [inWait, setInwait] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = React.useRef<TextInput>(null);
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const messages = useAppSelector((state) => state.guildMessagesFeed[guild.guild_id] || []);
  const messageContext = useContext(MessagesContext);

  const advantages = premiumAdvantages(user.premium_type, user.flags)

  const getMessages = useCallback(async () => {
    try {
      const request = await client.messages.fetch(guild.guild_id);
      if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
      if (request.data.length < 1) return;
      dispatch(initGuildMessages(formatMessages(request.data, guild.guild_id, client)))
      dispatch(modifyGuildList({ guild_id: guild.guild_id, content: request.data[0].content, created_at: request.data[0].created_at, message_id: request.data[0].message_id, unread: false }))
      setPaginationKey(request.pagination_key)
      readMessage(request.data[0])
    } catch (error) {
      console.log(error);
    }
  }, [])

  useEffect(() => {
    getMessages();
    messageContext?.selectGuild(guild.guild_id);
  }, [])


  useEffect(() => {
    if (notification.code === webSocketRoutes.SEND_MESSAGE) {
      let data: any = notification.data;
      if (data.channel_id === guild.guild_id) {
        dispatch(addGuildMessages(formatMessages([data], guild.guild_id, client)))
        readMessage(data)
      }
    } /*else if(notification.code === webSocketRoutes.START_TYPING) {
      if(typings.some(t => t.user_id === notification.data.from.user_id)) return;
      setTypings([...typings, notification.data.from])
    } else if(notification.code === webSocketRoutes.STOP_TYPING) {
      setTypings(typings.filter((t) => t.user_id !== notification.data.from.user_id))
    }*/
  }, [notification])


  const onBottom = useCallback(async () => {
    if (!pagination_key) return;
    const request = await client.messages.fetch(guild.guild_id, { pagination_key: pagination_key });

    if (request?.data && request?.data?.length > 0) {
      dispatch(addScrollGuildMessages(formatMessages(request.data, guild.guild_id, client)))
      if (request.pagination_key) setPaginationKey(request.pagination_key)
    }
  }, []);

  const readMessage = async (data: fetchMessageResponseInterface) => {
    await client.messages.read(data.channel_id, data.message_id);
    dispatch(modifyGuildList({ guild_id: data.channel_id, content: data.content, created_at: data.created_at, message_id: data.message_id, unread: false }))
  }

  const sendMessage = useCallback(async () => {
    if (inWait || !inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    setInputHeight(40);
    inputRef.current?.blur();
    setInwait(true);

    if (messageText.length > advantages.textLength()) {
      setInwait(false);
      return handleToast(t(`errors.2001`));
    }

    const request = await client.messages.create(guild.guild_id, { content: messageText });
    setInwait(false);

    if (request.error) return handleToast(t(`errors.${request.error.code}`))
    if (!request.data) return;

    // Suppression de ces lignes car le message sera reçu via WebSocket
    // dispatch(addGuildMessages(formatMessages([request.data], guild.guild_id, client)))
    dispatch(changeLastMessageGuildList({
      data: request.data,
      guild_id: guild.guild_id,
    }))
  }, [inputText, inWait, advantages, guild.guild_id, client, dispatch, t]);

  const handleInputFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleContentSizeChange = (event: any) => {
    const height = Math.max(40, Math.min(120, event.nativeEvent.contentSize.height));
    setInputHeight(height);
  };

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <Divider style={styles.divider} />
      <Surface style={styles.dateChip} elevation={1}>
        <Text style={styles.dateText}>
          {dayjs(date).format('DD MMMM YYYY')}
        </Text>
      </Surface>
      <Divider style={styles.divider} />
    </View>
  );

  const renderMessage = ({ item, index }: { item: any, index: number }) => {
    // Dans une FlatList inversée:
    // - index 0 = message le plus récent (en bas visuellement)
    // - index length-1 = message le plus ancien (en haut visuellement)

    const currentDate = dayjs(item.createdAt).format('YYYY-MM-DD');

    // Pour déterminer si on affiche un séparateur de date:
    // On regarde le message suivant dans l'ordre chronologique (index + 1 dans la liste inversée)
    const olderMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const olderDate = olderMessage ? dayjs(olderMessage.createdAt).format('YYYY-MM-DD') : null;

    // Afficher le séparateur si:
    // - C'est le message le plus ancien (pas de message plus ancien)
    // - La date est différente du message plus ancien
    const shouldShowDateSeparator = !olderMessage || currentDate !== olderDate;

    // Convert MessageType to MessageBubble format
    const messageInfo = {
      channel_id: item.guild_id,
      content: item.text || '',
      content_language: 'fr' as any,
      message_id: item.id,
      created_at: new Date(item.createdAt).toISOString(),
      type: 'text' as any,
      from: {
        user_id: item.author.id,
        username: item.author.firstName,
        nickname: item.author.firstName,
        avatar: item.author.imageUrl,
      },
    };

    return (
      <View>
        {/* Le séparateur doit apparaître AVANT le premier message d'une nouvelle journée */}
        {shouldShowDateSeparator && renderDateSeparator(new Date(item.createdAt).toISOString())}
        <MessageBubble
          info={messageInfo}
          status={item.status as any}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    messagesList: {
      flex: 1,
      paddingTop: 8,
    },
    inputContainer: {
      backgroundColor: colors.bg_primary,
      paddingHorizontal: 16,
      paddingTop: 8,
      marginBottom: 8,
      borderTopWidth: 1,
      borderTopColor: colors.bg_secondary + '40',
    },
    inputWrapper: {
      backgroundColor: colors.bg_secondary,
      borderRadius: 28,
      paddingHorizontal: 4,
      paddingVertical: 4,
      elevation: 2,
      shadowColor: colors.bg_primary_opacity,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      minHeight: 48,
    },
    textInputContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    textInput: {
      fontSize: 16,
      color: colors.text_normal,
      maxHeight: 120,
      textAlignVertical: 'top',
      includeFontPadding: false,
      padding: 0,
      margin: 0,
    },
    placeholder: {
      position: 'absolute',
      left: 16,
      top: 8,
      color: colors.text_muted,
      fontSize: 16,
      zIndex: 1,
    },
    sendButtonContainer: {
      width: 40,
      height: 40,
      marginRight: 4,
      marginBottom: 4,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.bg_primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 3,
      shadowColor: colors.bg_primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    sendButtonDisabled: {
      backgroundColor: colors.bg_third,
      elevation: 0,
      shadowOpacity: 0,
    },
    characterCount: {
      position: 'absolute',
      bottom: -20,
      right: 16,
      fontSize: 11,
      color: colors.text_muted,
    },
    characterCountWarning: {
      color: colors.color_red,
    },
    inputFocusedContainer: {
      borderWidth: 2,
      borderColor: colors.bg_primary + '40',
    },
    // ...existing date separator styles...
    dateSeparator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      marginHorizontal: 16,
    },
    divider: {
      flex: 1,
      backgroundColor: colors.bg_secondary,
    },
    dateChip: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.bg_secondary,
      marginHorizontal: 8,
    },
    dateText: {
      fontSize: 12,
      color: colors.text_muted,
      fontWeight: '500',
    },
  });

  const canSend = inputText.trim().length > 0 && !inWait;

  const animatedBorderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bg_secondary, colors.bg_primary + '60'],
  });

  return (
    <SafeBottomContainer padding={{
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
      }}>
        <MessageBoxHeader guild={guild} />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            style={styles.messagesList}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            onEndReached={onBottom}
            onEndReachedThreshold={0.5}
            inverted
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          />

          <View style={styles.inputContainer}>
            <Animated.View
              style={[
                styles.inputWrapper,
                isFocused && styles.inputFocusedContainer,
                { borderColor: animatedBorderColor }
              ]}
            >
              <View style={styles.inputRow}>
                <View style={[styles.textInputContainer, { height: Math.max(32, inputHeight) }]}>
                  <TextInput
                    ref={inputRef}
                    style={[styles.textInput, { height: Math.max(24, inputHeight - 16) }]
                    }
                    placeholderTextColor={colors.text_muted}
                    value={inputText}
                    onChangeText={setInputText}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onContentSizeChange={handleContentSizeChange}
                    multiline
                    placeholder={t("messages.type_message")}
                    maxLength={advantages.textLength()}
                    textAlignVertical="top"
                    returnKeyType="default"
                  />
                </View>

                <View style={styles.sendButtonContainer}>
                  <Animated.View
                    style={[
                      styles.sendButton,
                      !canSend && styles.sendButtonDisabled,
                      {
                        transform: [{
                          scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [canSend ? 1 : 0.8, 1],
                          })
                        }]
                      }
                    ]}
                  >
                    <IconButton
                      icon={"send"}
                      size={20}
                      loading={inWait}
                      iconColor={canSend ? colors.fa_primary || '#FFFFFF' : colors.text_muted}
                      onPress={sendMessage}
                      disabled={!canSend}
                      style={{ margin: 0 }}
                    />
                  </Animated.View>
                </View>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
    </SafeBottomContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    guildMessagesFeed: state.guildMessagesFeed,
  };
};

const mapDispatchToProps = {
  changeLastMessageGuildList,
  modifyGuildList,
  initGuildMessages,
  addGuildMessages,
  addScrollGuildMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);
