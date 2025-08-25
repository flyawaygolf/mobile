import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

import { navigationProps } from '../../Services';
import styles from '../../Style/style';

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
