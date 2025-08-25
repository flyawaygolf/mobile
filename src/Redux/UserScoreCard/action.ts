
import { ADD_MAIN_USER_SCORE_CARD, DELETE_MAIN_USER_SCORE_CARD, INIT_MAIN_USER_SCORE_CARD, RESET_MAIN_USER_SCORE_CARD } from "./actionTypes";
import { getUserScoreCardInterface } from "../../Services/Client/Managers/Interfaces/Scorecard";

export const resetUserScoreCard = (info: []) => ({
    type: RESET_MAIN_USER_SCORE_CARD,
    info,
});

export const addUserScoreCard = (info: getUserScoreCardInterface[]) => ({
    type: ADD_MAIN_USER_SCORE_CARD,
    info,
  });

export const initUserScoreCard = (info: getUserScoreCardInterface[]) => ({
    type: INIT_MAIN_USER_SCORE_CARD,
    info,
});

export const deleteUserScoreCard = (info: string) => ({
    type: DELETE_MAIN_USER_SCORE_CARD,
    info
})