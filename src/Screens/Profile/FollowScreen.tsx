import React, { useEffect, useState, useCallback } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from 'react-native-toast-message';
import { Appbar, Icon, Text } from "react-native-paper";
import { ScreenContainer, useClient, useTheme, } from "../../Components/Container";
import { Avatar } from "../../Components/Member";
import styles, { full_width } from "../../Style/style";
import { FollowInterface } from "../../Services/Client/Managers/Interfaces";
import { useNavigation } from "@react-navigation/native";
import { navigationProps } from "../../Services";

function FollowScreen({ route }: any) {

    const [info, setInfo] = useState<Array<FollowInterface.followInformationsResponse>>([]);
    const [loader, setLoader] = useState(true);
    const { client } = useClient();
    const { colors } = useTheme();
    const { nickname, type } = route.params;
    const { t } = useTranslation();
    const [paginationKey, setPaginationKey] = useState<undefined | string>(undefined);
    const navigation = useNavigation<navigationProps>();

    async function getData() {
        setLoader(true);
        const response = type !== "subscriptions" ? await client.follows.followers(nickname) : await client.follows.follows(nickname);
        setLoader(false)
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        setInfo(response.data);

    }

    useEffect(() => {
        getData()
    }, [nickname])

    const bottomHandler = async () => {
        setLoader(true)
        const response = type !== "subscriptions" ? await client.follows.followers(nickname, { pagination_key: paginationKey }) : await client.follows.follows(nickname, { pagination_key: paginationKey })
        setLoader(false)
        if (response.error) return Toast.show({ text1: t(`errors.${response.error.code}`) as string });
        if (!response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        setInfo([...info, ...response.data])
    }

    const renderItem = useCallback(({ item }: { item: FollowInterface.followInformationsResponse, index?: number }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate('ProfileStack', {
                    screen: "ProfileScreen",
                    params: {
                        nickname: item.nickname
                    }
                })}
                style={[
                    styles.row,
                    {
                        backgroundColor: colors.bg_secondary,
                        borderRadius: 12,
                        padding: 10,
                        margin: 5
                    }
                ]}>
                { /** typeof index !== "undefined" ? <View style={{ backgroundColor: colors.bg_primary, borderRadius: 60, marginRight: 5, width: 30, height: 30, flexDirection: "row", justifyContent: "center", alignItems: "center" }}><Text>{`${index+1}`}</Text></View> : null */}
                <Avatar size={33} url={client.user.avatar(item.user_id, item.avatar)} />
                <Text style={[{ maxWidth: "100%", overflow: "hidden" }]}>{item.username}</Text>
                {item.is_private && <Icon size={15} source="lock" color={colors.text_normal} />}
            </TouchableOpacity>
        )
    }, [])

    return (
        <ScreenContainer>
            <Appbar.Header style={{ width: full_width, flexDirection: "row", justifyContent: "space-between", paddingTop: 0 }}>
                <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    {navigation.canGoBack() && <Appbar.BackAction onPress={() => navigation.goBack()} />}
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{t(`profile.${type}`)}</Text>
                </View>
            </Appbar.Header>
            {!info ? <Text>{t("commons.nothing_display")}</Text> : (
                <FlatList
                    data={info}
                    keyExtractor={(item) => item.user_id}
                    renderItem={renderItem}
                    refreshControl={(<RefreshControl
                        refreshing={loader}
                        progressBackgroundColor={colors.bg_primary}
                        tintColor={colors.fa_primary}
                        colors={[colors.fa_primary, colors.fa_secondary, colors.fa_third]}
                        onRefresh={() => getData()} />
                    )}
                    onScrollEndDrag={() => bottomHandler()}
                />

            )
            }
        </ScreenContainer>
    )
}

export default FollowScreen;