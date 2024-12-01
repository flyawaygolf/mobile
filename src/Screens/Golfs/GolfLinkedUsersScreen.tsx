import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import { Loader } from "../../Other";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global.js";
import DisplayMember from "../../Components/Member/DisplayMember";
import { useNavigation, useTheme } from "../../Components/Container/index";

type SectionProps = React.FC<{
    users: userInfo[];
}>;

const GolfLinkedUsersScreen: SectionProps = ({ users }): JSX.Element => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();

    const renderItem = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember onPress={() => navigation.navigate("ProfileScreen", { user_id: item.user_id })} informations={item} />
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
