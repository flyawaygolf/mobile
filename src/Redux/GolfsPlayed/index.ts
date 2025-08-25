import { ADD_GOLFS_PLAYED, DELETE_GOLFS_PLAYED, INIT_GOLFS_PLAYED, RESET_GOLFS_PLAYED } from "./actionTypes";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Golf";

export const golfsPlayedReducer = (state: golfInterface[] = [], action: {
    type: string,
    info: any
}): golfInterface[] => {
  switch (action.type) {
    case RESET_GOLFS_PLAYED:
        return [];
    case INIT_GOLFS_PLAYED:
        return action.info;
    case ADD_GOLFS_PLAYED:
        return [...state, ...action.info];
    case DELETE_GOLFS_PLAYED:
        return state.filter(p => p.golf_id !== action.info);
    default:
      return state;
  }
};