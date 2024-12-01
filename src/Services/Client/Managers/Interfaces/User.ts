import type { error, requestResponseInterface, userInfo } from "./Global";

export interface fetchUserResponse extends requestResponseInterface<userInfo> {}

export interface profileInformationsInterface extends userInfo {
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
