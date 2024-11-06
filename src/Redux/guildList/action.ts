import { fetchGuildResponseSchema } from "../../Services/Client/Managers/Interfaces/Guild";
import { fetchMessageResponseInterface, unreadFetchResponseInterface } from "../../Services/Client/Managers/Interfaces/Message";
import { ADD_GUILDS, DELETE_GUILDS, INIT_GUILDS, MODIFY_GUILDS, RESET_GUILDS, UNREAD_GUILDS, CHANGE_MESSAGE_UNREAD_GUILDS } from "./actionTypes";

export const resetGuildList = (info = []) => ({
    type: RESET_GUILDS,
    info,
});

export const addGuildList = (info: fetchGuildResponseSchema[]) => ({
    type: ADD_GUILDS,
    info,
  });

export const initGuildList = (info: fetchGuildResponseSchema[]) => ({
    type: INIT_GUILDS,
    info,
});

export const deleteGuildList = (info: string) => ({
    type: DELETE_GUILDS,
    info,
})

export const modifyGuildList = (info: { guild_id: string, content: string, created_at: string, message_id: string, unread?: boolean }) => ({
    type: MODIFY_GUILDS,
    info,
})

export const setUnreadGuildList = (info: unreadFetchResponseInterface[]) => ({
    type: UNREAD_GUILDS,
    info,
})

export interface IchangeLastMessageGuildList {
    guild_id: string;
    data: fetchMessageResponseInterface
}

export const changeLastMessageGuildList = (info: IchangeLastMessageGuildList) => ({
    type: CHANGE_MESSAGE_UNREAD_GUILDS,
    info,
})
