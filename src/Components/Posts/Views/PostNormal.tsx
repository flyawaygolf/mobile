import React, { useContext } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import Carroussel from "./Components/Carroussel";
import VideoPlayer from "./Components/VideoPlayer";
import { useClient, useTheme } from "../../Container";
import { useTranslation } from "react-i18next";
import DisplayEmbed from "./Components/DisplayEmbed";
import Markdown from "../../Text/Markdown";
import { SinglePostContext } from "../PostContext";
import { PostInterface } from "../../../Services/Client/Managers/Interfaces/index";
import DisplayEvent from "./Components/DisplayEvent";

export type PostNormalContextInfo = PostInterface.postResponseSchema & {
    is_comment?: boolean;
    is_share?: boolean;
    no_bottom?: boolean;
    original_post_user?: any
}

type PostNormalContext = {
    info: PostNormalContextInfo
}

function PostNormal({ maxLines }: { maxLines?: number }) {

    const { info }: PostNormalContext = useContext(SinglePostContext);
    const { client, token } = useClient();
    const { t, i18n } = useTranslation();
    const { colors } = useTheme();

    const enableTranslation = (text_lang: string) => {
        if (i18n.language.startsWith(text_lang.toLocaleLowerCase())) return undefined;
        return i18n.language;
    }

    return (
        <>
            <View style={{ paddingLeft: 15 }}>
                {info?.original_post_user && <Text variant="labelMedium" style={{ color: colors.text_muted }} >{t("posts.reply_to", { username: info.original_post_user.username })}</Text>}
                {
                    info.display_not_allowed ?
                        <Button onPress={() => { }}>{t("posts.subscribe_to", { username: info.from.username })}</Button>
                        : <View style={{ marginTop: -15 }}><Markdown translate={info.content_language ? enableTranslation(info.content_language) : undefined} postInfo={info} maxLine={maxLines} token={token} content={info.content} /></View>
                }
            </View>
            {
                info.event_info && <DisplayEvent event={info.event_info} />
            }
            <View style={{
                marginTop: 5,
                borderRadius: 10,
                width: "100%",
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
                {
                    info?.type ?
                        info.type === 1 ?
                            <Carroussel pictures={info.attachments} creator={undefined} changeList={undefined} />
                            : info.type === 2 ?
                                <VideoPlayer
                                    thumbnail={info.attachments[0]?.thumbnail ? client.posts.file(info.from.user_id, info.post_id, info.attachments[0]?.thumbnail) : undefined}
                                    uri={client.posts.file(info.from.user_id, info.post_id, encodeURIComponent(info.attachments[0]?.name))} attachments={undefined} />
                                : null : info.embeds?.length > 0 ? <DisplayEmbed embed={info.embeds[0]} /> : null
                }
            </View>
        </>
    )
}

export default PostNormal;