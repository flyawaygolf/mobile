import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Appbar, Divider, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { SafeBottomContainer, useClient, useTheme } from '../../Components/Container';
import { handleToast } from '../../Services';
import { MessageStackParams, ScreenNavigationProps } from '../../Services';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';
import { SearchBar } from '../../Components/Elements/Input';
import { Avatar, DisplayMember } from '../../Components/Member';
import { full_width } from '../../Style/style';
import MessagesContext from '../../Contexts/MessagesContext';
import { connect, useDispatch } from 'react-redux';
import { RootState } from '../../Redux';
import { addGuildList } from '../../Redux/guildList/action';

interface AddUsersToGuildScreenProps extends ScreenNavigationProps<MessageStackParams, 'AddUsersToGuildScreen'> { }

const AddUsersToGuildScreen: React.FC<AddUsersToGuildScreenProps> = ({ route, navigation }) => {
    const { guild } = route.params;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { client, location } = useClient();
    const [selected, setSelected] = useState<userInfo[]>([]);
    const [list, setList] = useState<userInfo[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoader] = useState(false);
    const messageContext = useContext(MessagesContext);
    const dispatch = useDispatch();

    const searchMember = async () => {
        const request = await client.search.users(text, {
            location: location && {
                lat: location.latitude,
                long: location.longitude,
            },
        });
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) return setList(request.data.users.items);
    }

    useEffect(() => {
        text.length > 1 && searchMember()
        setList([])
    }, [text])

    const addUsersToGuild = async () => {
        setLoader(true);
        const request = await client.guilds.add(guild.guild_id, selected.map(u => u.user_id));
        setLoader(false);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) {
            const { added_users, new_guild } = request.data;
            const newMembers = selected.filter(u => added_users.some(uid => uid === u.user_id));
            if (messageContext) {
                messageContext.updateGuildInfoSync(guild.guild_id, {
                    members: [...messageContext.guild.members, ...newMembers]
                });
            }
            handleToast(t("commons.success"));
            if (new_guild) {
                dispatch(addGuildList([new_guild]));
                setTimeout(() => {
                    navigation.navigate("MessageScreen", {
                        guild: new_guild
                    });
                }, 500);
            } else {
                setTimeout(() => {
                    navigation.goBack();
                }, 500);
            }
        }
    }

    return (
        <SafeBottomContainer>
            <Appbar.Header>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{t("guilds.settings", { guild_name: guild.guild_name })}</Text>
                </View>
                <Appbar.Action icon="content-save" loading={loading} onPress={async () => {
                    await addUsersToGuild();
                }} />
            </Appbar.Header>
            <View style={[styles.container, { backgroundColor: colors.bg_primary }]}>
                <View style={[styles.header, { borderBottomColor: colors.bg_third }]}>
                    <Text style={[styles.title, { color: colors.text_normal }]}>
                        {t('guilds.add_users')}
                    </Text>
                </View>
                <View style={{ padding: 5 }}>
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
                        renderItem={({ item }) => <DisplayMember style={{
                            backgroundColor: selected.some(u => u.user_id === item.user_id) ? colors.bg_third : colors.bg_secondary,
                        }} informations={item} onPress={() => !selected.some(u => u.user_id === item.user_id) && setSelected((s) => [item, ...s])} />}
                    />
                </View>
            </View>
        </SafeBottomContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.7,
    },
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    searchBar: {
        height: 40,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingHorizontal: 8,
    },
    selectionInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
    },
    resultsList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    userInfo: {
        flex: 1,
        marginRight: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    },
    addButton: {
        marginVertical: 8,
    },
});

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {
    addGuildList,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddUsersToGuildScreen);

