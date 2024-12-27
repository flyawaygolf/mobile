import { useEffect, useState } from "react";
import { View, Platform, FlatList } from "react-native";
import { IconButton, Text } from "react-native-paper";

import styles from "../../../Style/style";
import { useClient, useTheme } from "../../Container";
import { postOptions } from "../../../Screens/CreatePost/PostCreatorScreenStack";
import { golfInterface } from "../../../Services/Client/Managers/Interfaces/Search";
import { BottomModal } from "../../../Other";
import { SearchBar } from "../../Elements/Input";
import { DisplayGolfs } from "../../Golfs";
import { use } from "i18next";
import { getCurrentLocation, handleToast } from "../../../Services";
import { useTranslation } from "react-i18next";

type PropsType = {
    addFiles: (target: "photo" | "video") => any,
    setCameraVisible: (bool: boolean) => any,
    setOptions: React.Dispatch<React.SetStateAction<postOptions>>;
    options: postOptions;
    content: string;
    maxLength: number;
}

type LocationType = {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
}

function BottomButtonPostCreator({ addFiles, setCameraVisible, content, maxLength, setOptions, options }: PropsType) {

    const { client } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [golfs, setGolfs] = useState<golfInterface[]>([]);
    const [golfModalVisible, setGolfModalVisible] = useState(false);
    const [searchGolf, setSearchGolf] = useState("");
    const [location, setLocation] = useState<LocationType | undefined>(undefined);

    const start = async () => {
        try {
            const position = await getCurrentLocation();
            console.log(position);
            
            if (position) {
                const crd = position.coords;
                const init_location = {
                    latitude: crd.latitude,
                    longitude: crd.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }
                setLocation(init_location);
                const response = await client.search.map.golfs({
                    lat: init_location.latitude,
                    long: init_location.longitude,
                    max_distance: 50000
                });

                if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
                setGolfs(response.data.golfs.items);
            }
        } catch (error) {
            handleToast(JSON.stringify(error))
        }
    }

    useEffect(() => {
        golfModalVisible && start();
    }, [golfModalVisible]);

    const linkGolf = (golf: golfInterface) => {
        setOptions({ ...options, golf: golf });
        setGolfModalVisible(false);
    }

    const searchGolfModal = async () => {
        // searchGolf
        const response = await client.search.golfs(searchGolf, {
            location: location ? {
                lat: location.latitude,
                long: location.longitude,
            } : undefined
        });

        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setGolfs(response.data.golfs.items);
    }

    const buttons = [
        {
            icon: "camera",
            onPress: () => setCameraVisible(true),
            text: "commons.images",
            disable: true
        },
        {
            icon: "folder-multiple-image",
            onPress: async () => await addFiles("photo"),
            text: "commons.images",
            disable: false
        },
        {
            icon: "video-box",
            onPress: async () => await addFiles("video"),
            text: "commons.videos",
            disable: false
        },
        {
            icon: "golf",
            onPress: async () => setGolfModalVisible(true),
            text: "commons.categories",
            disable: false
        }
    ]

    return (
        <>

            <BottomModal isVisible={golfModalVisible} dismiss={() => setGolfModalVisible(false)}>
                <View style={{
                    height: 500
                }}>
                    <SearchBar
                        style={{ backgroundColor: colors.bg_primary }}
                        value={searchGolf}
                        onChangeText={setSearchGolf}
                        placeholder="golf.search"
                        onSearchPress={() => searchGolfModal()}
                        onClearPress={() => setSearchGolf("")}
                    />
                    <FlatList
                        data={golfs}
                        renderItem={({ item }) => (
                            <DisplayGolfs informations={item} onPress={() => linkGolf(item)} />
                        )}
                        keyExtractor={(item) => item.golf_id}
                    />
                </View>
            </BottomModal>

            <View style={{
                backgroundColor: colors.bg_secondary,
                marginBottom: Platform.OS === "android" ? -5 : 0
            }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderColor: colors.bg_secondary,
                    borderTopWidth: 1
                }}>
                    <View style={styles.row}>
                        {buttons.map((b, idx) => !b.disable && <IconButton iconColor={b.disable ? colors.fa_secondary : colors.fa_primary} key={idx} onPress={b.onPress} icon={b.icon} />)}
                    </View>
                    <Text style={{ marginRight: 10 }}>{content.length} / {maxLength}</Text>
                </View>
            </View>
        </>
    )
}

export default BottomButtonPostCreator;