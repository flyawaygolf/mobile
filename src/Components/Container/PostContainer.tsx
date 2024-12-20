import React, { PropsWithChildren } from "react";

import { View } from "react-native";
import useTheme from "./Theme/useTheme";
import { useTranslation } from "react-i18next";
import { Appbar, Text } from "react-native-paper";
import styles, { full_width } from "../../Style/style";
import { useNavigation } from "@react-navigation/native";
import { navigationProps } from "../../Services";

type SectionProps = PropsWithChildren<{
    title: string;
}>;

const PostContainer = ({ children, title }: SectionProps) => {

    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
                <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    { navigation.canGoBack() && <Appbar.BackAction onPress={() => navigation.goBack()} /> }
                    {title && <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{t(`${title}`)}</Text>}
                </View>
            </Appbar.Header>
            {children}
        </View>
    )
};

export default PostContainer;