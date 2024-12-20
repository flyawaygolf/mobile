import type { error, userInfo } from "./Global"

export interface blockUserInformations extends userInfo {}

export interface blockUserReponse {
    error?: error,
    data: Array<blockUserInformations>
}
