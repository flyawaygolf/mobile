import { useNavigation } from "@react-navigation/native";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { handleToast, MessageStackParams, navigationProps, ScreenNavigationProps } from "../../Services";
import { useTranslation } from "react-i18next";
import { Appbar, Avatar, Icon, IconButton, Text, TextInput } from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { DisplayMember } from "../../Components/Member";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { RootState } from "../../Redux";
import { connect, useDispatch } from "react-redux";
import { deleteGuildList, updateGuildList } from "../../Redux/guildList/action";
import { ShrinkEffect } from "../../Components/Effects";

// Composant pour l'édition du nom de la guilde
const GuildNameEditor = ({
    guildInfo,
    isEditingName,
    newName,
    setNewName,
    setIsEditingName,
    onSave,
    onCancel,
    colors,
    t
}: {
    guildInfo: any;
    isEditingName: boolean;
    newName: string;
    setNewName: (name: string) => void;
    setIsEditingName: (editing: boolean) => void;
    onSave: () => void;
    onCancel: () => void;
    colors: any;
    t: any;
}) => (
    <View style={{
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.bg_secondary,
        backgroundColor: colors.bg_primary
    }}>
        <Text style={{
            fontSize: 16,
            color: colors.text_muted,
            marginBottom: 12,
            letterSpacing: 0.5,
            fontWeight: '700'
        }}>
            {t("guilds.name")}
        </Text>
        {isEditingName ? (
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: colors.bg_secondary,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                minHeight: 48
            }}>
                <TextInput
                    value={newName}
                    onChangeText={setNewName}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        marginHorizontal: 8
                    }}
                    mode="flat"
                    dense
                    placeholder={t("guilds.enter_name")}
                    autoFocus
                    maxLength={32}
                />
                <IconButton
                    mode="contained"
                    onPress={onSave}
                    disabled={newName.trim().length === 0 || newName.trim() === guildInfo.guild_name}
                    style={{ marginRight: 8 }}
                    icon="check"
                />
                <IconButton
                    mode="outlined"
                    onPress={onCancel}
                    icon="close"
                />
            </View>
        ) : (
            <ShrinkEffect
                onPress={() => setIsEditingName(true)}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: colors.bg_secondary,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    minHeight: 48
                }}
            >
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    flex: 1,
                    color: colors.text_normal
                }}>
                    {guildInfo.guild_name}
                </Text>
                <IconButton
                    onPress={() => setIsEditingName(true)}
                    iconColor={colors.fa_primary}
                    icon="pencil"
                />
            </ShrinkEffect>
        )}
    </View>
);


const GuildSettingsScreen = ({ route }: ScreenNavigationProps<MessageStackParams, "GuildSettingsScreen">) => {
    const { guild } = route.params;
    const { colors } = useTheme();
    const { client } = useClient();
    const dispatch = useDispatch();
    const navigation = useNavigation<navigationProps>();
    const { t } = useTranslation();
    const [guildInfo, setGuildInfo] = useState(guild);
    const [totalMembers, setTotalMembers] = useState(guild.member_count || 0);
    const [members, setMembers] = useState<userInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(guildInfo.guild_name);

    const [isAddingMember, setIsAddingMember] = useState(false);
    const [newMembers, setNewMembers] = useState<userInfo[]>([]);
    const [searchMemberList, setSearchMemberList] = useState<userInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const getMembers = async (loadMore = false) => {
        if (loading) return;
        setLoading(true);
        const request = await client.guilds.members(guild.guild_id, loadMore ? pagination_key : undefined);
        setLoading(false);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) {
            setMembers(loadMore ? [...members, ...request.data.members] : request.data.members);
            setTotalMembers(request.data.total_members);
            setPaginationKey(request?.pagination_key);
        }
        return;
    }

    const leaveGroup = async () => {
        const request = await client.guilds.leave(guild.guild_id);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        dispatch(deleteGuildList(guild.guild_id));
        navigation.navigate("BottomNavigation", { screen: "Messages" });
    }

    const leaveGroupAlert = () => {
        Alert.alert(
            t("messages.leave_conversation"),
            t("messages.leave_conversation_confirmation"),
            [
                {
                    text: t("commons.cancel"),
                    style: "cancel",
                },
                {
                    text: t("commons.leave"),
                    onPress: () => leaveGroup(),
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    }

    const addMember = async () => {
        const request = await client.guilds.add(guild.guild_id, newMembers.map(m => m.user_id));
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) {
            const { added_users, added_count } = request.data;
            const completeList = newMembers.filter(m => !added_users.includes(m.user_id));
            if (added_users.length > 0) {
                setMembers((prevMembers) => [...prevMembers, ...completeList]);
                setTotalMembers(totalMembers + added_count);
                setGuildInfo((prevInfo) => ({
                    ...prevInfo,
                    member_count: (prevInfo?.member_count ?? 1) + added_count,
                    members: [...prevInfo.members, ...completeList]
                }));
            }
        }

        handleToast(t("commons.success"));
    }

    const deleteMember = (user: userInfo) => {
        Alert.alert(
            t("messages.delete_member"),
            t("messages.delete_member_confirmation", { username: user.username }),
            [
                {
                    text: t("commons.cancel"),
                    style: "cancel",
                },
                {
                    text: t("commons.delete"),
                    onPress: async () => {
                        const request = await client.guilds.kick(guild.guild_id, user.user_id);
                        if (request.error) return handleToast(t(`errors.${request.error.code}`));
                        setMembers(members.filter(m => m.user_id !== user.user_id));
                        setTotalMembers(totalMembers - 1);
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    }

    const editGuild = async () => {
        if (newName.trim().length === 0) return;
        const request = await client.guilds.edit(guild.guild_id, {
            guild_name: newName.trim(),
        });
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        dispatch(updateGuildList({
            guild_name: newName.trim(),
        }));
        setNewName(newName.trim());
        setGuildInfo({ ...guildInfo, guild_name: newName.trim() });
        setIsEditingName(false);
        handleToast(t("commons.success"));
    }

    const cancelEdit = () => {
        setNewName(guildInfo.guild_name);
        setIsEditingName(false);
    }

    const cancelAddMember = () => {
        setNewMembers([]);
        setIsAddingMember(false);
    }

    useEffect(() => {
        getMembers();
    }, []);

    const renderItem = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember
            LeftComponent={item.user_id !== guildInfo.owner ?
                isAddingMember ? (
                    <Pressable style={{ marginRight: 10 }} onPress={() => deleteMember(item)}>
                        <Icon size={25} source="minus-circle-outline" />
                    </Pressable>
                ) : undefined : (
                    <Text style={{ color: colors.text_muted, fontStyle: "italic" }}>{t("guilds.owner")}</Text>
                )}
            onPress={() => !isAddingMember && navigation.navigate('ProfileStack', { screen: "ProfileScreen", params: { nickname: item.nickname } })}
            informations={item} />
    ), [members, isAddingMember]);

    return (
        <SafeBottomContainer padding={{
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }}>
            <Appbar.Header>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Appbar.BackAction onPress={() => navigation.goBack()} />
                    <Text style={{ fontSize: 16, fontWeight: '700', marginLeft: 5, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{t("guilds.settings", { guild_name: guildInfo.guild_name })}</Text>
                </View>
                <Appbar.Action icon="exit-to-app" onPress={() => leaveGroupAlert()} />
            </Appbar.Header>

            <GuildNameEditor
                guildInfo={guildInfo}
                isEditingName={isEditingName}
                newName={newName}
                setNewName={setNewName}
                setIsEditingName={setIsEditingName}
                onSave={editGuild}
                onCancel={cancelEdit}
                colors={colors}
                t={t}
            />

            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 5, color: colors.text_muted, marginLeft: 5 }}>{t("guilds.members", { count: totalMembers })}</Text>
            </View>

            <FlatList
                data={members}
                keyExtractor={(item) => item.user_id}
                renderItem={renderItem}
                onEndReached={() => pagination_key ? getMembers(true) : null}
                onEndReachedThreshold={0.5}
                refreshing={loading}
                ListHeaderComponent={() => (
                    <ShrinkEffect
                        onPress={() => setIsAddingMember(!isAddingMember)}
                        style={{
                            padding: 10,
                            marginLeft: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                            <Avatar.Icon
                                icon="account-plus"
                                color={colors.bg_primary}
                                size={33}
                                style={{ backgroundColor: colors.fa_primary, marginRight: 12 }}
                            />
                            <Text style={{
                                color: colors.text_normal,
                                fontSize: 16,
                                fontWeight: '600'
                            }}>
                                {t("guilds.add_member")}
                            </Text>
                        </View>
                    </ShrinkEffect>
                )}
                ListEmptyComponent={<Text>{t("guilds.no_members")}</Text>}
                onRefresh={() => getMembers(false)}
            />
        </SafeBottomContainer>
    );
};

const mapStateToProps = (state: RootState) => {
    return {
        guildListFeed: state.guildListFeed,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GuildSettingsScreen);