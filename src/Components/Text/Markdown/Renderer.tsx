import React from "react";
import { Text } from "react-native-paper";

import { emojies_defs } from "./emojis";
import { NativeSyntheticEvent, TextLayoutEventData } from "react-native";
import { useTheme } from "../../Container";
import { openURL } from "../../../Services/WebView";

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void,
}>

const RE_TWEMOJI = /:(\w+):/gi;

export const RE_LINKS = /(https?:\/\/[^\s]+)/gi;

const Renderer: SectionProps = ({ content, noBr, onTextLayout }) => {

    if (typeof content === "undefined") return null;
    if (content.length === 0) return null;

    const { colors } = useTheme();

    const enter = content.split("\n");
    
    return (
        <Text onTextLayout={onTextLayout}>
            {
                enter.map((text, idx) =>
                    <Text key={idx}>{noBr && "\n"}{text.trim().split(" ").map((text, idx) => {

                        if (RE_LINKS.test(text)) return <Text key={idx} onPress={() => openURL(text)} style={{ color: colors.text_link }}>{text.length > 50 ? `${text.substring(0, 45)}...` : text} </Text>
                        if (RE_TWEMOJI.test(text)) {
                            const sub = text.replace(/:/g, "")
                            if (!sub) return <Text key={idx} >{text} </Text>
                            return <Text key={idx} >{emojies_defs[sub]} </Text>
                        }
                        return <Text key={idx}>{text} </Text>
                    })}</Text>
                )
            }
        </Text>
    )
}

export default Renderer;