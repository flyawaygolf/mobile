import React, { LegacyRef } from "react";
import { IconButton } from "react-native-paper";
import { TextInputProps, TextInput, View, ViewStyle } from "react-native";

import { useTheme } from "../../Container";
import styles from "../../../Style/style";
import { ShrinkEffect } from "../../Effects";

type SectionProps = React.FC<{
    style?: ViewStyle | ViewStyle[];
    placeholder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
    label?: string;
    onClearPress: () => void;
    onSearchPress: () => void;
    inputProps?: TextInputProps,
    ref?: LegacyRef<TextInput>
}>

const SearchBar: SectionProps = ({ style, placeholder, onChangeText, value = "", onClearPress, onSearchPress, inputProps, ref }) => {

    const { colors } = useTheme();

    return (
        <ShrinkEffect>
            <View style={[{
                height: 40,
                width: "85%",
                borderRadius: 12,
                alignSelf: "center",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.bg_secondary,
                shadowColor: colors.bg_third,
                shadowRadius: 8,
                shadowOpacity: 0.3,
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
            }, style]}>
                <View style={[styles.row]}>
                    <IconButton size={18} onPress={onSearchPress} icon="magnify" />
                    <TextInput
                        ref={ref}
                        {...inputProps}
                        placeholderTextColor={colors.text_normal}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        value={value}
                        style={{
                            width: "75%",
                            color: colors.text_normal,
                        }}
                        keyboardType="web-search"
                        onSubmitEditing={onSearchPress}
                    />
                </View>
                <IconButton animated onPress={onClearPress} style={{ marginRight: 5, marginLeft: "auto" }} size={18} icon="close" />
            </View>
        </ShrinkEffect>
    )
}

export default SearchBar;
