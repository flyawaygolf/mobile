import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';

import { useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { LoginRootParamList, ScreenNavigationProps } from '../../../Services';
import LoginContainer from '../../../Components/LoginContainer';

const RegisterPassword = ({
    navigation,
    route,
}: ScreenNavigationProps<LoginRootParamList, 'RegisterPassword'>) => {
    const { t } = useTranslation('');
    const { colors } = useTheme();
    const [showPass, setShowPass] = useState(true);
    const { params } = route;

    const [error, setError] = useState({
        error: false,
        response: '',
    });

    const [users, setUsers] = useState<{
        email: string;
        username: string;
        password: string;
        password2: string;
    }>({
        ...params,
        password: '',
        password2: '',
    });

    const handleSubmit = async () => {
        if (users.password !== users.password2)
            return setError({ error: true, response: t(`errors.different_password`) });
        if (users.password.length < 8)
            return setError({ error: true, response: t(`errors.password_security`) });

        navigation.push('RegisterBirthdayAccept', {
            email: users.email,
            username: users.username,
            password: users.password,
        });
    };

    return (
        <LoginContainer>
            <View style={style.section}> 
            </View>
            <View style={style.section}>
            <Text style={{ color: colors.warning_color, textAlign: 'center', marginBottom: 10 }}> {error.error && error.response} </Text>
                <PaperTextInput
                    mode="outlined"
                    label={`${t('login.password')}`}
                    autoCapitalize="none"
                    secureTextEntry={showPass}
                    returnKeyType="next"
                    right={
                        <PaperTextInput.Icon
                            onPress={() => setShowPass(!showPass)}
                            icon={!showPass ? `eye` : 'eye-off'}
                            color={colors.text_normal}
                        />
                    }
                    value={users.password}
                    onChangeText={password => setUsers({ ...users, password: password })}
                />
            </View>
            <View style={style.section}>
                <PaperTextInput
                    mode="outlined"
                    label={`${t('login.repeat_password')}`}
                    autoCapitalize="none"
                    secureTextEntry={showPass}
                    returnKeyType="next"
                    right={
                        <PaperTextInput.Icon
                            onPress={() => setShowPass(!showPass)}
                            icon={!showPass ? `eye` : 'eye-off'}
                            color={colors.text_normal}
                        />
                    }
                    value={users.password2}
                    onChangeText={password => setUsers({ ...users, password2: password })}
                />
            </View>
            <NormalButton onPress={() => handleSubmit()} text={t('commons.next')} />
            <View
                style={{
                    alignSelf: 'center',
                }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                    <LinkButtonText
                        text={t('login.go_back')}
                        onPress={() => navigation.goBack()}
                    />
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
});

export default RegisterPassword;
