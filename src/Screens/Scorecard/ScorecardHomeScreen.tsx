import { useTranslation } from "react-i18next";
import { ScreenContainer, useClient } from "../../Components/Container";
import { Text } from "react-native-paper";
import { SearchBar } from "../../Components/Elements/Input";
import { FlatList, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentLocation, handleToast, navigationProps } from "../../Services";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Search";
import { useNavigation } from "@react-navigation/native";
import { DisplayGolfs } from "../../Components/Golfs";
import { locationType } from "../../Components/Container/Client/ClientContext";

const ScorecardHomeScreen = () => {
    const { client, user, setValue, location: initLocation } = useClient();
    const allClient = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();
    const [search, setSearch] = useState<string>("");
    const [location, setLocation] = useState<locationType>(initLocation);
    const [golfs, setGolfs] = useState<golfInterface[]>([]);

    const start = async () => {
        try {
            const position = await getCurrentLocation();
            if (position) {
                const crd = position.coords;
                const init_location = {
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }
                setLocation(init_location);
                await updateMapGolfs(crd.longitude, crd.latitude);
                await updateUserLocation(crd.longitude, crd.latitude, false);
            }
        } catch (error) {
            const init_location = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            }
            setLocation(init_location);
            await updateMapGolfs();
        }
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