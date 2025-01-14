import type { error, userInfo } from "./Global";

export interface followInformations {
    error?: error;
}

export interface followInformationsResponse {
    follow_id: string;
    user_id: string;
    target_id: string;
    created_at: Date;
    accepted: boolean;
    user_info: userInfo;
}

export interface followListInformations {
    error?: error;
    data?: Array<followInformationsResponse>;
    pagination_key?: string;
}
