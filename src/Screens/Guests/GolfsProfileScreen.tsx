import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import FastImage from '@d11/react-native-fast-image';

import { useClient, useTheme } from '../../Components/Container';
import { full_width } from '../../Style/style';
import { formatDistance, openURL } from '../../Services';
import { golfInterface } from '../../Services/Client/Managers/Interfaces/Golf';
import { Avatar } from '../../Components/Member';

type SectionProps = {
    golfInfo: golfInterface;
}

const GolfProfileScreen = ({ golfInfo }: SectionProps) => {
    const { t } = useTranslation();
    const { client } = useClient();
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ height: 150, backgroundColor: colors.bg_secondary }}>
                <FastImage source={{ uri: client.golfs.cover(golfInfo.golf_id) }} style={{ width: full_width, height: "100%", ...StyleSheet.absoluteFillObject }} />
            </View>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View style={{ justifyContent: "flex-start", flexDirection: "row" }}>
                    <Avatar
                        size={80}
                        style={{
                            borderColor: colors.bg_primary,
                            borderWidth: 3,
                            marginTop: -40,
                            marginLeft: 10,
                        }}
                        radius={8}
                        url={client.golfs.avatar(golfInfo.golf_id)}
                    />
                </View>
            </View>
            <Card style={{ margin: 5, marginTop: 10 }} mode="contained">
                <Card.Content>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                        {
                            golfInfo.holes && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.holes")}</Text>
                                    <Text>{golfInfo.holes}</Text>
                                </View>
                            )
                        }
                        {
                            golfInfo.scorecards?.[0]?.grid?.[0]?.par && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.par")}</Text>
                                    <Text>{golfInfo.scorecards[0].grid[0].par.reduce((sum, hole) => sum + (typeof hole === 'number' ? hole : 0), 0)}</Text>
                                </View>
                            )
                        }
                        {
                            golfInfo.yearBuilt && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.year_built")}</Text>
                                    <Text>{golfInfo.yearBuilt}</Text>
                                </View>
                            )
                        }
                        {
                            golfInfo.city && golfInfo.country && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.location")}</Text>
                                    <Text>{golfInfo.city}, {golfInfo.country}</Text>
                                </View>
                            )
                        }
                        {
                            golfInfo.golfTypes && golfInfo.golfTypes.length > 0 && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.types")}</Text>
                                    <Text>{golfInfo.golfTypes.map((type) => t(`golf.${type}`))}</Text>
                                </View>
                            )
                        }
                        {
                            golfInfo.architect && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.architect")}</Text>
                                    <Text>{golfInfo.architect}</Text>
                                </View>
                            )
                        }
                        {
                            golfInfo.distance && (
                                <View>
                                    <Text style={{ fontWeight: '900' }}>{t("golf.distance")}</Text>
                                    <Text>{formatDistance(golfInfo.distance)}km</Text>
                                </View>
                            )
                        }
                    </View>
                </Card.Content>
                <Card.Actions>
                    {
                        golfInfo.email && (
                            <Button mode='contained' icon={"email-fast"} onPress={() => Linking.openURL(`mailto:${golfInfo.email}`)}>
                                {t("golf.email")}
                            </Button>
                        )
                    }
                    {
                        golfInfo.phone && (
                            <Button mode='contained' icon={"phone"} onPress={() => Linking.openURL(`tel:${golfInfo.phone}`)}>
                                {t("golf.phone")}
                            </Button>
                        )
                    }
                    {
                        golfInfo.website && (
                            <Button mode='contained' icon={"web"} onPress={() => openURL(golfInfo.website)}>
                                {t("golf.website")}
                            </Button>
                        )
                    }
                </Card.Actions>
            </Card>
        </View>
    );
};


export default GolfProfileScreen;
