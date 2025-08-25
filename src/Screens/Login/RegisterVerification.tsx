import React from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { NormalButton } from "../../Components/Elements/Buttons";
import LoginContainer from "../../Components/LoginContainer";
import { LoginRootParamList, ScreenNavigationProps } from "../../Services";

function RegisterVerification({ navigation, route }: ScreenNavigationProps<LoginRootParamList, "RegisterVerification">) {

    const { t } = useTranslation()

    return (
        <LoginContainer>
            <View style={style.section}>
            </View>
            <View style={style.section}>
                <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Text variant='headlineMedium' style={{ fontWeight: "bold" }}>{t("login.register_success")}</Text>
                </View>
                <NormalButton onPress={() => navigation.replace("LoginScreen", {
                    email: route?.params?.email ?? ""
                })} text={t('login.return_to_login')} />
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
