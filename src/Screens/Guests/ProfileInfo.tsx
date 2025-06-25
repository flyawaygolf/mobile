import React, { useState } from 'react';
import { Animated, StyleSheet, View } from "react-native";
import { Badge, Card, Icon, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import { handleToast } from "../../Services";
import { displayHCP } from "../../Services/handicapNumbers";
import { userFlags } from '../../Services/Client';
import FastImage from '@d11/react-native-fast-image';
import { availabilityDefault, premiumAdvantages } from '../../Services/premiumAdvantages';
import { ShrinkEffect } from '../../Components/Effects';
import ShowAvailability from '../../Components/Premium/ShowAvalability';
import { Avatar } from '../../Components/Member';
import { useClient, useTheme } from '../../Components/Container';
import { userInfo } from '../../Services/Client/Managers/Interfaces/Global';

type ProfileInfoProps = {
    user_info: userInfo;
}

const ProfileInfo = ({ user_info }: ProfileInfoProps) => {

    const { client } = useClient();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [flags] = useState(client.user.flags(user_info.flags.toString()));
    const [schedule] = useState(user_info.premium_settings?.availability || availabilityDefault);

    const copyNickname = () => {
        Clipboard.setString(user_info.nickname);
        handleToast(t("commons.success"));
    }

    const showBadgeName = (badge: string) => {
        handleToast(t(`badges.${badge}`));
    }

    return (
        <Animated.View>
            <View style={{ height: 125 }}>
                <View style={[styles.banner_image]}>
                    {
                        user_info.banner ? <FastImage style={[styles.banner_image, { backgroundColor: user_info.accent_color }]} source={{ uri: `${client.user.banner(user_info.user_id, user_info.banner)}` }} /> : <View style={[styles.banner_image, { backgroundColor: user_info.accent_color }]} />
                    }
                </View>
            </View>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                    <Avatar
                        size={80}
                        style={{
                            borderRadius: 80 / 2,
                            borderColor: colors.bg_primary,
                            borderWidth: 3,
                            marginTop: -40,
                            marginLeft: 10,
                            backgroundColor: colors.bg_secondary,
                        }}
                        url={`${client.user.avatar(user_info.user_id, user_info.avatar)}`}
                    />
                    <Badge size={20} style={{ marginLeft: -30 }}>{displayHCP(user_info.golf_info.handicap)}</Badge>
                    <View style={{ marginLeft: 10, marginTop: 5, flexDirection: "row", alignItems: "center", gap: 5 }}>
                        {flags.has(userFlags.FLYAWAY_EMPLOYEE) && <ShrinkEffect onPress={() => showBadgeName("FLYAWAY_EMPLOYEE")}><Text><Icon source="shield-check" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {flags.has(userFlags.EARLY_SUPPORTER) && <ShrinkEffect onPress={() => showBadgeName("EARLY_SUPPORTER")}><Text><Icon source="account-star" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {user_info.premium_type > 0 && <ShrinkEffect onPress={() => showBadgeName("PREMIUM_USER")}><Text><Icon source="star-shooting" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {flags.has(userFlags.VERIFIED_USER) && <ShrinkEffect onPress={() => showBadgeName("VERIFIED_USER")}><Text><Icon source="check-decagram" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                        {flags.has(userFlags.FLYAWAY_PARTNER) && <ShrinkEffect onPress={() => showBadgeName("FLYAWAY_PARTNER")}><Text><Icon source="infinity" color={colors.fa_primary} size={18} /></Text></ShrinkEffect>}
                    </View>
                </View>
            </View>
            <Card style={{ margin: 5, marginTop: 10 }} mode="contained">
                <Card.Title
                    titleStyle={{
                        fontWeight: 800,
                    }}
                    subtitleStyle={{
                        fontWeight: 500,
                    }}
                    left={() => <IconButton mode="contained" icon="content-copy" onPress={() => copyNickname()} />}
                    titleVariant="titleLarge"
                    subtitleVariant="labelLarge"
                    title={user_info.username}
                    subtitle={`@${user_info.nickname}`}
                />

            </Card>
            <Card style={{ margin: 5 }} mode="contained">
                <Card.Content>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={{ fontWeight: '900' }}>{t("profile.description")}</Text>
                        <Text>{user_info.description}</Text>
                    </View>
                </Card.Content>
            </Card>
            {
                premiumAdvantages(user_info.premium_type, user_info.flags).showAvailability() && user_info.premium_settings?.show_availability && (
                    <Card style={{ margin: 5 }} mode="contained">
                        <Card.Content>
                            <Text variant="titleMedium">{t("premium.availability_title")}</Text>
                            <ShowAvailability schedule={schedule} />
                        </Card.Content>
                    </Card>
                )
            }
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    banner_image: {
        width: "100%",
        height: '100%',
        ...StyleSheet.absoluteFillObject,
    },
    column: {
        flex: 1,
        flexDirection: "column",
        alignItems: 'center'
    },
});

export default ProfileInfo;