import { useNavigation } from "@react-navigation/native";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Search";
import { DisplayGolfs } from "../Golfs";
import { handleToast, navigationProps } from "../../Services";
import { useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { useClient } from "../Container";
import { Text } from "react-native-paper";

type SectionProps = {
    user_id: string;
}

const ProfileGolfsList = ({ user_id }: SectionProps) => {
    const navigation = useNavigation<navigationProps>();
    const { client } = useClient();
    const { t } = useTranslation();
    const [golfs, setGolfs] = useState<golfInterface[]>([]);
    const [paginationKey, setPaginationKey] = useState<string | undefined>(undefined);

    const getGolfs = async () => {
        const response = await client.golfs.link.golfs(user_id, { pagination: { pagination_key: paginationKey } });
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        if (golfs.length > 0) setGolfs([...golfs, ...response.data]);
        setGolfs(response.data);
    };

    const renderItem = useCallback(({ item }: { item: golfInterface }) => (
        <DisplayGolfs
            onPress={() => navigation.navigate("GolfsStack", {
                screen: "GolfsProfileScreen",
                params: {
                    golf_id: item.golf_id,
                }
            })}
            informations={item} />
    ), []);

    const memoizedValue = useMemo(() => renderItem, [golfs]);

    return (
        <FlatList
            data={golfs}
            keyExtractor={(item) => item.golf_id}
            renderItem={memoizedValue}
            onScrollEndDrag={() => getGolfs()}
            ListEmptyComponent={<Text style={{ textAlign: "center" }}>{t("profile.no_linked_golfs")}</Text>}
        />
    );
}

export default ProfileGolfsList;