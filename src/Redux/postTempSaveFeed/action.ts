
import { ADD_TRENDS } from "./actionTypes";
import { PostInterface } from "../../Services/Client/Managers/Interfaces";

export const addPostTempSaveTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });