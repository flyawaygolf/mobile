import React from "react";
import { NativeSyntheticEvent, TextLayoutEventData } from "react-native";

import MarkdownRenderer from "./PremiumMarkdown";

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void,
}>

const Renderer: SectionProps = ({ content }) => {

    if (typeof content === "undefined") return null;
    if (content.length === 0) return null;

    return <MarkdownRenderer content={content} />
}

export default Renderer;