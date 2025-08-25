import { ADD_CREATED_TRENDS, ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";
import { PostInterface } from "../../Services/Client/Managers/Interfaces";

export const mainFeedReducer = (state: PostInterface.postResponseSchema[] = [], action: {
    type: string,
    info: any
}): PostInterface.postResponseSchema[] => {
  switch (action.type) {
    case RESET_TRENDS:
        return [];
    case INIT_TRENDS:
        return action.info;
    case ADD_TRENDS:
        return [...state, ...action.info];
    case ADD_CREATED_TRENDS:
        return [action.info, ...state];
    case DELETE_TRENDS:
        return state.filter(p => p.post_id !== action.info);
    default:
      return state;
  }
};