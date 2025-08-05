import { View } from "react-native";
import { Appbar, Banner, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import { ScreenContainer, useClient, useTheme } from "../../Components/Container";
import CustomHomeHeader from "../../Components/Home/CustomHomeHeader";
import styles from "../../Style/style";
import { navigationProps } from "../../Services";
import HomeNavigator from "./HomeNavigator";
import { RootState, useAppSelector } from "../../Redux";
import { ShrinkEffect } from "../../Components/Effects";
import { userFlags } from "../../Services/Client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const HomeScreen = () => {

  const { user, client } = useClient();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<navigationProps>();
  const notifications = useAppSelector((state) => state.notificationFeed);

  const [bannerVisible, setBannerVisible] = useState(false);

  /**
   * 
   * @returns true if not premium, false otherwise.
   * This function checks the user's flags to determine if they are a premium user or not.
   */
  const displayPremiumUpgrade = () => {
    const flags = client.user.flags(user.flags.toString());
    if (flags.has(userFlags.PREMIUM_USER)) return false;
    if (flags.has(userFlags.PREMIUM_2_USER)) return false;
    if (flags.has(userFlags.FLYAWAY_EMPLOYEE)) return false;
    if (flags.has(userFlags.FLYAWAY_PARTNER)) return false;
    return true;
  }

  useEffect(() => {
    if (displayPremiumUpgrade()) {
      setBannerVisible(false);
    } else {
      setBannerVisible(false);
    }
  }, [user.flags]);

  const CustomLeftComponent = () => {
    return (
      <View style={[styles.row, { justifyContent: "flex-end", marginRight: 10 }]}>
        {
          displayPremiumUpgrade() && <Button mode="outlined" textColor={colors.text_normal} onPress={() => navigation.navigate("SettingsStack", {
            screen: "PremiumScreen"
          })}>{t("premium.title")}</Button>
        }
        {
          /**
           *           displayPremiumUpgrade() && <Appbar.Action color={colors.text_normal} icon="account-arrow-up" onPress={() => navigation.navigate("SettingsStack", {

           */
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
      {
        displayPremiumUpgrade() && <Banner
          visible={bannerVisible}
          actions={[
            {
              icon: "close",
              label: 'Close',
              onPress: () => setBannerVisible(false),
            }
          ]}
          icon={"advertisements"}>
          There is ad space available here. Contact us to advertise your business.
        </Banner>
      }
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
