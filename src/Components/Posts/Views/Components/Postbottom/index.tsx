import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { TextStyle, View, ViewStyle } from 'react-native';
import { IconButton, Text } from "react-native-paper";

import BookmarkButton from "./BookmarkButton";
import LikeButton from "./LikeButton";
import { navigationProps } from "../../../../../Services";
import styles from "../../../../../Style/style";
import { useTheme } from "../../../../Container";
import { SinglePostContext } from "../../../PostContext";

function Postbottom() {

    const { info } = useContext(SinglePostContext);
    const navigation = useNavigation<navigationProps>();
    const { colors } = useTheme();

    const buttonStyle: ViewStyle = {
        ...styles.row
    }

    const textStyle: TextStyle = {
        color: colors.text_muted
    }

    return (
        <View>
            <View style={[styles.row, { justifyContent: "space-evenly" }]}>
                <View style={buttonStyle}>
                    <IconButton onPress={() => navigation?.navigate("CreateStack", {
                        screen: "PostCreatorScreen",
                        params: {
                            attached_post: info,
                            initFiles: [],
                            initContent: ""
                        }
                    })} icon="comment-multiple" />
                    <Text style={textStyle}>{info?.comments ?? 0}</Text>
                </View>
                <View style={buttonStyle}>
                    <IconButton onPress={() => navigation?.navigate("CreateStack", {
                        screen: "PostCreatorScreen",
                        params: {
                            shared_post: info,
                            initFiles: [],
                            initContent: ""
                        }
                    }) as any} icon="share" />
                    <Text style={textStyle} onPress={() => navigation?.navigate("PostsStack", {
                        screen: "PostScreenShares",
                        params: {
                            post_id: info.post_id
                        }
                    })}>{info?.shares ?? 0}</Text>
                </View>
                <View style={buttonStyle}>
                    <LikeButton />
                    <Text style={textStyle}>{info?.likes ?? 0}</Text>
                </View>
                <View style={buttonStyle}>
                    <BookmarkButton />
                    <Text style={textStyle}>{info?.bookmarks ?? 0}</Text>
                </View>
                <View style={buttonStyle}>
                    <IconButton icon="eye" />
                    <Text style={textStyle}>{info?.views ?? 1}</Text>
                </View>
            </View>
        </View>
    )
}

export default Postbottom;