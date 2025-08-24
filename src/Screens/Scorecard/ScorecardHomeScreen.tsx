import { useTranslation } from "react-i18next";
import { ScreenContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Avatar, ActivityIndicator } from "react-native-paper";
import { SearchBar } from "../../Components/Elements/Input";
import { View, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistance, handleToast, navigationProps } from "../../Services";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Golf";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../../Components/Header/CustomHeader";
import { FlashList } from "@shopify/flash-list";

const GolfCard = ({ golf, onCreateScorecard }: { golf: golfInterface, onCreateScorecard: () => void }) => {
    const { colors } = useTheme();
    const { client } = useClient();
    return (
        <TouchableOpacity activeOpacity={0.85} onPress={onCreateScorecard}>
            <ImageBackground
                source={{ uri: client.golfs.cover(golf.golf_id) }}
                style={[styles.card, {
                    backgroundColor: colors.bg_secondary,
                }]}
                imageStyle={{
                    resizeMode: "cover",
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.row}>
                        <Avatar.Image
                            size={48}
                            source={{ uri: client.golfs.avatar(golf.golf_id) }}
                            style={{
                                backgroundColor: colors.text_normal
                            }}
                        />
                        <View style={styles.infoContainer}>
                            <Text variant="titleMedium" style={styles.golfName}>{golf.name}</Text>
                            <Text variant="bodySmall" style={styles.golfCity}>{golf.city ?? ""}</Text>
                            <Text variant="bodySmall" style={styles.golfDetails}>
                                {golf.holes ? `${golf.holes} trous` : ""} {golf.distance ? `· ${formatDistance(golf.distance)}km` : ""}
                            </Text>
                        </View>
                    </View>
                    {/* Ajout d'autres infos si besoin */}
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

const ScorecardHomeScreen = () => {
    const { client, location } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>();
    const [search, setSearch] = useState<string>("");
    const [golfs, setGolfs] = useState<golfInterface[]>([]);
    const [mapGolfs, setMapGolfs] = useState<golfInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const searchGolfs = async (long = location?.longitude, lat = location?.latitude) => {
        const response = await client.search.golfs(search, {
            location: {
                long: long ?? 48.864716,
                lat: lat ?? 2.349014,
            }
        })
        if (response.error || !response.data) return handleToast(t(`errors.${response?.error?.code}`));
        setLoading(false);
        setGolfs(response.data.golfs.items);
        return;
    }

    const updateMapGolfs = async (long = location?.longitude, lat = location?.latitude) => {
        const request = await client.search.map.golfs({
            long: long ?? 48.864716,
            lat: lat ?? 2.349014,
            max_distance: 50000,
        })
        if (request.error || !request.data) return handleToast(t(`errors.${request?.error?.code}`));
        setMapGolfs(request.data.golfs.items);
        setGolfs(request.data.golfs.items);
        setLoading(false);
        return;
    }

    useEffect(() => {
        if (search.length > 2) searchGolfs();
        else {
            if(mapGolfs.length > 0) {
                 setGolfs(mapGolfs)
                 setLoading(false);
            }
            else {
                updateMapGolfs();
            }
        }
    }, [search]);

    const ListEmptyComponent = useMemo(() => (
        <Text style={{ textAlign: "center", marginTop: 32 }}>
            {t("map.no_results", { query: search })}
        </Text>
    ), [t, search]);

    const handleCreateScorecard = (golf: golfInterface) => {
        navigation.navigate("ScorecardStack", {
            screen: "ScorecardCreateScreen",
            params: { golf_id: golf.golf_id }
        });
    };

    const renderItem = useCallback(({ item }: { item: golfInterface }) => (
        <GolfCard
            golf={item}
            onCreateScorecard={() => handleCreateScorecard(item)}
        />
    ), [navigation]);

    return (
        <ScreenContainer>
            <CustomHeader isHome>
                <SearchBar
                    onClearPress={() => setSearch("")}
                    onSearchPress={() => { }}
                    value={search}
                    onChangeText={(txt) => setSearch(txt)}
                    placeholder={t("commons.search_placeholder")}
                />
            </CustomHeader>
            <FlashList
                ListEmptyComponent={search.length > 0 ? ListEmptyComponent : null}
                data={golfs}
                keyExtractor={(item) => item.golf_id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<ActivityIndicator animating={loading} />}
            />
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        marginHorizontal: 12,
        marginVertical: 10,
        borderRadius: 18,
        overflow: "hidden",
        height: 120,
        elevation: 4,
        justifyContent: "flex-end",
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: 14,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        backgroundColor: "#e9ecef",
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "center",
    },
    golfName: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#fff",
        marginBottom: 2,
    },
    golfCity: {
        color: "#f1f1f1",
        fontSize: 14,
        marginBottom: 2,
    },
    golfDetails: {
        color: "#e0e0e0",
        fontSize: 13,
    },
});

export default ScorecardHomeScreen;