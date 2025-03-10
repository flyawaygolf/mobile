import type { requestResponseInterface, userInfo } from "./Global"

export interface affiliationFetchSchema {
    affiliate_to?: userInfo;
    affiliate_number: number;
}

export type affiliationCreateResponse = requestResponseInterface<userInfo>

export type affiliationFetchResponse = requestResponseInterface<affiliationFetchSchema>