import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRealm } from '@realm/react';

import { Logo } from '../../Components/Elements/Assets';
import { convertFirstCharacterToUppercase, deviceInfo, LoginRootParamList, ScreenNavigationProps } from '../../Services';
import { useClient, useTheme } from '../../Components/Container';
import { LinkButtonText, NormalButton } from '../../Components/Elements/Buttons';
import { CaptchaBlock, LoaderBox } from '../../Other';
import Client from '../../Services/Client';
import { setStorage } from '../../Services/storage';
import { addUser } from '../../Services/Realm/userDatabase';

const LoginScreen = ({ navigation }: ScreenNavigationProps<LoginRootParamList, "LoginScreen">) => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const { client, setValue } = useClient();
  const allvalues = useClient();
  const realm = useRealm();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [error, setError] = useState({
    error: false,
    response: ""
  });
  const [captcha, setCaptcha] = useState(false);
  const [users, setUsers] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async () => {
    if (!users.email || !users.password) return setError({ error: true, response: t(`errors.verify_fields`) })
    setCaptcha(true)
  };

  const onMessage = async (data: string) => {
    setCaptcha(false);

    if (data === "cancel") return;

    setLoading(true);

    const browser = await deviceInfo();

    let friendly_name;
    if (browser) {
      friendly_name = `${convertFirstCharacterToUppercase(browser.base_os)} ${browser.system_version} - FlyAway mobile`;

    } else {
      friendly_name = "Unknown Device";
    }

    const response = await client.sessions.create({
      email: users.email,
      password: users.password,
      device_name: friendly_name,
      captcha_code: data
    })

    if (response.error || !response.data) {
      setLoading(false)
      return setError({ error: true, response: t(`errors.${response?.error?.code}`) })

    } else {

      const data = response.data;      
      
      setStorage("user_info", data);
      addUser(realm, data);

      const new_client = new Client({
        token: data.token
      })

      setValue({ ...allvalues, client: new_client, token: data.token, user: data, state: "loged" })
    }
  };

  return (
    <SafeAreaView style={[style.area, { backgroundColor: colors.bg_primary }]}>
      <LoaderBox loading={loading} />
      <CaptchaBlock onMessage={onMessage} show={captcha} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={style.area}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <View>
            <View style={{ alignItems: 'center' }}>
              <Logo />
            </View>
            <View style={style.section}>
              <Text style={{ color: colors.warning_color, textAlign: "center" }}>{error.error && error.response}</Text>
            </View>
            <View style={style.section}>
              <TextInput
                label={`${t("login.email")}`}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                value={users.email}
                onChangeText={(email) => setUsers({ ...users, email: email })}
              />
            </View>
            <View style={style.section}>
              <TextInput
                label={`${t("login.password")}`}
                autoCapitalize="none"
                secureTextEntry={showPass}
                returnKeyType="next"
                right={<TextInput.Icon onPress={() => setShowPass(!showPass)} icon={!showPass ? `eye` : "eye-off"} />}
                value={users.password}
                onChangeText={(password) => setUsers({ ...users, password: password })}
              />
              <LinkButtonText text={t("login.forgot_password")} onPress={() => navigation.navigate('ForgotPassword')} />
            </View>
            <NormalButton onPress={() => handleSubmit()} text={t("login.connect")} />
            <View style={{
              alignSelf: 'center',
            }}>
              <LinkButtonText text={t("login.no_account")} onPress={() => navigation.navigate('RegisterEmailUsername')} />
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

export default LoginScreen;