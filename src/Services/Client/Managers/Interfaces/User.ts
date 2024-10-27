import type { error, premium_type } from "./Global";

export interface userInfo {
    user_id: string;
    username: string;
    nickname: string;
    description?: string;
    premium_type: premium_type;
    avatar: string;
    banner?: string;
    link?: string;
    accent_color: string;
    flags: number;
    is_private: boolean;
    allow_dm: boolean;
    pined_post?: string;
    created_at: Date;
    trust_factor: number;
    certified: boolean;
}

export interface profileInformationsInterface {
    username: string;
    nickname: string;
    accent_color: string;
    locale: string;
    certified: boolean;
    flags: number;
    is_private: boolean;
    allow_dm: boolean;
    premium_type: number;
    created_at: string;
    user_id: string;
    description?: string;
    avatar: string;
    banner?: string;
    pined_post?: string;
    follow_back: boolean;
    followed: boolean;
    link?: string
    subscriptions: number;
    subscribers: number;
    custom_subscription: string | false;
    pay_custom_subscription: boolean;
    total_posts: number;
}

export interface profileInformations {
    error?: error;
    data?: profileInformationsInterface;
}