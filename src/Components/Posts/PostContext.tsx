import React, { PropsWithChildren, useState } from "react";

import { postInterface } from "../../Services/Client/Managers/Interfaces/Post";

const defaultInfo: SinglePostInfoType = {
    post_id: "",
    content: "",
    content_language: "US",
    locale: "US",
    type: 0,
    attachments: [],
    embeds: [],
    mentions: [],
    categories: [],
    hashtags: [],
    created_at: "",
    from: {
        premium_type: 0,
        user_id: "",
        nickname: "",
        username: "",
        is_private: false,
        avatar: "",
        avatarURL: "",
        flags: 0,
        description: "",
        certified: false,
        banner: "",
        accent_color: "",
        allow_dm: false,
        link: "",
        locale: "US",
        language_spoken: [],
        golf_info: {
            handicap: 0,
            player_status: 0,
            location: {
                latitude: 0,
                longitude: 0
            }
        }
    },
    likes: 0,
    liked: false,
    shares: 0,
    comments: 0,
    views: 0,
    bookmarks: 0,
    bookmarked: false,
    display_not_allowed: false
}

export type SinglePostInfoType = postInterface & {
    is_comment?: boolean;
    is_share?: boolean;
    no_bottom?: boolean;
    original_post_user?: any;
}

export interface SinglePostContextType {
    info: SinglePostInfoType;
    setInfo: React.Dispatch<React.SetStateAction<SinglePostInfoType>>;
}

export const SinglePostContext = React.createContext<{
    info: SinglePostInfoType;
    setInfo: React.Dispatch<React.SetStateAction<SinglePostInfoType>>;
}>({
    info: defaultInfo,
    setInfo: () => { }
});

type SectionProps = PropsWithChildren<{
    informations?: postInterface & {
        is_comment?: boolean;
        is_share?: boolean;
        no_bottom?: boolean;
        original_post_user?: any;
    };
}>;

export const SinglePostContextProvider = ({ children, informations = defaultInfo }: SectionProps) => {

    const [info, setInfo] = useState(informations)

    return (
        <SinglePostContext.Provider value={{ info, setInfo }}>
            {children}
        </SinglePostContext.Provider>
    )
}