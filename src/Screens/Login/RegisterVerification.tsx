import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { LoginRootParamList, ScreenNavigationProps } from "../../Services";
import LoginContainer from "../../Components/LoginContainer";
import { NormalButton } from "../../Components/Elements/Buttons";

function RegisterVerification({ navigation, route }: ScreenNavigationProps<LoginRootParamList, "RegisterVerification">) {

    const { t } = useTranslation()
    const [email, setEmail] = useState("")

    useEffect(() => {
        setEmail(route?.params?.email ?? "")
    }, [])

    return (
        <LoginContainer>
            <View style={style.section}>
            </View>
            <View style={style.section}>
                <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Text variant='headlineMedium' style={{ fontWeight: "bold" }}>{t("login.verify_email")}</Text>
                    <Text variant='headlineSmall'>{t("login.email_verif_link_send", {
                        email: email,
                    })}</Text>
                </View>
                <NormalButton onPress={() => navigation.replace("LoginScreen")} text={t('login.return_to_login')} />
            </View>
        </LoginContainer>
    )
}

const style = StyleSheet.create({
    area: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    section: {
        flexDirection: 'column',
        minHeight: 60,
        marginTop: 5,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
    },
})

export default RegisterVerification;
