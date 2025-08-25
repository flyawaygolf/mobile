import { useNavigation } from "@react-navigation/native";
import React, { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";

import SafeBottomContainer from "./SafeBottomContainer";
import { navigationProps } from "../../Services";
import styles, { full_width } from "../../Style/style";

type SectionProps = PropsWithChildren<{
    title: string;
}>;

const PostContainer = ({ children, title }: SectionProps) => {

    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();

    return (
        <SafeBottomContainer padding={{
            top: 0,
            bottom: 5,
            left: 0,
            right: 0
        }}>
            <Appbar.Header style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
                <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    { navigation.canGoBack() && <Appbar.BackAction onPress={() => navigation.goBack()} /> }
                    {title && <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{t(`${title}`)}</Text>}
                </View>
            </Appbar.Header>
            {children}
        </SafeBottomContainer>
    )
};

export default PostContainer;