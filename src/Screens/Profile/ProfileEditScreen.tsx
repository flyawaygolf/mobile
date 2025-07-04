import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { ScrollView, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Appbar, Text, TextInput, ProgressBar, IconButton, Button, SegmentedButtons } from "react-native-paper";
import { useRealm } from "@realm/react";
import { AxiosRequestConfig } from "axios";
import FastImage from "@d11/react-native-fast-image";

import useTheme from "../../Components/Container/Theme/useTheme";
import { useClient } from "../../Components/Container";
import { axiosInstance, getPermissions, handleToast } from "../../Services";
import { Avatar } from "../../Components/Member";
import { full_width } from "../../Style/style";
import { displayHCP } from "../../Services/handicapNumbers";
import { addUser } from "../../Services/Realm/userDatabase";
import { gender } from "../../Services/Client/Managers/Interfaces/Global";
import HandicapModal from "../../Components/Profile/HandicapModal";
import { usertokenkey } from "../../Services/constante";

export interface fileI {
    size: number;
    name: string;
    type: string;
    uri: string;
}

export interface modifI {
    username: string
    nickname: string,
    description: string,
    gender?: gender;
    golf_info: {
        handicap: number,
        player_status: number;
        location?: {
            latitude: number;
            longitude: number;
        };
    },
    avatar?: fileI,
    banner?: fileI
}

function ProfileEditScreen() {

    const navigation = useNavigation();
    const realm = useRealm();
    const { t } = useTranslation('');
    const { colors } = useTheme();
    const { client, token, setValue, user } = useClient();
    const old_client = useClient();
    const [visible, setVisible] = React.useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [modif, setModif] = useState<modifI>({
        username: user.username,
        nickname: user.nickname,
        description: user.description ?? "",
        gender: user?.gender ?? 0,
        golf_info: {
            handicap: user.golf_info?.handicap ?? 540,
            player_status: user.golf_info?.player_status ?? 0,
            location: user.golf_info?.location ?? {
                latitude: 0,
                longitude: 0,
            },
        },
    });    
    
    const [profilePictures, setProfilePicture] = useState<{
        avatar: string;
        banner?: string;
    }>({
        avatar: `${client.user.avatar(user.user_id, user.avatar)}`,
        banner: `${client.user.banner(user.user_id, user?.banner ?? "")}`
    });

    const [sending, setSending] = useState({
        send: false,
        progress: 0,
    })

    useEffect(() => {
        getPermissions();
    }, [])

    const changePictures = async (target: "avatar" | "banner") => {

        const res = await ImagePicker.openPicker({
            width: target === "avatar" ? 500 : undefined,
            height: target === "avatar" ? 500 : undefined,
            cropping: true,
            multiple: false,
            mediaType: "photo",
        })

        const file: fileI = {
            size: res.size,
            name: res.path.split('/')[res.path.split('/').length - 1],
            type: res.mime,
            uri: res.path,
        }

        if (target === "banner") {
            setModif({ ...modif, banner: file })
            setProfilePicture({ ...profilePictures, banner: file.uri })
        } else {
            setModif({ ...modif, avatar: file })
            setProfilePicture({ ...profilePictures, avatar: file.uri })
        }

        return;
    }

    const send_info = async () => {

        if (sending.send) return;
        let data: modifI = {
            ...modif,
            description: modif.description ? modif.description.substring(0, 120) : "",
            nickname: modif.nickname,
            username: modif.username,
            golf_info: modif.golf_info,
        }

        setSending({ send: true, progress: 10 })

        if (data?.nickname?.length > 30 || data?.nickname?.length < 3 || data?.username?.length > 30 || data?.username?.length < 3 || data?.description?.length > 120) return handleToast(t(`errors.verify_fields`));
        if (data?.avatar) {
            var formdata = new FormData();

            formdata.append("avatar", modif.avatar);

            var config: AxiosRequestConfig = {
                headers: {
                    'content-type': 'multipart/form-data',
                    [usertokenkey]: token,
                },
                onUploadProgress: function (progressEvent) {
                    const total = progressEvent?.total ?? 1;
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                    setSending({ send: true, progress: percentCompleted })
                },
            }

            const request = await axiosInstance.post(`/files/upload?type=avatar`, formdata, config);
            const response = request.data;
            if (response?.error) {
                setSending({ send: false, progress: 0 });
                return handleToast(t(`errors.${response.error.code}`));
            }

            data = { ...data, avatar: response.data };
        }

        if (data?.banner) {
            var formdata = new FormData();

            formdata.append("banner", modif.banner);

            var config: AxiosRequestConfig = {
                headers: {
                    'content-type': 'multipart/form-data',
                    [usertokenkey]: token,
                },
                onUploadProgress: function (progressEvent) {
                    const total = progressEvent?.total ?? 1;
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                    setSending({ send: true, progress: percentCompleted })
                },
            }

            const request = await axiosInstance.post(`/files/upload?type=banner`, formdata, config);
            const response = request.data;
            if (response?.error) {
                setSending({ send: false, progress: 0 });
                return handleToast(t(`errors.${response.error.code}`));
            }

            data = { ...data, banner: response.data };

        }

        setSending({ send: true, progress: 100 });

        const response = await client.user.edit(data);

        setSending({ send: false, progress: 0 });

        if (response.error) return handleToast(t(`errors.${response.error.code}`));

        if (response.data) {
            setValue({ ...old_client, user: response.data });
            addUser(realm, response.data)
            handleToast(t("commons.success"));
        }
    }

    return (
        <View style={{ backgroundColor: colors.bg_primary, height: "100%" }}>
            <Appbar.Header style={{ width: full_width, backgroundColor: colors.bg_primary, flexDirection: "row", justifyContent: "space-between" }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Text variant="titleSmall">{t("profile.edit")}</Text>
                <View style={[styles.row, { justifyContent: "flex-end" }]}>
                    <IconButton icon="content-save" disabled={sending.send} onPress={() => send_info()} />
                </View>
            </Appbar.Header>
            <HandicapModal hideModal={hideModal} modif={modif} setModif={setModif} visible={visible} handicap={modif.golf_info.handicap} />
            {sending.send && <ProgressBar progress={sending.progress} color={colors.fa_primary} />}
            <ScrollView>
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <View>
                        <View style={[{ padding: 5 }]}>
                            <View style={{ height: 100, marginBottom: 5 }}>
                                <View style={[styles.banner_image]}>
                                    {
                                        user.banner || modif.banner ? <FastImage style={[styles.banner_image, { backgroundColor: user.accent_color }]} source={{ uri: `${profilePictures.banner}` }} /> : <View style={[styles.banner_image, { backgroundColor: user.accent_color }]} />
                                    }
                                </View>
                            </View>
                            <Button style={{ marginBottom: 10 }} mode="contained" onPress={() => changePictures("banner")}>
                                {t("profile.edit_banner")}
                            </Button>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 10, marginBottom: 5 }}>
                                <Avatar style={{ marginRight: 20 }} size={64} url={profilePictures.avatar} />
                                <Button mode="contained" onPress={() => changePictures("avatar")}>{t("profile.edit_pfp")}</Button>
                            </View>
                            <TextInput
                                label={`${t("profile.username")}`}
                                style={[{ backgroundColor: colors.bg_primary }, styles.inputStyle]}
                                returnKeyType="next"
                                value={modif.username}
                                onChangeText={(text) => setModif({ ...modif, username: text })}
                            />
                            <TextInput
                                label={`${t("profile.nickname")}`}
                                style={[{ backgroundColor: colors.bg_primary }, styles.inputStyle]}
                                returnKeyType="next"
                                value={modif.nickname}
                                onChangeText={(text) => setModif({ ...modif, nickname: text })}
                            />
                            <TextInput
                                label={`${t("profile.bio", { length: modif?.description?.length ?? 0 })}`}
                                style={[{ backgroundColor: colors.bg_primary }, styles.inputStyle]}
                                multiline={true}
                                maxLength={120}
                                returnKeyType="next"
                                value={modif.description}
                                onChangeText={(text) => setModif({ ...modif, description: text })}
                            />
                            <View style={{ margin: 10 }}>
                                <Text style={{ marginBottom: 10 }}>{t("profile.edit_player_status")}</Text>
                                <SegmentedButtons
                                    value={modif.golf_info?.player_status?.toString() ?? "0"}
                                    onValueChange={(value) => setModif({ ...modif, golf_info: { ...modif.golf_info, player_status: parseInt(value) } })}
                                    buttons={[
                                        {
                                            label: t("profile.player_status_amateur"),
                                            value: "0",
                                        },
                                        {
                                            label: t("profile.player_status_pro"),
                                            value: "1",
                                        },
                                    ]}
                                />
                            </View>
                            {
                                /**
                                 *                        <View style={{ margin: 10 }}>
                        <Text style={{ marginBottom: 10 }}>Player gender</Text>
                        <SegmentedButtons
                            value={modif.gender?.toString() ?? "0"}
                            onValueChange={(value) => setModif({ ...modif, gender: parseInt(value) as gender })}
                            buttons={[
                                {
                                    label: "Male",
                                    value: "0",
                                    checkedColor: colors.color_male
                                },
                                {
                                    label: "Female",
                                    value: "1",
                                    checkedColor: colors.color_female
                                }
                            ]}
                        />
                    </View>
                                 */
                            }
                            <Button mode={"contained"} onPress={() => showModal()}>{t("profile.edit_hcp")} : {displayHCP(modif.golf_info.handicap)}</Button>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    EditSectionStyle: {
        flexDirection: 'row',
    },
    row: {
        flexDirection: "row",
        alignItems: 'center',
    },
    inputStyle: {
        minHeight: 60,
        marginTop: 5,
        margin: 10,
    },
    banner_image: {
        width: "100%",
        height: "100%",
        ...StyleSheet.absoluteFillObject,
    },
})

export default ProfileEditScreen;
