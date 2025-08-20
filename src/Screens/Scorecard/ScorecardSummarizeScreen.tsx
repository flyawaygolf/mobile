import { useTranslation } from "react-i18next";
import { SafeBottomContainer, useClient, useTheme } from "../../Components/Container";
import { Text, Button, Appbar, IconButton, List, Icon } from "react-native-paper";
import { useState } from "react";
import { navigationProps, ScorecardStackParams, ScreenNavigationProps } from "../../Services";
import { ScrollView, View, Modal, Dimensions } from "react-native";
import { full_width } from "../../Style/style";
import { Avatar } from "../../Components/Member";
import { useNavigation } from "@react-navigation/native";

const ScorecardSummarizeScreen = ({ route }: ScreenNavigationProps<ScorecardStackParams, "ScorecardSummarizeScreen">) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { client } = useClient();
    const navigation = useNavigation<navigationProps>();
    const { golf, scorecard, grid, holes, name } = route.params;



    return (
        <SafeBottomContainer>
            <Appbar.Header style={{
                width: full_width,
                borderBottomColor: colors.bg_secondary,
                borderBottomWidth: 1,
                marginBottom: 10,
                paddingLeft: 15,
                paddingRight: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Appbar.Action icon="home" onPress={() => navigation.navigate("BottomNavigation", {
                        screen: "ScorecardHomeScreen"
                    })} />
                    <Avatar url={client.golfs.avatar(golf.golf_id)} />
                    <View>
                        <Text variant="titleMedium">{golf.name}</Text>
                        <Text>{name}</Text>
                    </View>
                </View>
            </Appbar.Header>
<View>
    <Text>Oui</Text>
</View>
        </SafeBottomContainer>
    );
};

export default ScorecardSummarizeScreen;