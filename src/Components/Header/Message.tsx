import React from "react";
import { Appbar } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import styles from '../../Style/style';
import { navigationProps } from '../../Services';

const MessageHeader = () => {

    const navigation = useNavigation<navigationProps>();

    return (
        <View style={[styles.row, { justifyContent: "flex-end" }]}>
            <Appbar.Action onPress={() => navigation.navigate("MessagesStack", {
                screen: "CreateGroupScreen",
            })} icon="plus-circle" />
        </View>
    )
}

export default MessageHeader;
