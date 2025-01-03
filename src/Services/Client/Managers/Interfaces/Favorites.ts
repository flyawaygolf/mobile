import { requestResponseInterface, userInfo } from "./Global";

export interface favoritesInterface {
    user_id: string,
    target_id: string,
    favorite_id: string,
    created_at: string,
    user_info: userInfo
}

export interface favoritesResponseInterface extends requestResponseInterface<favoritesInterface[]> {} 