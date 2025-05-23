
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, FlatList } from 'react-native';
import { Appbar, Button, Chip, Divider, Text } from 'react-native-paper';
import { connect, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { useClient, useTheme } from '../../Components/Container';
import styles, { full_width } from '../../Style/style';
import { Avatar, DisplayMember } from '../../Components/Member';
import { SearchBar } from '../../Components/Elements/Input';
import { addGuildList } from '../../Redux/guildList/action';
import { RootState } from '../../Redux';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { handleToast, navigationProps } from '../../Services';

const CreateGuildScreen = () => {

    const { colors } = useTheme();
    const { client, location } = useClient();
    const { t } = useTranslation();
    const navigation = useNavigation<navigationProps>()
    const [selected, setSelected] = useState<userInfo[]>([]);
    const dispatch = useDispatch();
    const [list, setList] = useState<userInfo[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoader] = useState(false);

    const searchMember = async () => {
        const request = await client.search.users(text, {
            location: location && {
                lat: location.latitude,
                long: location.longitude,
            },
        })
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) return setList(request.data.users.items);
    }

    useEffect(() => {
        text.length > 1 && searchMember()
        setList([])
    }, [text])

    const createDm = async () => {
        if (loading) return;
        setLoader(true)
        const request = await client.guilds.create(selected.map(u => u.user_id));
        setLoader(false)
        if (request.error || !request.data) return handleToast(t(`errors.${request.error?.code}`));
        if (request.data) dispatch(addGuildList([request.data as any]));

        setTimeout(() => {
            navigation.navigate("MessagesStack", {
                screen: "MessageScreen",
                params: request.data,
            })
        }, 500)
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.bg_primary }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={styles.row} >
                    <Appbar.BackAction color={colors.text_normal} onPress={() => navigation ? navigation.goBack() : null} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5 }}>{t("messages.create_guild")}</Text>
                </View>
                {
                    selected.length > 0 && (
                        <View style={[styles.row, { justifyContent: "flex-end" }]}>
                            <Button
                                textColor={colors.text_normal}
                                loading={loading}
                                onPress={() => loading ? {} : createDm()}
                                labelStyle={{ fontSize: 16, fontWeight: '700' }}
                                style={{ marginRight: 10 }}
                                uppercase={false}>{t("commons.next")}</Button>
                        </View>
                    )
                }
            </Appbar.Header>
            <View style={{ padding: 5 }}>
                <Text style={{ marginBottom: 5 }}>{t("messages.with")}</Text>
                <FlatList
                    style={{
                        maxHeight: selected.length > 3 ? undefined : 40,
                    }}
                    data={selected}
                    keyExtractor={item => item.user_id}
                    renderItem={({ item }) => <Chip
                        compact={false}
                        style={{ backgroundColor: colors.bg_secondary, width: 120, marginRight: 5 }}
                        avatar={<Avatar size={25} url={client.user.avatar(item.user_id, item.avatar)} />}
                        onPress={() => setSelected((s) => s.filter(m => m.user_id !== item.user_id))}>{item.username}</Chip>}
                    numColumns={3}
                    horizontal={false}
                />
                <Divider style={{
                    marginTop: selected.length > 0 ? 5 : 25,
                    borderWidth: 0.5,
                }} />
                <SearchBar
                    onSearchPress={() => { }}
                    style={{
                        backgroundColor: colors.bg_secondary,
                        width: full_width - 10,
                        margin: 5,
                    }}
                    placeholder={t("commons.search") + " ..."}
                    onChangeText={(txt) => setText(txt)}
                    value={text}
                    onClearPress={() => setText("")}
                />
                <FlatList
                    data={list}
                    keyExtractor={item => item.user_id}
                    renderItem={({ item }) => <DisplayMember informations={item} onPress={() => !selected.some(u => u.user_id === item.user_id) && setSelected((s) => [item, ...s])} />}
                />
            </View>
        </View>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {
    addGuildList,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGuildScreen);
