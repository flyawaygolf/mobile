import type { error, userInfo } from "./Global";

export interface followInformations {
    error?: error;
}

export interface followNotificationReponse {
    follow_id: string;
    user_id: string;
    target_id: string;
    created_at: Date;
    accepted: boolean;
    user_info: userInfo;
}

export interface followInformationsResponse {
    user_id: string;
    username: string;
    nickname: string;
    description: string;
    avatar: string;
    accent_color: string;
    flags: number;
    is_private: boolean;
    allow_dm: boolean;
    certified: boolean;
}

export interface followListInformations {
    error?: error;
    data?: Array<followInformationsResponse>;
    pagination_key?: string;
}
