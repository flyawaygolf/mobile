import { Text, useTheme, Icon } from "react-native-paper";
import { View, StyleSheet, Pressable } from "react-native";
import { useClient } from "../Container";
import { messageStatus, userResponseInterface } from "../../Services/Client/Managers/Interfaces/Message";
import { attachments, embeds } from "../../Services/Client/Managers/Interfaces/Global";
import { postTypes } from "../../Services/Client/Managers/Interfaces/Post";
import { ISO_639_CODE_LIST } from "../../Services/Client/utils/ISO-369-1";
import { Avatar } from "../Member";
import { MessageBox } from "./MessageBox";
import { useState } from "react";

export type MessageBubbleUserInfo = {
    user_id: string
    username: string;
    nickname: string;
    avatar: string;
};

export type MessageBubbleInfoProps = {
    channel_id: string;
    content: string;
    content_language: ISO_639_CODE_LIST;
    attachments?: Array<attachments>;
    type: postTypes;
    embeds?: Array<embeds>;
    mentions?: Array<userResponseInterface>;
    hashtags?: Array<string>;
    message_id: string;
    created_at: string;
    status?: messageStatus;
    from: MessageBubbleUserInfo;
}

export type SectionProps = {
    info: MessageBubbleInfoProps;
    status?: "sending" | "delivered" | "seen";
};

export default function MessageBubble({ info, status }: SectionProps) {
    const { colors } = useTheme();
    const { user } = useClient();

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const isOwnMessage = info.from.user_id === user.user_id;
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'sending':
                return <Icon source="clock-outline" size={12} color={colors.outline} />;
            case 'delivered':
                return <Icon source="check" size={12} color={colors.outline} />;
            case 'seen':
                return <Icon source="check-all" size={12} color={colors.primary} />;
            default:
                return null;
        }
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: isOwnMessage ? 'row-reverse' : 'row',
            marginVertical: 2,
            marginHorizontal: 12,
            alignItems: 'flex-end',
        },
        avatarContainer: {
            marginHorizontal: 8,
            opacity: isOwnMessage ? 0 : 1,
        },
        messageContainer: {
            flex: 1,
            maxWidth: '80%',
        },
        bubble: {
            marginVertical: 1,
            borderRadius: 18,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: isOwnMessage ? colors.primary : colors.surfaceVariant,
            alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
            borderBottomLeftRadius: isOwnMessage ? 18 : 4,
            borderBottomRightRadius: isOwnMessage ? 4 : 18,
            elevation: 1,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        messageText: {
            fontSize: 16,
            lineHeight: 20,
            color: isOwnMessage ? colors.onPrimary : colors.onSurfaceVariant,
        },
        messageInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
            marginTop: 2,
            paddingHorizontal: 4,
        },
        timestamp: {
            fontSize: 11,
            color: colors.outline,
            marginHorizontal: 4,
        },
        username: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.primary,
            marginBottom: 2,
            marginLeft: isOwnMessage ? 0 : 4,
        },
    });

    return (
        <>
            <MessageBox info={info} modalVisible={modalVisible} setModalVisible={setModalVisible} />
            <Pressable style={styles.container} onPress={() => setModalVisible(true)}>
                {!isOwnMessage && (
                    <View style={styles.avatarContainer}>
                        <Avatar
                            url={info.from.avatar}
                            rounded={true}
                            size={32}
                        />
                    </View>
                )}

                <View style={styles.messageContainer}>
                    {!isOwnMessage && (
                        <Text style={styles.username}>
                            {info.from.nickname || info.from.username}
                        </Text>
                    )}

                    <View style={styles.bubble}>
                        <Text style={styles.messageText}>
                            {info.content}
                        </Text>
                    </View>

                    <View style={styles.messageInfo}>
                        <Text style={styles.timestamp}>
                            {formatTime(info.created_at)}
                        </Text>
                        {isOwnMessage && getStatusIcon()}
                    </View>
                </View>
            </Pressable>
        </>

    );
}