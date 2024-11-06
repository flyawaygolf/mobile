import React from "react";
import { Appbar } from 'react-native-paper';
import { Image, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { navigationProps } from '../../Services';
import { useTheme } from "../Container";

const ProfileHeader = () => {

    const navigation = useNavigation<navigationProps>();

    const { theme } = useTheme();

    const pressAvatar = () => {};

    return (
        <Appbar.Header style={{ flexDirection: "row", justifyContent: "center" }}>
            {
                /**
                 *             <View style={[styles.row, { justifyContent: "flex-end" }]}>
                <TouchableWithoutFeedback onPress={() => pressAvatar()}>
                    <View>
                        <Avatar.Image size={33} source={{
                            cache: "force-cache",
                            uri: "https://cdn.trenderapp.com/profile_avatars/227796574762303490/ddYac_ilwHqwrwN-l4UvbSdMDzcuFZXeNhP7PZeK2GCZ49Pn0.jpg"
                        }} />
                    </View>
                </TouchableWithoutFeedback>
            </View>
                 */
            }
            <View>
                <Image
                    source={theme === "dark" ? require(`../Elements/Assets/Images/logo_white.png`) : require(`../Elements/Assets/Images/logo_dark.png`)}
                    style={{
                        width: 50,
                        height: 50,
                    }}
                />
            </View>
        </Appbar.Header>
    )
}

export default ProfileHeader;
