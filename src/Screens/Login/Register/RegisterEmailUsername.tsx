import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

import { useClient, useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import LoginContainer from '../../../Components/LoginContainer';
import { Loader } from '../../../Other';
import { EmailValidator, LoginRootParamList, ScreenNavigationProps } from '../../../Services';

const RegisterEmailUsername = ({ navigation, route }: ScreenNavigationProps<LoginRootParamList, 'RegisterEmailUsername'>) => {
  const { t } = useTranslation('');
  const { colors } = useTheme();
  const { client } = useClient();

  const { affiliate_to } = route.params;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    response: '',
  });
  const [users, setUsers] = useState({
    email: '',
    username: '',
  });

  const handleSubmit = async () => {
    if (loading) return setError({ error: true, response: t(`errors.sending_form`) });

    if (!users.email || !users.username) return setError({ error: true, response: t(`errors.verify_fields`) });

    if (
      !EmailValidator(users.email) ||
      users.username.length > 30 ||
      users.username.length < 3
    )
      return setError({ error: true, response: t(`errors.verify_fields`) });

    setLoading(true);

    const response = await client.user.verifyEmail(users.email);

    if (response.error) {
      setLoading(false);
      return setError({
        error: true,
        response: t(`errors.${response.error.code}`),
      });
    } else {
      setLoading(false);
      navigation.navigate('RegisterPassword', {
        affiliate_to: affiliate_to,
        email: users.email,
        username: users.username,
      });
    }
  };

  return (
    <LoginContainer>
      <View style={style.section}>
      </View>
      <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontWeight: "bold" }} variant='headlineMedium'>{t("login.create_account")}</Text>
        <Text variant='headlineMedium'>{t("login.to_get_started_now")}</Text>
      </View>
      <View style={style.section}>
        <Text style={{ color: colors.warning_color, textAlign: 'center', marginBottom: 10 }}> {error.error && error.response} </Text>
        <TextInput
          mode="outlined"
          label={`${t('login.email')}`}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          value={users.email}
          onChangeText={email => setUsers({ ...users, email: email })}
        />
      </View>
      <View style={style.section}>
        <TextInput
          mode="outlined"
          label={`${t('login.username')}`}
          autoCapitalize="none"
          returnKeyType="next"
          value={users.username}
          onChangeText={text => setUsers({ ...users, username: text })}
        />
      </View>
      {
        affiliate_to && (
          <View style={style.section}>
            <TextInput
              style={{ marginBottom: 10 }}
              label={`${t("login.affiliation_code")}`}
              autoCapitalize="none"
              returnKeyType="next"
              disabled={!!affiliate_to}
              value={affiliate_to ?? ""}
            />
          </View>
        )
      }
      {loading ? <Loader /> : <NormalButton onPress={() => handleSubmit()} text={t('commons.next')} />}
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
            text={t('login.already_account')}
            onPress={() => navigation.replace('LoginScreen')}
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

export default RegisterEmailUsername;
