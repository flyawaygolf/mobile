import React, { PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import { useTheme } from "../Components/Container";

type SectionProps = PropsWithChildren<{
    noDivider?: boolean,
    onPress?: () => any
}>

function ModalSection({ onPress, noDivider , children }: SectionProps) {

    const { colors } = useTheme();

    return (
        <>
            <TouchableOpacity onPress={() => onPress && onPress()} style={styles.modal}>
                { children }
            </TouchableOpacity>
            { noDivider ? null : <Divider style={{ borderWidth: 0.25, borderColor: colors.bg_primary }} /> }
        </>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        padding: 10,
        gap: 5
    },
})

export default ModalSection;
