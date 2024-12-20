import React, { useContext } from "react";
import { View } from "react-native";
import { useClient } from "../../Container";
import { SinglePostContext } from "../PostContext";
import Postheader from "./Components/Postheader";
import { Markdown } from "../../Text";
import VideoPlayer from "./Components/VideoPlayer";
import Postbottom from "./Components/Postbottom";



function PostVideo() {

    const { info } = useContext(SinglePostContext)
    const { client } = useClient()

    return (
        <View>
            <Postheader info={info.from} post_id={info.post_id} created_at={info.created_at} />
            <View style={{ padding: 5 }}><Markdown content={info.content} /></View>
            <VideoPlayer thumbnail={""} attachments={info.attachments[0]} uri={`${client.posts.file(info.from.user_id, info.post_id, info.attachments[0]?.name)}`} />
            <Postbottom />
        </View>
    )
}

export default PostVideo;