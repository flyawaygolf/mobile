import { userInfo } from "./Global";

export interface fetchGolfUsers {
    error?: {
        message: string,
        code: number
    },
    data?: userInfo[],
    pagination_key?: string
}