import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";

type PropsType = {
    text: string;
    onPress: () => any;
}

function LinkButtonText({ text, onPress }: PropsType) {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => onPress()}>
            <Text style={{
                paddingVertical: 10,
                fontSize: 16,
                textDecorationLine: "underline",
            }}>{text}</Text>
        </TouchableOpacity>
    )
}

export default LinkButtonText;
