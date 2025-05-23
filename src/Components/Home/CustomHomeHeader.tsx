import React from "react";
import { Appbar } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { full_width } from "../../Style/style";
import { Avatar } from "../Member";
import { navigationProps } from "../../Services";
import useClient from "../Container/Client/useClient";
import useTheme from "../Container/Theme/useTheme";
import { ShrinkEffect } from "../Effects";

type SectionProps = React.FC<{
    isHome?: boolean;
    title?: JSX.Element | string;
    leftComponent?: JSX.Element;
    children?: JSX.Element;
}>

const CustomHomeHeader: SectionProps = ({ leftComponent }) => {

    const navigation = useNavigation<navigationProps>();
    const { client, user } = useClient();
    const { colors } = useTheme();

    return (
        <Appbar.Header style={{ width: full_width, flexDirection: "row", alignContent: "center", justifyContent: "space-between", borderBottomColor: colors.bg_secondary, borderBottomWidth: 1 }}>
            <ShrinkEffect shrinkAmount={0.90} onPress={() => navigation.openDrawer()}>
                <Avatar marginLeft={5} url={client.user.avatar(user?.user_id, user?.avatar)} />
            </ShrinkEffect>
            {leftComponent && leftComponent}
        </Appbar.Header>
    )
}

export default CustomHomeHeader;