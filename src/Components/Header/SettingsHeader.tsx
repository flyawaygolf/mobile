import React from "react";
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import styles, { full_width } from '../../Style/style';
import { useNavigation } from "../Container";

type SectionProps = React.FC<{
    isHome?: boolean,
    title?: JSX.Element | string,
    leftComponent?: JSX.Element,
    children?: JSX.Element
}>

const SettingsHeader: SectionProps = ({ title, leftComponent, children }) => {

    const navigation = useNavigation();

    return (
        <Appbar.Header style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
                {navigation?.canGoBack() && <Appbar.BackAction onPress={() => navigation.goBack()} />}
                {title && <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{title}</Text>}
            </View>
            {children && children}
            {
                leftComponent ? leftComponent : (
                    <View style={[styles.row, { justifyContent: "flex-end" }]}>
                        {
                            // <Appbar.Action icon="qrcode-scan" />
                        }

                    </View>
                )
            }
        </Appbar.Header>
    )
}

export default SettingsHeader;
