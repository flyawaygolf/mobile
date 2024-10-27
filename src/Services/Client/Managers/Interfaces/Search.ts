import type { error, userInfo } from "./Global"

export interface searchUsers {
    error?: error,
    data?: Array<userInfo>,
    pagination_key?: string
}