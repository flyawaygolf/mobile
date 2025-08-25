import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { Text, Checkbox, TextInput, HelperText, Icon } from 'react-native-paper';

import { useClient, useTheme } from '../../../Components/Container';
import { ShakeEffect } from '../../../Components/Effects';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { DateInput } from '../../../Components/Elements/Input';
import LoginContainer from '../../../Components/LoginContainer';
import { Loader } from '../../../Other';
import { cguLink, LoginRootParamList, openURL, ScreenNavigationProps } from '../../../Services';
import styles from '../../../Style/style';

const RegisterBirthdayAccept = ({ navigation, route }: ScreenNavigationProps<LoginRootParamList, "RegisterBirthdayAccept">) => {

    const { t, i18n } = useTranslation('')
    const { colors } = useTheme();
    const { client } = useClient();
    const { params } = route;
    const max_birthday = dayjs().subtract(13, "years").format("YYYY-MM-DD");
    const min_birthday = dayjs().subtract(100, "years").format("YYYY-MM-DD");

    const [error, setError] = useState({
        error: false,
        response: "",
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState({
        ...params,
        birthday: dayjs().subtract(13, "years").subtract(1, 'day').toDate(),
        accept_tas: false,
    });
    const [affiliationCode, setAffiliationCode] = useState<string | undefined>(params.affiliate_to);

    const handleSubmit = async () => {

        if (loading) return setError({ error: true, response: t(`errors.sending_form`) })

        if (!users.accept_tas || !users.birthday) return setError({ error: true, response: t(`errors.verify_fields`) });

        const birthday = users.birthday;

        if (dayjs(birthday).isBefore(min_birthday) || dayjs(birthday).isAfter(max_birthday)) return setError({ error: true, response: t(`errors.4`) });

        setLoading(true)

        const response = await client.user.register({
            email: users.email.toLowerCase().trim(),
            username: users.username,
            password: users.password,
            birthday: users.birthday,
            affiliation_code: affiliationCode,
        });

        if (response.error) {
            setLoading(false)
            return setError({ error: true, response: t(`errors.${response.error.code}`) })

        } else {

            setLoading(false)
            navigation.replace('RegisterVerification', {
                email: users.email,
            });
        }
    };

    return (
        <LoginContainer>
            <View style={style.section}>
            </View>
            <View style={style.section}>
                <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center" }}>
                    <Text variant='headlineMedium' style={{ fontWeight: "bold" }}>{t("login.last_step")}</Text>
                </View>
                <Text style={{ color: colors.warning_color, textAlign: "center", marginBottom: 10 }}>{error.error && error.response}</Text>
                <TextInput
                    style={{ marginBottom: 10 }}
                    label={`${t("login.affiliation_code")}`}
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={affiliationCode ?? ""}
                    onChangeText={(text) => setAffiliationCode(text)}
                />
                <ShakeEffect shakeOnDisplay>
                    <HelperText type="info" visible={true}><Icon source="information-outline" size={15} /> {t("login.affiliate_code_info")}</HelperText>
                </ShakeEffect>
                <DateInput onChange={(date) => setUsers({ ...users, birthday: date })} minimumDate={new Date(min_birthday)} value={users?.birthday} label={t("login.birthday")} />
                <View style={styles.row}>
                    <Checkbox.Android status={users.accept_tas ? "checked" : "unchecked"} onPress={() => setUsers({ ...users, accept_tas: !users.accept_tas })} />
                    <LinkButtonText text={t("login.t_and_s")} onPress={() => {
                        setUsers({ ...users, accept_tas: !users.accept_tas })
                        openURL(cguLink(i18n.language))
                    }} />
                </View>
            </View>
            {loading ? <Loader /> : <NormalButton onPress={() => handleSubmit()} text={t("login.register")} />}
            <View style={{
                alignSelf: 'center',
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: "space-between",
                }}>
                    <LinkButtonText text={t("login.go_back")} onPress={() => navigation.goBack()} />
                </View>
            </View>
        </LoginContainer>
    );
};

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

export default RegisterBirthdayAccept;
