import type { error, premium_type } from "./Global";
import type { fetchMessageResponseInterface } from "./Message";

export interface userInfo {
    username: string,
    nickname: string,
    avatar: string,
    accent_color: string,
    premium_type: premium_type,
    certified: boolean,
    flags: number,
    is_private: boolean,
    created_at: string,
    user_id: string,
}

export interface fetchGuildResponseSchema {
    guild_id: string,
    created_at: string,
    type: 0 | 1,
    users: Array<userInfo>,
    title: string,
    favorite: boolean,
    unread?: boolean;
    last_message?: fetchMessageResponseInterface
}

export interface guildCreateResponse {
    error?: error,
    data?: fetchGuildResponseSchema
}

export interface guildFetchResponse {
    error?: error,
    data?: Array<fetchGuildResponseSchema>
}
