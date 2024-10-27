import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, SafeAreaView, StyleSheet, } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';

import { useClient, useTheme } from '../../../Components/Container';
import { LinkButtonText, NormalButton } from '../../../Components/Elements/Buttons';
import { Logo } from '../../../Components/Elements/Assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EmailValidator, LoginRootParamList, ScreenNavigationProps } from '../../../Services';
import { LoaderBox } from '../../../Other';

const RegisterEmailUsername = ({ navigation }: ScreenNavigationProps<LoginRootParamList, "RegisterEmailUsername">) => {

  const { t } = useTranslation('')
  const { colors } = useTheme();
  const { client } = useClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    response: ""
  });
  const [users, setUsers] = useState({
    email: "",
    username: "",
  });

  const handleSubmit = async () => {

    if (loading) return setError({ error: true, response: t(`errors.sending_form`) })

    if (!users.email || !users.username) return setError({ error: true, response: t(`errors.verify_fields`) });

    if (!EmailValidator(users.email) || users.username.length > 30 || users.username.length < 3) return setError({ error: true, response: t(`errors.verify_fields`) });

    setLoading(true)

    const response = await client.user.verifyEmail(users.email);

    if (response.error) {
      setLoading(false)
      return setError({ error: true, response: t(`errors.${response.error.code}`) })

    } else {
      setLoading(false)
      navigation.push('RegisterPassword', {
        email: users.email,
        username: users.username
      });
    }
  };

  return (
    <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
      <LoaderBox loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <View>
            <View style={{ alignItems: 'center' }}>
              <Logo />
            </View>
            <View style={style.section}>
              <Text style={{ color: colors.warning_color, textAlign: "center" }}>{error.error && error.response}</Text>
            </View>
            <View style={style.section}>
              <PaperTextInput
                label={`${t("login.email")}`}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={users.email}
                onChangeText={(email) => setUsers({ ...users, email: email })}
              />
            </View>
            <View style={style.section}>
              <PaperTextInput
                label={`${t("login.username")}`}
                autoCapitalize="none"
                returnKeyType="next"
                value={users.username}
                onChangeText={(text) => setUsers({ ...users, username: text })}
              />
            </View>
            <NormalButton onPress={() => handleSubmit()} text={t("commons.next")} />
            <View style={{
              alignSelf: 'center',
            }}>
              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: "space-between"
              }}>
                <LinkButtonText text={t("login.already_account")} onPress={() => navigation.replace("LoginScreen")} />
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  area: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
  section: {
    flexDirection: 'column',
    minHeight: 60,
    marginTop: 5,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  }
})


export default RegisterEmailUsername;