import { ADD_USERS, INIT_USERS, RESET_USERS } from "./actionTypes";
import { GlobalInterface } from "../../Services/Client/Managers/Interfaces";

export const resetExploreTopTrends = (info = []) => ({
    type: RESET_USERS,
    info,
});

export const addExploreTopTrends = (info: GlobalInterface.userInfo[]) => ({
    type: ADD_USERS,
    info,
  });

export const initExploreTopTrends = (info: GlobalInterface.userInfo[]) => ({
    type: INIT_USERS,
    info,
});