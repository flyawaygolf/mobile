import { ADD_GUILD_MESSAGES, ADD_SCROLL_GUILD_MESSAGES, DELETE_GUILD_MESSAGES, INIT_GUILD_MESSAGES, MODIFY_GUILD_MESSAGES, RESET_GUILD_MESSAGES } from "./actionTypes";
import { messageInfoInterface } from ".";

export const resetGuildMessages = (info: any) => ({
    type: RESET_GUILD_MESSAGES,
    info,
});

export const addGuildMessages = (info: messageInfoInterface[]) => ({
    type: ADD_GUILD_MESSAGES,
    info,
});

export const addScrollGuildMessages = (info: messageInfoInterface[]) => ({
    type: ADD_SCROLL_GUILD_MESSAGES,
    info,
});

export const initGuildMessages = (info: messageInfoInterface[]) => ({
    type: INIT_GUILD_MESSAGES,
    info,
});

export const deleteGuildMessages = (info: messageInfoInterface) => ({
    type: DELETE_GUILD_MESSAGES,
    info
})

export const modifyGuildMessages = (info: messageInfoInterface) => ({
    type: MODIFY_GUILD_MESSAGES,
    info
})