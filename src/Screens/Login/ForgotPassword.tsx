import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../Components/Container";
import { NormalButton } from "../../Components/Elements/Buttons";
import { Text, TextInput } from "react-native-paper";

import { LoaderBox } from "../../Other";
import CustomHeader from "../../Components/Header/CustomHeader";
import { axiosInstance, EmailValidator, LoginRootParamList, ScreenNavigationProps } from "../../Services";

function ForgotPassword({ navigation }: ScreenNavigationProps<LoginRootParamList, "ForgotPassword">) {

    const { t } = useTranslation('')
    const { colors } = useTheme();

    const [email, setEmail] = useState("")
    const [error, setError] = useState({
        error: false,
        response: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (loading) return;
        if (!EmailValidator(email)) return setError({ error: true, response: t(`errors.verify_fields`) });

        setLoading(true)

        const request = await axiosInstance.get(`/security/recovery?type=password&query=${email}`);
        const response = await request.data;

        if (response.error) {
            setLoading(false)
            return setError({ error: true, response: t(`errors.${response.error.code}`) })

        } else {

            setLoading(false)
            navigation.replace('RegisterVerification', {
                email: email,
            });
        }
    };

    return (
        <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
            <CustomHeader title={"Forgot Password"} />
            <LoaderBox loading={loading} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}>
                <ScrollView style={{ marginTop: 30 }}>
                    <View>
                        <Text style={{ color: colors.warning_color, textAlign: "center" }}>{error.error && error.response}</Text>
                        <View style={style.section}>
                            <TextInput
                                label={`${t("login.email")}`}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                value={email}
                                onChangeText={(text: string) => setEmail(text)}
                            />
                            <NormalButton onPress={() => handleSubmit()} text={"Send recovery link"} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
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

export default ForgotPassword;
