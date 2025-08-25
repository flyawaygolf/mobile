import React, { useContext } from "react";
import { View } from "react-native";

import { SinglePostContext } from "../PostContext";
import DisplayEvent from "./Components/DisplayEvent";
import Postbottom from "./Components/Postbottom/index";
import Postheader from "./Components/Postheader";
import Markdown from "../../Text/Markdown";

function PostEvent() {

    const { info } = useContext(SinglePostContext);

    return (
        <View>
            <Postheader info={info.from} post_id={info.post_id} created_at={info.created_at} />
            <View style={{ padding: 5 }}><Markdown content={info.content} /></View>
            { info.event_info && <DisplayEvent event={info.event_info} />}
            <Postbottom />
        </View>
    )
}

export default PostEvent;