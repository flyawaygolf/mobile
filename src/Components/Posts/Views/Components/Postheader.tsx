import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Owner from "./Menu/Owner";
import User from "./Menu/User";
import styles from "../../../../Style/style";
import { useClient } from "../../../Container";
import { Avatar, Username } from "../../../Member";
import { navigationProps } from "../../../../Services";
import { GlobalInterface } from "../../../../Services/Client/Managers/Interfaces";

type SectionProps = {
    info: GlobalInterface.userInfo;
    created_at: string;
    post_id: string;
    lefComponent?: JSX.Element;
}

function Postheader({ info, created_at, post_id, lefComponent }: SectionProps) {

    const { client, user } = useClient();
    const navigation = useNavigation<navigationProps>();
    const [showModal, setShowModal] = useState(false);

    return (
        <View style={{
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between"
        }}>
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate("ProfileStack", {
                screen: "ProfileScreen",
                params: {
                    nickname: info.nickname
                }
            })} >
                <View style={[styles.row, {
                    justifyContent: "flex-start",
                    alignItems: "flex-start"
                }]}>
                    <Avatar size={35} marginRight={10} url={client.user.avatar(info?.user_id, info?.avatar)} />
                    <Username user={info} created_at={created_at} lefComponent={lefComponent} />
                </View>
            </TouchableOpacity>
            <View style={styles.row}>
                <IconButton style={{ marginTop: -5 }} onPress={() => setShowModal(true)} icon="dots-horizontal" />
            </View>
            {info?.user_id === user?.user_id && <Owner pined={info.pined_post} post_id={post_id} modalVisible={showModal} setModalVisible={() => setShowModal(false)} />}
            {info?.user_id !== user?.user_id && <User modalVisible={showModal} setModalVisible={() => setShowModal(false)} />}
        </View>
    )
}

export default Postheader;