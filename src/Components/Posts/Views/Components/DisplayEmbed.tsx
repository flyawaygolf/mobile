import React from "react";
import { Text, Card } from "react-native-paper";

import { openURL } from "../../../../Services";
import { embeds } from "../../../../Services/Client/Managers/Interfaces/Global";

type displayEmbedType = {
    embed: embeds
}

export default function DisplayEmbed({ embed }: displayEmbedType) {

    return (
        <Card onPress={() => openURL(embed.url)} style={{ width: "90%" }}>
            {
                embed.icon_url && <Card.Cover style={{ margin: 10 }} source={{ uri: embed.icon_url }} />
            }
            <Card.Title title={embed.title}  subtitle={embed.description} />
            <Card.Content>
                <Text variant="labelSmall">{`${embed?.url?.substring(0, 60)}...`}</Text>
            </Card.Content>
        </Card>
    )
}