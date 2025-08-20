import { userInfo } from "./Global";

export interface scorecardTeeboxInterface {
    teebox_id: string;
    name: string;
    slope: number;
    rating: number;
    color: {
        hex: string;
        name: string;
    };
    distances: number[];
}

export interface scorecardGridInterface {
    grid_id: string;
    par: number[];
    handicap: number[];
    teeboxType: string;
    teeboxes: scorecardTeeboxInterface[];
}

export interface scoreCardInterface {
    scorecard_id: string;
    name: string;
    holesCount: number;
    grid: scorecardGridInterface[];
}

export interface golfInterface {
    golf_id: string;
    name: string;
    slug: string;
    email: string;
    country: string;
    city: string;
    street: string;
    address?: string;
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
    scorecards?: scoreCardInterface[];
    played?: boolean;
    golfTypes?: number[];
    holes?: number;
    latitude: number;
    longitude: number;
    linked: boolean;
    official_account?: userInfo;
    distance?: number;
}

export interface fetchGolfUsers {
    error?: {
        message: string,
        code: number
    },
    data?: userInfo[],
    pagination_key?: string
}

export interface fetchPlayedGolfResponse {
    error?: {
        message: string,
        code: number
    },
    data?: {
        golfs: golfInterface[];
        total: number;
        played: number;
    },
    pagination_key?: string
}