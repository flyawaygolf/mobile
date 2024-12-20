
import { PostInterface } from "../../Services/Client/Managers/Interfaces";
import { ADD_TRENDS } from "./actionTypes";

export const addPostTempSaveTrends = (info: PostInterface.postResponseSchema[]) => ({
    type: ADD_TRENDS,
    info,
  });