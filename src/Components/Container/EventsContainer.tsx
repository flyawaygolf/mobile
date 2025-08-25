import React from 'react';
import { View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';

import SafeBottomContainer from './SafeBottomContainer';
import { navigationProps } from '../../Services';
import styles, { full_width } from '../../Style/style';



const EventsContainer = ({ children, title, navigation }: React.PropsWithChildren<{
    title: string;
    navigation: navigationProps;
}>) => {
    return (
        <SafeBottomContainer>
            <Appbar.Header style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
                <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{title}</Text>
                </View>
            </Appbar.Header>
            {children}
        </SafeBottomContainer>
    )
};

export default EventsContainer;