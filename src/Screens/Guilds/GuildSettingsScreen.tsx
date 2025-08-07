import { useNavigation } from "@react-navigation/native";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { handleToast, MessageStackParams, navigationProps, ScreenNavigationProps } from "../../Services";
import { useTranslation } from "react-i18next";
import { Appbar, Avatar, Icon, IconButton, Text, TextInput } from "react-native-paper";
import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import { DisplayMember } from "../../Components/Member";
import { userInfo } from "../../Services/Client/Managers/Interfaces/Global";
import { ShrinkEffect } from "../../Components/Effects";
import { useDispatch } from "react-redux";
import { deleteGuildList, updateGuildInfo as updateGuildInfoRedux } from "../../Redux/guildList/action";
import MessagesContext from "../../Contexts/MessagesContext";

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
    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const messageContext = useContext(MessagesContext);

    // État local
    const [guildInfo, setGuildInfo] = useState(guild);
    const [totalMembers, setTotalMembers] = useState(guild.member_count || 0);
    const [members, setMembers] = useState<userInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination_key, setPaginationKey] = useState<string | undefined>(undefined);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(guildInfo.guild_name);

    const [deleteMembersActivated, setDeleteMembersActivated] = useState(false);

    const getMembers = async () => {
        if (loading) return;
        setLoading(true);
        const request = await client.guilds.members(guild.guild_id, pagination_key);
        setLoading(false);
        if (request.error) return handleToast(t(`errors.${request.error.code}`));
        if (request.data) {
            setMembers([...members, ...request.data.members]);
            setTotalMembers(request.data.total_members);
            if(messageContext) {
                messageContext.updateGuildInfoSync(guild.guild_id, {
                    members: [...members, ...request.data.members],
                    member_count: request.data.total_members,
                });
            }
            if (request.pagination_key) setPaginationKey(request.pagination_key);
        }
        return;
    }

    const leaveGroupAlert = useCallback(() => {
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
                    onPress: async () => {
                        try {
                            const request = await client.guilds.leave(guild.guild_id);
                            if (request.error) return handleToast(t(`errors.${request.error.code}`));
                            dispatch(deleteGuildList(guild.guild_id));
                            navigation.navigate("BottomNavigation", { screen: "Messages" });
                        } catch (error) {
                            console.error('Erreur lors de quitter la guilde:', error);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    }, [navigation]);

    const deleteMember = (user: userInfo) => {
        Alert.alert(
            t("guilds.delete_member"),
            t("guilds.delete_member_confirmation", { username: user.username }),
            [
                {
                    text: t("commons.cancel"),
                    style: "cancel",
                },
                {
                    text: t("commons.delete"),
                    onPress: async () => {
                        try {
                            const request = await client.guilds.kick(guild.guild_id, user.user_id);
                            if (request.error) return handleToast(t(`errors.${request.error.code}`));
                            const new_members = members.filter(m => m.user_id !== user.user_id)
                            messageContext?.updateGuildInfoSync(guild.guild_id, {
                                members: new_members,
                                member_count: totalMembers - 1,
                            });
                            setMembers(new_members);
                            setTotalMembers(totalMembers - 1);
                            handleToast(t("commons.success"));
                        } catch (error) {
                            console.error('Erreur lors de la suppression du membre:', error);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    const editGuild = async () => {
        if (newName.trim().length === 0) return;
        try {
            const request = await client.guilds.edit(guild.guild_id, { guild_name: newName.trim() });
            if (request.error) return handleToast(t(`errors.${request.error.code}`));
            messageContext?.updateGuildInfoSync(guild.guild_id, { guild_name: newName.trim() });

            // Mettre à jour la liste des guilds dans Redux
            dispatch(updateGuildInfoRedux({
                guildId: guild.guild_id,
                updates: { guild_name: newName.trim() }
            }));
            setIsEditingName(false);
            handleToast(t("commons.success"));
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la guilde:', error);
        }
    };

    const cancelEdit = () => {
        setNewName(guildInfo.guild_name);
        setIsEditingName(false);
    };

    const navigateToAddUsers = () => {
        // Navigation directe vers AddUsersToGuildScreen dans la même stack
        navigation.navigate('MessagesStack', {
            screen: 'AddUsersToGuildScreen',
            params: { guild: guildInfo }
        });
    };

    useEffect(() => {
        if(members.length === 0) {
            getMembers();
        }
        if(messageContext && messageContext.guild !== guildInfo) {
            setGuildInfo(messageContext.guild);
            setTotalMembers(messageContext.guild.member_count || 0);
            setMembers(messageContext.guild.members);
        }
    }, [])

    useEffect(() => {
        if (messageContext?.guild) {
            setGuildInfo(messageContext.guild);
            setTotalMembers(messageContext.guild.member_count || 0);
            setMembers(messageContext.guild.members);
        }
    }, [messageContext, guild]);

    const renderItem = useCallback(({ item }: { item: userInfo }) => (
        <DisplayMember
            LeftComponent={item.user_id !== guildInfo.owner ? guildInfo.owner === user.user_id && deleteMembersActivated ? (
                <View style={{ marginRight: 10 }}>
                    <Icon size={25} source="minus-circle-outline" />
                </View>
            ) : <View style={{ marginRight: 10 }}>
                <Icon size={25} source="chevron-right" />
            </View> : (
                <Text style={{ color: colors.text_muted, fontStyle: "italic" }}>{t("guilds.owner")}</Text>
            )}
            onPress={() => deleteMembersActivated ? deleteMember(item) : navigation.navigate('ProfileStack', { screen: "ProfileScreen", params: { nickname: item.nickname } })}
            informations={item}
        />
    ), [guildInfo.owner, deleteMember, deleteMembersActivated]);

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

            {
                user.user_id === guildInfo.owner && guild.type !== 0 && (
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
                )
            }

            <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text_muted, marginLeft: 5 }}>{t("guilds.members", { count: totalMembers })}</Text>
                {user.user_id === guildInfo.owner && guild.type !== 0 && <IconButton icon="trash-can" iconColor={deleteMembersActivated ? colors.badge_color : colors.text_muted} onPress={() => setDeleteMembersActivated(!deleteMembersActivated)} />}
            </View>

            <FlatList
                data={members}
                keyExtractor={(item) => item.user_id}
                renderItem={renderItem}
                onScrollEndDrag={() => getMembers()}
                ListHeaderComponent={() => user.user_id === guildInfo.owner && guild.type !== 0 && (
                    <ShrinkEffect
                        onPress={navigateToAddUsers}
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
                ListEmptyComponent={<Text style={{ marginLeft: 15 }}>{t("guilds.no_members")}</Text>}
            />
        </SafeBottomContainer>
    );
};

export default GuildSettingsScreen;