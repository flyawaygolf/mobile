import React, { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { golfInterface } from "../../Services/Client/Managers/Interfaces/Golf";
import { FadeInFromBottom } from "../../Components/Effects";
import { full_width } from "../../Style/style";
import { useTheme } from "../../Components/Container";
import { DisplayMember } from "../../Components/Member";
import { DisplayGolfs } from "../../Components/Golfs";
import { navigationProps } from "../../Services";

type PropsType = {
    query: string;
    queryResult: (userInfo | golfInterface)[];
    visible: boolean;
    centerMap: (options: {
        go_to?: {
            latitude: number;
            longitude: number;
        },
        duration?: number
    }) => void;
    setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchMapModal: React.FC<PropsType> = ({ query, queryResult, visible, centerMap, setIsInputFocused }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { top } = useSafeAreaInsets();
    const navigation = useNavigation<navigationProps>();

    const renderItem = useCallback(({ item }: { item: userInfo | golfInterface }) => {
        if ('user_id' in item) {
            return (
                <DisplayMember
                    onPress={() => {
                        centerMap({
                            go_to: {
                                latitude: item.golf_info.location.latitude,
                                longitude: item.golf_info.location.longitude
                            }
                        })
                        setIsInputFocused(false);
                    }}
                    informations={item}
                />
            );
        } else {
            return (
                <DisplayGolfs
                    onPress={() => {
                        centerMap({
                            go_to: {
                                latitude: item.location.latitude,
                                longitude: item.location.longitude
                            }
                        })
                        setIsInputFocused(false);
                    }}
                    informations={item}
                />
            );
        }
    }, [navigation]);

    const keyExtractor = useCallback((item: userInfo | golfInterface, index: number) => 'user_id' in item ? `user-${index}` : `golf-${index}`, []);

    const ListEmptyComponent = useMemo(() => <Text>{t("map.no_results", { query: query })}</Text>, [t]);

    return (
        visible && (
            <FadeInFromBottom
                duration={450}
                style={{
                    position: "absolute",
                    zIndex: 3,
                    width: full_width,
                    height: "100%",
                    padding: 10,
                    paddingTop: top + 85,
                    backgroundColor: colors.bg_primary
                }}
            >
                <FlatList
                    ListEmptyComponent={ListEmptyComponent}
                    data={queryResult}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                />
            </FadeInFromBottom>
        )
    );
};

export default React.memo(SearchMapModal);