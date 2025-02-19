import type { ISO_639_CODE_LIST } from "../../utils/ISO-369-1";
import type { error, userInfo } from "./Global";
import type { postTypes } from "./Post";

export interface exploreRecentTrendsParams {
    pagination_key?: string,
    limit?: number,
    type?: postTypes,
    query?: string,
    locale?: ISO_639_CODE_LIST | "all"
    translateTo?: string;
}

export interface exploreUsersParams {
    pagination_key?: string;
    limit?: number;
    locale?: ISO_639_CODE_LIST | "all";
}

export interface exploreBestUserResponse {
    error?: error,
    data?: Array<userInfo>;
    pagination_key?: string;
}


export interface exploreRandomUserResponse {
    error?: error,
    data?: Array<userInfo>;
}
