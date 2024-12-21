import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";

import { Loader } from "../../Other";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import DisplayMember from "../../Components/Member/DisplayMember";
import { navigationProps } from "../../Services/navigationProps";
import { useNavigation } from "@react-navigation/native";

type SectionProps = React.FC<{
    users: userInfo[];
}>;

const GolfLinkedUsersScreen: SectionProps = ({ users }): JSX.Element => {
    const navigation = useNavigation<navigationProps>();

    const renderItem = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember onPress={() => navigation.navigate("ProfileStack", { screen: "ProfileScreen", params: { nickname: item.nickname } })} informations={item} />
    ), []);

    const memoizedValue = useMemo(() => renderItem, [users]);

    return (
        <FlatList

            data={users}
            keyExtractor={(item) => item.user_id}
            renderItem={memoizedValue}
            ListEmptyComponent={<Loader />}
        />
    );
};

export default GolfLinkedUsersScreen;
