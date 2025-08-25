import React, { useState } from "react";
import { View } from 'react-native';
import { Appbar } from 'react-native-paper';

import styles from '../../Style/style';
import { SearchBar } from "../Elements/Input";

const ExploreHeader = () => {

    const [searchQuery, setSearchQuery] = useState("");

    const searchRequest = () => {}

    return (
        <Appbar.Header style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <SearchBar
                onSearchPress={() => searchRequest()}
                onClearPress={() => setSearchQuery("")}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search"
            />
            <View style={[styles.row, { justifyContent: "flex-end" }]}>
                <Appbar.Action icon="filter-variant" />
            </View>
        </Appbar.Header>
    )
}

export default ExploreHeader;
