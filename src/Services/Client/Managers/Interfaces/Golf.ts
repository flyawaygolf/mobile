import { userInfo } from "./Global";

export interface scorecardTeeboxInterface {
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