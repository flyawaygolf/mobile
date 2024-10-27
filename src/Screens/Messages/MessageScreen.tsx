import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Text } from 'react-native-paper';
import { connect, useDispatch } from 'react-redux';

import { Chat, MessageType, defaultTheme } from '../../Components/Chat'
import { SafeBottomContainer, useClient, useTheme, useWebSocket } from '../../Components/Container';
import { guildI } from '../../Redux/guildList';
import { Loader } from '../../Other';
import { RootState, useAppSelector } from '../../Redux';
import { changeLastMessageGuildList, modifyGuildList } from '../../Redux/guildList/action';
import { addGuildMessages, addScrollGuildMessages, initGuildMessages } from '../../Redux/guildMessages/action';
import Client, { webSocketRoutes } from '../../Services/Client';
import { fetchMessageResponseInterface } from '../../Services/Client/Managers/Interfaces/Message';
import MessageBoxHeader from '../../Components/Messages/MessageBoxHeader';
import { MessageBox } from '../../Components/Messages/MessageBox';
import { handleToast } from '../../Services';

const formatMessages = (messages: fetchMessageResponseInterface[], guild_id: string, client: Client): MessageType.Any[] => messages.map(((m) => {
  return {
    author: {
      id: m.from.user_id,
      firstName: m.from.username,
      imageUrl: client.user.avatar(m.from.user_id, m.from.avatar)
    },
    guild_id: guild_id,
    id: m.message_id,
    status: undefined,
    text: m.content,
    type: "text",
    createdAt: dayjs(m.created_at).toDate().getTime()
  }
}))

const MessageScreen = ({ route }: any) => {

  const { colors } = useTheme();
  const { params }: { params: guildI } = route;
  const { client, user } = useClient();
  const { t, i18n } = useTranslation();
  const { notification } = useWebSocket();
  const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined)
  const [loadMessages, setLoadMessages] = useState(true);
  const [inWait, setInwait] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [messageInfo, setMessageInfo] = useState<MessageType.Text>();
  const dispatch = useDispatch();
  const messages = useAppSelector((state) => state.guildMessagesFeed[params.guild_id] || []);

  const getMessages = useCallback(async () => {
    try {
      setLoadMessages(true)
      const request = await client.messages.fetch(params.guild_id);
      setLoadMessages(false)
      if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
      if (request.data.length < 1) return;    
      dispatch(initGuildMessages(formatMessages(request.data, params.guild_id, client)))
      dispatch(modifyGuildList({ guild_id: params.guild_id, content: request.data[0].content, created_at: request.data[0].created_at, message_id: request.data[0].message_id, unread: false }))
      setPaginationKey(request.pagination_key)
      readMessage(request.data[0])
    } catch (error) {
      console.log(error);
    }
  }, [])

  useEffect(() => {
    getMessages()
  }, [])


  useEffect(() => {
    if (notification.code === webSocketRoutes.SEND_MESSAGE) {
      let data: any = notification.data;
      if (data.channel_id === params.guild_id) {
        dispatch(addGuildMessages(formatMessages([data], params.guild_id, client)))
        dispatch(modifyGuildList({ guild_id: data.channel_id, content: data.content, created_at: data.created_at, message_id: data.message_id, unread: false }))
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
    if(!pagination_key) return;
    const request = await client.messages.fetch(params.guild_id, { pagination_key: pagination_key });

    if (request?.data && request?.data?.length > 0) {
      dispatch(addScrollGuildMessages(formatMessages(request.data, params.guild_id, client)))
      if (request.pagination_key) setPaginationKey(request.pagination_key)
    }
  }, []);

  const readMessage = async (data: fetchMessageResponseInterface) => await client.messages.read(data.channel_id, data.message_id);

  const sendMessageToChannel = useCallback(async (message: MessageType.PartialText) => {
    if (inWait) return;
    setInwait(true);
    const request = await client.messages.create(params.guild_id, { content: message.text });
    setInwait(false);
    if (request.error) return handleToast(t(`errors.${request.error.code}`))
    if (!request.data) return;
    dispatch(addGuildMessages(formatMessages([request.data], params.guild_id, client)))
    dispatch(changeLastMessageGuildList({
      data: request.data,
      guild_id: params.guild_id
    }))
  }, []);


  const createAttachments = () => {
    console.log("pressed");
  }

  const enableModal = (message: MessageType.Text) => {
    setMessageInfo(message);
    setModalVisible(true);
  }

  const disableModal = () => {
    setModalVisible(false);
  }

  const MessageModal = () => {
    return (
      messageInfo && (
        <MessageBox info={messageInfo} modalVisible={modalVisible} setModalVisible={disableModal} />
      )
    );
  };
  
  const theme = useMemo(() => ({
    ...defaultTheme,
    colors: {
      ...defaultTheme.colors,
      primary: colors.bg_secondary,
      secondary: colors.bg_secondary,
      background: colors.bg_primary,
      inputBackground: colors.bg_secondary,
      inputText: colors.text_normal,
      error: colors.color_red,
      userAvatarNameColors: [colors.text_muted],
    },
    fonts: {
      ...defaultTheme.fonts,
      sentMessageBodyTextStyle: { ...defaultTheme.fonts.sentMessageBodyTextStyle, color: colors.text_normal },
      sentMessageCaptionTextStyle: { ...defaultTheme.fonts.sentMessageCaptionTextStyle, color: colors.text_normal },
      receivedMessageBodyTextStyle: { ...defaultTheme.fonts.receivedMessageBodyTextStyle, color: colors.text_normal },
    },
  }), [colors]);
  

  return (
    <SafeBottomContainer padding={0}>
      <MessageModal />
      <MessageBoxHeader params={params} />
      <Chat
        locale={i18n.language}
        onEndReached={() => onBottom()}
        sendButtonVisibilityMode='editing'
        emptyState={() => loadMessages ? <Loader /> : <Text>{t("messages.no_messages")}</Text>}
        // onAttachmentPress={() => createAttachments()}
        showUserAvatars={true}
        showUserNames={true}
        enableAnimation={true}
        theme={theme}
        onMessagePress={(message) => enableModal(message as MessageType.Text)}
        messages={messages}
        onSendPress={(message) => sendMessageToChannel(message)}
        user={{
          id: user.user_id,
          imageUrl: client.user.avatar(user.user_id, user.avatar)
        }}
      />
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
  addScrollGuildMessages
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);