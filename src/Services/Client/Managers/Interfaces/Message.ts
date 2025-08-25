import type { error, attachments, embeds, premium_type } from "./Global";
import type { postTypes } from "./Post";
import type { ISO_639_CODE_LIST } from "../../utils/ISO-369-1";

// undefined -> delivered -> seen
export type messageStatus = undefined | "delivered" | 'seen';

export interface createParams {
    content: string;
    attachments?: Array<attachments>;
}
export interface userResponseInterface {
    username: string;
    nickname: string;
    avatar: string;
    premium_type: premium_type;
    certified: boolean;
    is_private: boolean;
    user_id: string;
}
export interface fetchMessageResponseInterface {
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
    from: userResponseInterface;
}
export interface messageCreateResponse {
    error?: error;
    data?: fetchMessageResponseInterface;
}
export interface messageFetchResponse {
    error?: error;
    data?: Array<fetchMessageResponseInterface>;
    pagination_key?: string;
}
export interface unreadFetchResponseInterface {
    /**
     * ID du dernier message lu
     */
    message_id: string;
    user_id: string;
    channel_id: string;
    created_at: string;
}
export interface unreadFetchResponse {
    error?: error;
    data?: Array<unreadFetchResponseInterface>;
}
