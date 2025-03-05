import { useTranslation } from "react-i18next";
import { ScreenContainer, useClient } from "../../Components/Container";
import { Text } from "react-native-paper";
import { SearchBar } from "../../Components/Elements/Input";
import { FlatList, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleToast, navigationProps } from "../../Services";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Search";
import { useNavigation } from "@react-navigation/native";
import { DisplayGolfs } from "../../Components/Golfs";

const ScorecardHomeScreen = () => {
    const { client, user, setValue, location } = useClient();
    const allClient = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();
    const [search, setSearch] = useState<string>("");
    const [golfs, setGolfs] = useState<golfInterface[]>([]);

    const start = async () => {
        await Promise.all([
            updateMapGolfs(location.longitude, location.latitude),
            updateUserLocation(location.longitude, location.latitude, false)
        ]);
    }

    const searchGolfs = async (long = location?.longitude, lat = location?.latitude) => {
        const response = await client.search.golfs(search, {
            location: {
                long: long ?? 48.864716,
                lat: lat ?? 2.349014,
            }
        })
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setGolfs(response.data.golfs.items);
    }

    const updateUserLocation = async (long = location?.longitude, lat = location?.latitude, toast = true) => {
        const request = await client.user.editLocation([long ?? 48.864716, lat ?? 2.349014]);
        if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
        setValue({ ...allClient, user: { ...user, golf_info: { ...user.golf_info, location: [long, lat] } } });
        return toast && handleToast(t(`commons.success`));
    }

    const updateMapGolfs = async (long = location?.longitude, lat = location?.latitude) => {
        const request = await client.search.map.golfs({
            long: long ?? 48.864716,
            lat: lat ?? 2.349014,
            max_distance: 50000,
        })
        if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
        return setGolfs(request.data.golfs.items);
    }

    useEffect(() => {
        start();
    }, []);

    useEffect(() => {
        if (search.length > 2) searchGolfs();
        else updateMapGolfs();
    }, [search]);

    const ListEmptyComponent = useMemo(() => <Text>{t("map.no_results", { query: search })}</Text>, [t]);


    const renderItem = useCallback(({ item }: { item: golfInterface }) => {

        return (
            <DisplayGolfs
                onPress={() => navigation.navigate("GolfsStack", {
                    screen: "GolfsProfileScreen",
                    params: {
                        golf_id: item.golf_id,
                    }
                })}
                informations={item}
            />
        );
    }, [navigation]);

    return (
        <ScreenContainer>
            <View style={{ padding: 5 }}>
                <SearchBar
                    onClearPress={() => setSearch("")}
                    onSearchPress={() => { }}
                    value={search}
                    onChangeText={(txt) => setSearch(txt)}
                />
            </View>
            <FlatList
                ListEmptyComponent={ListEmptyComponent}
                data={golfs}
                keyExtractor={(item) => item.golf_id}
                renderItem={renderItem}
            />
        </ScreenContainer>
    );
};

export default ScorecardHomeScreen;