import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import FastImage from '@d11/react-native-fast-image';

import { PostContainer, useClient, useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import { handleToast, navigationProps } from '../../Services';
import { cdnbaseurl } from '../../Services/constante';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { Loader } from '../../Other';
import { useAppDispatch, useAppSelector } from '../../Redux';
import { addGolfsPlayed, deleteGolfsPlayed, initGolfsPlayed } from '../../Redux/GolfsPlayed/action';
import { ShrinkEffect } from '../../Components/Effects';
import { Avatar } from '../../Components/Member';

const GolfsPlayedScreen = () => {

    const { client, user } = useClient();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();

    const golfs = useAppSelector((state) => state.golfsPlayed);
    const dispatch = useAppDispatch();
    const [loader, setLoader] = useState(true);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    async function getData() {
        const response = await client.golfs.played.playedGolfs(user.user_id, { pagination: { pagination_key: pagination_key } });
        setLoader(false)
        if (response.error || !response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(initGolfsPlayed(response.data));
    }

    useEffect(() => {
        dispatch(initGolfsPlayed([]));
        getData()
    }, [])

    const bottomHandler = async () => {
        if (loader) return;
        setLoader(true)
        const response = await client.golfs.played.playedGolfs(user.user_id, { pagination: { pagination_key: pagination_key } });
        setLoader(false);
        if (response.error || !response.data) return;
        if (response.data.length < 1) return;
        if (response.pagination_key) setPaginationKey(response.pagination_key);
        dispatch(addGolfsPlayed(response.data));
    }

    const removePlayedGolf = async (golfInfo: golfInterface) => {
        if (!golfInfo.golf_id) return;
        const response = await client.golfs.played.unmarkAsPlayed(golfInfo.golf_id);
        if (response.error) return handleToast(t(`errors.${response.error.code}`));
        if (response.data) {
            handleToast(t(`commons.success`));
            dispatch(deleteGolfsPlayed(golfInfo.golf_id));
        }
    };

    const renderItem = ({ item }: { item: golfInterface }) => (
        <ShrinkEffect onPress={() => navigation.navigate("GolfsStack", { screen: "GolfsProfileScreen", params: { golf_id: item.golf_id } })}>
            <Card style={{ margin: 5, width: full_width ? "auto" : 300 }}>
                <View style={{ width: "100%", height: 150, borderTopRightRadius: 10, borderTopLeftRadius: 10, overflow: "hidden", position: "relative" }}>
                    <FastImage
                        resizeMode="cover"
                        style={{ backgroundColor: colors.good_color, ...StyleSheet.absoluteFillObject }}
                        source={{ uri: `${cdnbaseurl}/golf_covers/${item.slug}/default.jpg` }} />
                </View>
                <View style={{ padding: 20, paddingTop: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 10 }}>
                        <Avatar url={`${cdnbaseurl}/golf_avatars/${item.slug}/default.jpg`} size={40} radius={8} />
                        <Text style={{ marginLeft: 5 }}>{item.name}</Text>
                    </View>
                    <Card.Actions>
                        {
                            item.played && <Button onPress={() => removePlayedGolf(item)} textColor={colors.badge_color}>{t('golf.delete_from_played')}</Button>
                        }
                    </Card.Actions>
                </View>
            </Card>
        </ShrinkEffect>
    )

    const memoizedValue = useMemo(() => renderItem, [golfs]);

    return (
        <PostContainer title="golf.golfs_played">
            <FlatList
                ListEmptyComponent={<Text style={{ padding: 5 }}>{t("commons.nothing_display")}</Text>}
                ListFooterComponent={loader ? <Loader /> : undefined}
                onScrollEndDrag={() => bottomHandler()}
                data={golfs}
                renderItem={memoizedValue}
                keyExtractor={item => item.golf_id} />
        </PostContainer>
    );
};


export default GolfsPlayedScreen;
