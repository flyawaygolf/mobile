import React from "react";
import { View } from "react-native";
import { Divider } from "react-native-paper";

import { PostInterface } from "../../../Services/Client/Managers/Interfaces";
import styles, { full_width } from "../../../Style/style";
import { useClient } from "../../Container";
import { Avatar, Username } from "../../Member";
import { Markdown } from "../../Text";

type SectionProps = {
    attached_post: PostInterface.postResponseSchema
}

export default function DisplayAttachedPost({ attached_post }: SectionProps) {

    const { client, token } = useClient();
    
    return (
        <View>
            <View style={[styles.row, { width: full_width, padding: 5 }]}>
                <Avatar size={45} url={client.user.avatar(attached_post.from.user_id, attached_post.from.avatar)} />
                <View style={[styles.column, { justifyContent: "flex-start", alignItems: "flex-start" }]}>
                    <Username created_at={attached_post.created_at} user={attached_post.from} lefComponent={undefined} />
                </View>
            </View>
            <View style={{ padding: 5 }}>
                <Markdown token={token} content={attached_post.content} />
            </View>
            <Divider horizontalInset bold={true} />
        </View>
    )
}