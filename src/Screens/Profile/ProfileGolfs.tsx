import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-paper";
import { useClient, useProfile } from "../../Components/Container";
import { handleToast, navigationProps } from "../../Services";
import { Loader } from "../../Other";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Golf";
import { DisplayGolfs } from "../../Components/Golfs";
import { AnimatedFlashList } from "@shopify/flash-list";

const ProfileGolfs = () => {
    const navigation = useNavigation<navigationProps>();

    const { user_info, scrollY } = useProfile();
    const { client } = useClient();
    const { t } = useTranslation();

    const [golfPaginationKey, setGolfsPaginationKey] = useState<string | undefined>(undefined);
    const [golfs, setGolfs] = useState<golfInterface[]>([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getGolfs(true);
    }, [user_info]);

    const getGolfs = async (load = false) => {
        if(load) {
            if (loading || !user_info) return;
            setLoading(true);
        }
        const response = await client.golfs.link.golfs(user_info.user_id, { pagination: { pagination_key: golfPaginationKey } });
        setLoading(false);
        if (response.error) return handleToast(t(`errors.${response.error.code}`))
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setGolfsPaginationKey(response.pagination_key);
        if (golfs.length > 0) setGolfs([...golfs, ...response.data]);
        setGolfs(response.data);
    };

    const renderGolfs = useCallback(({ item }: { item: golfInterface }) => (
        <DisplayGolfs
            onPress={() => navigation.navigate("GolfsStack", {
                screen: "GolfsProfileScreen",
                params: {
                    golf_id: item.golf_id,
                }
            })}
            informations={item} />
    ), []);

    const memoizedGolfs = useMemo(() => renderGolfs, [golfs]);

    return user_info && !loading ? (
        <AnimatedFlashList
            removeClippedSubviews={true}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            data={golfs}
            keyExtractor={(item) => item.golf_id}
            renderItem={memoizedGolfs}
            onScrollEndDrag={() => getGolfs()}
            ListEmptyComponent={loading ? <Loader /> : <Text style={{ textAlign: "center" }}>{t("profile.no_linked_golfs")}</Text>}
            scrollIndicatorInsets={Platform.OS === "ios" ? {
                right: 1
            } : undefined} />
    ) : <Loader />;
};

export default memo(ProfileGolfs);