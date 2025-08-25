
import { ADD_GOLFS_PLAYED, DELETE_GOLFS_PLAYED, INIT_GOLFS_PLAYED, RESET_GOLFS_PLAYED } from "./actionTypes";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Golf";

export const resetGolfsPlayed = (info: []) => ({
    type: RESET_GOLFS_PLAYED,
    info,
});

export const addGolfsPlayed = (info: golfInterface[]) => ({
    type: ADD_GOLFS_PLAYED,
    info,
  });

export const initGolfsPlayed = (info: golfInterface[]) => ({
    type: INIT_GOLFS_PLAYED,
    info,
});

export const deleteGolfsPlayed = (info: string) => ({
    type: DELETE_GOLFS_PLAYED,
    info
})