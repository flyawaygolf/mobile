
import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from './actionTypes';
import { postResponseSchema } from '../../Services/Client/Managers/Interfaces/Post';

export const resetProfileTrends = (info: []) => ({
    type: RESET_TRENDS,
    info,
});

export const addProfileTrends = (info: postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });

export const initProfileTrends = (info: postResponseSchema[]) => ({
    type: INIT_TRENDS,
    info,
});

export const deleteProfileTrends = (info: string) => ({
    type: DELETE_TRENDS,
    info,
});
