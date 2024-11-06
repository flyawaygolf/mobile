import type { error } from "./Global"

export interface blockUserInformations {
    user_id: string,
    avatar: string,
    username: string,
    nickname: string,
    created_at: Date
}

export interface blockUserReponse {
    error?: error,
    data: Array<blockUserInformations>
}
