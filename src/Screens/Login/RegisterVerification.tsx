import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { LoginRootParamList, ScreenNavigationProps } from "../../Services";
import { useTheme } from "../../Components/Container";

function RegisterVerification({ navigation, route }: ScreenNavigationProps<LoginRootParamList, "RegisterVerification">) {

    const { t } = useTranslation()
    const { colors } = useTheme();
    const [email, setEmail] = useState("")

    useEffect(() => {
        setEmail(route?.params?.email ?? "")
    }, [])

    return (
        <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
            <Text>{t("login.email_verif_link_send", {
                email: email,
            })}</Text>
            <Button onPress={() => navigation.replace("LoginScreen")}>{t("commons.next")}</Button>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    area: {
      flex: 1,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
  })

export default RegisterVerification;
