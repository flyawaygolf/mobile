import type { attachments, error, gender, player_status, premium_type } from "./Global";
import type { ISO_639_CODE_LIST } from "../../utils/ISO-369-1";

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
    golf_info: {
        handicap: number;
        player_status: player_status;
        location: [number, number]; // [longitude, latitude]
    }
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
