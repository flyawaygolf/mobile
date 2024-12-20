
import { ADD_TRENDS, DELETE_TRENDS, INIT_TRENDS, RESET_TRENDS } from './actionTypes';

export interface postResponseSchema {
    post_id: string;
}

export const profileFeedReducer = (state: postResponseSchema[] = [], action: {
    type: string,
    info: any
}): postResponseSchema[] => {
  switch (action.type) {
    case RESET_TRENDS:
        return [];
    case INIT_TRENDS:
        return action.info;
    case ADD_TRENDS:
        return [...state, action.info];
    case DELETE_TRENDS:
        return state.filter(p => p.post_id !== action.info);
    default:
      return state;
  }
};
