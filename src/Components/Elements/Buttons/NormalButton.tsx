import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "../../Container";

type PropsType = {
    text: string;
    onPress: () => any;
}

function NormalButton({ text, onPress }: PropsType) {

    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                borderRadius: 5,
                marginLeft: 35,
                marginRight: 35,
                padding: 5,
                marginTop: 20,
                marginBottom: 25,
                backgroundColor: colors.bg_secondary
            }}
            activeOpacity={0.5}
            onPress={() => onPress()}>
            <Text style={{
                paddingVertical: 10,
                fontSize: 16
            }}>{text}</Text>
        </TouchableOpacity>
    )
}

export default NormalButton;