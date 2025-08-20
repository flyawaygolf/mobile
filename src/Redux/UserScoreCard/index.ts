import { getUserScoreCardInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";
import { ADD_MAIN_USER_SCORE_CARD, DELETE_MAIN_USER_SCORE_CARD, INIT_MAIN_USER_SCORE_CARD, RESET_MAIN_USER_SCORE_CARD } from "./actionTypes";

export const userScorecardsReducer = (state: getUserScoreCardInterface[] = [], action: {
    type: string,
    info: any
}): getUserScoreCardInterface[] => {
  switch (action.type) {
    case RESET_MAIN_USER_SCORE_CARD:
        return [];
    case INIT_MAIN_USER_SCORE_CARD:
        return action.info;
    case ADD_MAIN_USER_SCORE_CARD:
        return [...state, ...action.info];
    case DELETE_MAIN_USER_SCORE_CARD:
        return state.filter(p => p.user_scorecard_id !== action.info);
    default:
      return state;
  }
};