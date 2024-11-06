import React, { Suspense, lazy } from "react";
import { Text } from "react-native-paper";
import { StyleProp, TextStyle } from "react-native";
const Renderer = lazy(() => import("./Markdown/Renderer"));

type SectionProps = React.FC<{
    content: string,
    noBr?: boolean,
    style?: StyleProp<TextStyle>
}>

const Markdown: SectionProps = ({ content, noBr, style }) => {

    return (
            <Text style={[style, { fontSize: 15 }]} onPress={undefined} selectable={true}>
                <Suspense fallback={content}>
                    <Renderer noBr={noBr ? false : true} content={`${content.slice(0, 150).trim()}`} />
                </Suspense>
            </Text>
    );
}

export default Markdown;
