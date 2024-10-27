import type { error } from "./Global";

export interface followInformations {
    error?: error;
}

export interface followInformationsResponse {
    follow_id: string;
    flags: number;
    user_id: string;
    target_id: string;
    created_at: Date;
    description?: string;
    accepted: boolean;
    nickname: string;
    username: string;
    avatar: string;
    is_private: boolean;
    verified: boolean;
}

export interface followListInformations {
    error?: error;
    data?: Array<followInformationsResponse>;
    pagination_key?: string;
}
