import React from "react";
import { Appbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import styles from '../../Style/style';
import { navigationProps } from '../../Services';

const MessageHeader = () => {

    const navigation = useNavigation<navigationProps>();

    return (
        <Appbar.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {
                /**
                 *             <SearchBar
                onSearchPress={() => searchRequest()}
                onClearPress={() => setSearchQuery("")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
            />
                 */
            }
            <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>Messages</Text>
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
                <Appbar.Action onPress={() => navigation?.navigate("MessagesStack", {
                    screen: "CreateGroupScreen",
                })} icon="plus-circle" />
            </View>
        </Appbar.Header>
    )
}

export default MessageHeader;
