import type { error, notificationTypeInterface, userInfo } from "./Global";
import type { postResponseSchema } from "./Post";

export interface notificationFetchResponseSchema {
    user_id: string,
    target_id: string,
    post_id: string,
    notification_type: notificationTypeInterface,
    notification_id: string,
    created_at: Date,
    readed?: boolean,
    post: postResponseSchema,
    from: userInfo,
    mentions: userInfo[] | []
}

export interface notificationFetchResponse {
    error?: error,
    data?: Array<notificationFetchResponseSchema>,
    pagination_key?: string
}
