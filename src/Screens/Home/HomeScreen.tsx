import { View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { ScreenContainer, useClient, useTheme } from "../../Components/Container";
import CustomHomeHeader from "../../Components/Home/CustomHomeHeader";
import styles from "../../Style/style";
import { navigationProps } from "../../Services";
import HomeNavigator from "./HomeNavigator";
import { RootState, useAppSelector } from "../../Redux";
import { userFlags } from "../../Services/Client";
import { ShrinkEffect } from "../../Components/Effects";

const HomeScreen = () => {

    const { colors } = useTheme();
    const navigation = useNavigation<navigationProps>();
    const { client, user } = useClient();
    const notifications = useAppSelector((state) => state.notificationFeed);

    const displayPremiumUpgrade = () => {
        const flags = client.user.flags(user.flags.toString());
        if (flags.has(userFlags.FLYAWAY_EMPLOYEE)) return false;
        if (flags.has(userFlags.PREMIUM_USER)) return false;
        if (flags.has(userFlags.PREMIUM_2_USER)) return false;
        if (flags.has(userFlags.FLYAWAY_PARTNER)) return false;
        return true;
      }      

    const CustomLeftComponent = () => {
        return (
          <View style={[styles.row, { justifyContent: "flex-end", marginRight: 10 }]}>
            {
              /*Platform.OS !== "ios" && displayPremiumUpgrade() && <Appbar.Action color={colors.text_normal} icon="account-arrow-up" onPress={() => navigation.navigate("SettingsStack", {
                screen: "SubscriptionScreen"
              })} />*/
            }
            <ShrinkEffect onPress={() => navigation.navigate("NotificationsScreen")} style={{ position: "relative" }}>
              <Appbar.Action color={colors.text_normal} icon="bell" onPress={() => navigation.navigate("NotificationsScreen")} />
              {notifications.filter(n => (n?.read ?? true) === false).length > 0 && (
                <View style={{
                  bottom: 5, right: 10, width: 20, height: 20, position: "absolute", backgroundColor: colors.badge_color, borderRadius: 60 / 2, flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <Text>{notifications.filter(n => (n?.read ?? true) === false || typeof n.read === "undefined").length}</Text>
                </View>
              )}
            </ShrinkEffect>
            <Appbar.Action color={colors.text_normal} icon="pencil" onPress={() => navigation.navigate("CreateStack", {
              screen: "PostCreatorScreen",
              params: {
                attached_post_id: "",
                initFiles: [],
                initContent: ""
              }
            })} />
          </View>
        )
      }

    return (
        <ScreenContainer>
            <CustomHomeHeader leftComponent={<CustomLeftComponent />} />
            <HomeNavigator />
        </ScreenContainer>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
      notificationFeed: state.notificationFeed
    };
  };
  
  
export default connect(mapStateToProps)(HomeScreen);
