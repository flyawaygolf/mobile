import type { requestResponseInterface, userInfo } from "./Global";
import { golfInterface } from "./Search";

export interface eventsInterface {
    event_id: string;
    owner_info: userInfo;
    golf_info: golfInterface;
    participants: number;
    joined: boolean;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    favorites: boolean;
    max_participants: number;
    min_hancicap?: number;
    max_handicap?: number;
    greenfee: number;
    is_private: boolean;
    players: string[];
    guild_id: string;
    deleted: boolean;
    created_at: string;
    joinable: boolean;
}

export interface postEventInterface {
    event_id: string;
    startDate: Date;
    endDate: Date;
    deleted: boolean;
}

export interface eventResponse extends requestResponseInterface<eventsInterface> {}

export interface multipleEventsResponse extends requestResponseInterface<eventsInterface[]> {}

export interface eventsCreatorResponse extends requestResponseInterface<{
    event_id: string;
}> {}

export interface eventsCreatorParams {
    title: string;
    description: string;
    start_date: string | Date;
    end_date: string | Date;
    golf_id: string;
    max_participants: number;
    min_handicap?: number;
    max_handicap?: number;
    players?: string[];
    greenfee: number;
    is_private: boolean;
    favorites?: boolean;
}

export interface eventsUpdateParams {
    favorites?: boolean;
    deleted?: boolean;
}

export interface participantsResponse extends requestResponseInterface<userInfo[]> {}