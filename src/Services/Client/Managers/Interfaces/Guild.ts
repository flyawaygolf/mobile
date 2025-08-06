import type { error, userInfo } from "./Global";
import type { fetchMessageResponseInterface } from "./Message";

export interface fetchGuildResponseSchema {
    guild_id: string,
    created_at: string,
    type: 0 | 1 | 2,
    users: Array<userInfo>, // To delete and replace with "members" in the future
    members: Array<userInfo>,
    title?: string, // to delete and replace with "guild_name" in the future
    guild_name: string,
    event_id?: string,
    member_count?: number,
    owner: string,
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

export interface guildMembersFetchSchema {
    members: Array<userInfo>,
    total_members: number
}

export interface guildMembersFetchResponse {
    error?: error,
    data?: guildMembersFetchSchema,
    pagination_key?: string
}

export interface guildUpdateParams {
    guild_name?: string,
}

export interface guildUserAddResponse {
    error?: error,
    data?: {
        added_count: number,
        failed_count: number,
        added_users: string[],
        failed_users: string[],
        new_guild: fetchGuildResponseSchema
    }
}