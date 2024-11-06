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
    golf_id: string,
    name: string,
    email: string,
    country: string,
    city: string,
    continent: string,
    location: {
        latitude: number;
        longitude: number
    },
    distance?: number
}

export interface searchAllMap extends requestResponseInterface<{
    query: searchResponseQuery;
    users: itemsInterface<userInfo>;
    golfs: itemsInterface<golfInterface>;
}> {}

export interface searchUsersMap extends requestResponseInterface<{
    query: searchResponseQuery;
    users: itemsInterface<userInfo>;
}> {}

export interface searchGolfsMap extends requestResponseInterface<{
    query: searchResponseQuery;
    golfs: itemsInterface<golfInterface>;
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
