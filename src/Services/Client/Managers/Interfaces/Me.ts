import type { attachments, error, gender, player_status, premium_type } from "./Global";
import type { ISO_639_CODE_LIST } from "../../utils/ISO-369-1";

export interface AvailabilitySlot {
    id: number;
    available: boolean;
    start: Date;
    end: Date;
}

export interface myInformationInterface {
    user_id: string,
    nickname: string,
    username: string;
    premium_type: premium_type,
    gender: gender;
    flags: number;
    avatar: 'base1.png' | 'base2.png' | string;
    banner?: string;
    token: string,
    locale: ISO_639_CODE_LIST
    language_spoken?: Array<ISO_639_CODE_LIST>,
    session_id: string;
    accent_color?: string;
    description?: string;
    link?: string;
    certified?: boolean;
    is_private: boolean;
    allow_dm: boolean;
    pined_post?: string;
    trust_factor?: number;
    banned: boolean;
    activated: boolean;
    birthday: Date;
    premium_settings?: {
        locked_location?: {
            latitude: number;
            longitude: number;
        },
        show_availability?: boolean;
        show_locked_location?: boolean;
        availability?: AvailabilitySlot[]
    },
    golf_info: {
        handicap: number;
        player_status: player_status;
        location: {
            latitude: number;
            longitude: number;
        }; // [longitude, latitude]
    },
    linked_golf_id?: string;
    linked_golf?: {
        golf_id: string;
        name: string;
        slug: string;
    };
}

export interface myInformations {
    error?: error,
    data?: myInformationInterface
}

export interface editInformationsParams {
    nickname?: string,
    username?: string,
    description?: string,
    is_private?: boolean,
    allow_dm?: boolean,
    link?: string,
    avatar?: attachments,
    banner?: attachments,
    locale?: ISO_639_CODE_LIST,
    language_spoken?: Array<string>,
    nsfw_filter?: boolean
}

export interface editInformationsResponseInterface {
    is_private?: boolean,
    allow_dm?: boolean,
    description?: string,
    nickname?: string,
    username?: string,
    avatar?: string,
    accent_color?: string,
    banner?: string,
    locale?: ISO_639_CODE_LIST,
    language_spoken?: Array<string>,
    nsfw_filter?: boolean
}

export interface editInformationsResponse {
    error?: error,
    data?: editInformationsResponseInterface
}