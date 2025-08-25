import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS, ADD_CREATED_TRENDS } from "./actionTypes";
import { PostInterface } from "../../Services/Client/Managers/Interfaces";

export const resetRecentMainPosts = (info: []) => ({
    type: RESET_TRENDS,
    info,
});

export const addRecentMainPosts = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const addRecentMainCreatedPosts = (info: PostInterface.postResponseSchema) => ({
    type: ADD_CREATED_TRENDS,
    info,
});

export const initRecentMainPosts = (info: PostInterface.postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteRecentMainPosts = (info: string) => ({
    type: DELETE_TRENDS,
    info
})