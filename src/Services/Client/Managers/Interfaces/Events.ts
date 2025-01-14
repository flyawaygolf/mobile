import type { requestResponseInterface, userInfo } from "./Global";
import { golfInterface } from "./Search";

export interface enventsInterface {
    event_id: string;
    owner_info: userInfo;
    golf_info: golfInterface;
    title: string;
    description: string;
    expire_at: string;
    favorites: number;
    handicap: number;
    guild_id: string;
    deleted: boolean;
}

export interface eventsResponse extends requestResponseInterface<enventsInterface[]> {}