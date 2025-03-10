import { eventsInterface } from "./Events";
import type { requestResponseInterface, userInfo } from "./Global";

export interface itemsInterface<T extends Record<string, any>> {
    items_length: number;
    items: Array<T>;
}

export interface searchResponseQuery {
    qery?: string;
    longitude?: number;
    latiture?: number;
    max_distance?: number;
}

export interface golfInterface {
    golf_id: string;
    name: string;
    slug: string;
    email: string;
    country: string;
    city: string;
    continent: string;
    content?: string;
    website?: string;
    phone?: string;
    yearBuilt?: number;
    architect?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    scorecards?: {
        scorecard_id: string;
        name: string;
        holesCount: number;
        grid: {
            grid_id: string;
            par: number[];
            handicap: number[];
            teeboxType: string;
            teeboxes: {
                name: string;
                slope: number;
                rating: number;
                color: {
                    hex: string;
                    name: string;
                };
                distances: number[];
            }[];
        }[];
    }[];
    golfTypes?: number[];
    holes?: number;
    latitude: number;
    longitude: number;
    linked: boolean;
    distance?: number;
}

export interface fetchGolfResponse extends requestResponseInterface<golfInterface> {}

export interface fetchMultipleGolfResponse {
    error?: {
        message: string,
        code: number
    },
    data?: golfInterface[],
    pagination_key?: string
}

export interface searchAllMap extends requestResponseInterface<{
    query: searchResponseQuery;
    users: itemsInterface<userInfo>;
    golfs: itemsInterface<golfInterface>;
    // events: itemsInterface<eventsInterface>;
}> {}

export interface searchUsersMap extends requestResponseInterface<{
    query: searchResponseQuery;
    users: itemsInterface<userInfo>;
}> {}

export interface searchGolfsMap extends requestResponseInterface<{
    query: searchResponseQuery;
    golfs: itemsInterface<golfInterface>;
}> {}

export interface searchEventsMap extends requestResponseInterface<{
    query: searchResponseQuery;
    events: itemsInterface<eventsInterface>;
}> {}

export interface searchAll extends requestResponseInterface<{
    query: searchResponseQuery;
    result: itemsInterface<userInfo | golfInterface>;
}> {}

export interface searchUsers extends requestResponseInterface<{
    query: searchResponseQuery;
    users: itemsInterface<userInfo>;
}> {}

export interface searchGolfs extends requestResponseInterface<{
    query: searchResponseQuery;
    golfs: itemsInterface<golfInterface>;
}> {}

export interface searchEvents extends requestResponseInterface<{
    query: searchResponseQuery;
    events: itemsInterface<eventsInterface>;
}> {}