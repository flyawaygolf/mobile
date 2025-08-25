import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from "./actionTypes";
import { PostInterface } from "../../Services/Client/Managers/Interfaces";

export const resetCommentTrends = (info: []) => ({
    type: RESET_TRENDS,
    info,
});

export const addCommentTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const initCommentTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteCommentTrends = (info: string) => ({
    type: DELETE_TRENDS,
    info
})