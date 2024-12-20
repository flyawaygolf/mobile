import React, { useContext } from "react";
import { View } from "react-native";
import { SinglePostContext } from "../PostContext";
import Postbottom from "./Components/Postbottom/index";
import Postheader from "./Components/Postheader";
import Carroussel from "./Components/Carroussel";
import Markdown from "../../Text/Markdown";

function PostImage() {

    const { info } = useContext(SinglePostContext);

    return (
        <View>
            <Postheader info={info.from} post_id={info.post_id} created_at={info.created_at} />
            <View style={{ padding: 5 }}><Markdown content={info.content} /></View>
            <Carroussel pictures={info.attachments} />
            <Postbottom />
        </View>
    )
}

export default PostImage;