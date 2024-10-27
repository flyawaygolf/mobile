import React, { useRef } from "react";
import { Appbar, Avatar } from 'react-native-paper';
import { Animated, Image, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import styles from '../../Style/style';
import { navigationProps } from '../../Services';
import { useTheme } from "../Container";

const ProfileHeader = () => {

    const navigation = useNavigation<navigationProps>();

    const scaleValue = useRef(new Animated.Value(1)).current;
    const { theme } = useTheme();

    const shrinkView = () => {
        Animated.timing(scaleValue, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const expandView = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const pressAvatar = () => {};

    return (
        <Appbar.Header style={{ flexDirection: "row", justifyContent: "center" }}>
            {
                /**
                 *             <View style={[styles.row, { justifyContent: "flex-end" }]}>
                <TouchableWithoutFeedback onPressIn={shrinkView} onPressOut={expandView} onPress={() => pressAvatar()}>
                    <Animated.View style={[
                        {
                            transform: [{ scale: scaleValue }],
                        },
                    ]}>
                        <Avatar.Image size={33} source={{
                            cache: "force-cache",
                            uri: "https://cdn.trenderapp.com/profile_avatars/227796574762303490/ddYac_ilwHqwrwN-l4UvbSdMDzcuFZXeNhP7PZeK2GCZ49Pn0.jpg"
                        }} />
                    </Animated.View>
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