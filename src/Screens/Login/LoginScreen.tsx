import React, { useRef, useState } from 'react';
import { Animated, View, StyleSheet, Easing } from 'react-native';
import { HelperText, Icon, Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRealm } from '@realm/react';

import { convertFirstCharacterToUppercase, deviceInfo, LoginRootParamList, ScreenNavigationProps } from '../../Services';
import { useClient, useTheme } from '../../Components/Container';
import { LinkButtonText, NormalButton } from '../../Components/Elements/Buttons';
import { Loader } from '../../Other';
import Client from '../../Services/Client';
import { setStorage } from '../../Services/storage';
import { addUser } from '../../Services/Realm/userDatabase';
import LoginContainer from '../../Components/LoginContainer';
import { ShakeEffect } from '../../Components/Effects';

const LoginScreen = ({ navigation }: ScreenNavigationProps<LoginRootParamList, "LoginScreen">) => {

  const { colors } = useTheme();
  const { t } = useTranslation();
  const { client, setValue } = useClient();
  const allvalues = useClient();
  const realm = useRealm();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [error, setError] = useState({
    error: false,
    response: "",
  });
  const [users, setUsers] = useState({
    email: '',
    code: '',
  });

  const sendCode = async () => {
    if (loadingSendCode) return;
    if (!users.email) return setError({ error: true, response: t(`errors.verify_fields`) })

    setLoadingSendCode(true);
    const browser = await deviceInfo();

    let friendly_name = "Unknown Device";
    if (browser) friendly_name = `${convertFirstCharacterToUppercase(browser.base_os)} ${browser.system_version} - FlyAway mobile`;

    const response = await client.sessions.sendCode({
      email: users.email,
      device_name: friendly_name,
    })
    setLoadingSendCode(false)

    if (response.error || !response.data) return setError({ error: true, response: t(`errors.${response?.error?.code}`) })
    setError({ error: false, response: t(`login.email_code_send`) });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // Durée de l'animation en millisecondes
      easing: Easing.ease, // Utilisation de la fonction d'ease
      useNativeDriver: true,
    }).start();
    return setShowCode(true);
  }

  const handleSubmit = async () => {
    if (!users.email || !users.code) return setError({ error: true, response: t(`errors.verify_fields`) })

    setLoading(true);
    const response = await client.sessions.create({
      email: users.email.trim(),
      code: users.code.trim()
    })

    if (response.error || !response.data) {
      setLoading(false)
      return setError({ error: true, response: t(`errors.${response?.error?.code}`) })
    } else {

      const data = response.data;

      setStorage("user_info", data);
      addUser(realm, data);

      const new_client = new Client({
        token: data.token,
      })

      setValue({ ...allvalues, client: new_client, token: data.token, user: data, state: "loged" })
    }

  };

  return (
    <LoginContainer>
      <View style={style.section} />
      <Text style={{ color: error.error ? colors.warning_color : colors.color_green, textAlign: "center", marginBottom: 10 }}>{error.response}</Text>
      <View style={style.section}>
        <TextInput
          mode="outlined"
          placeholder="email@example.com"
          label={`${t("login.email")}`}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          value={users.email}
          onChangeText={(email) => setUsers({ ...users, email: email })}
        />
        <ShakeEffect shakeOnDisplay>
        <HelperText type="info" visible={true}><Icon source="information-outline" size={15} /> {t("login.passwordless_info")}</HelperText>
        </ShakeEffect>
        {
          !showCode && (
            <>
              <NormalButton onPress={() => sendCode()} text={t("login.send_email")} />
            </>
          )
        }
      </View>
      {
        showCode && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={style.section}>
              <TextInput
                mode="outlined"
                placeholder="Email code"
                label={`${t("login.code")}`}
                autoCapitalize="none"
                returnKeyType="next"
                value={users.code}
                onChangeText={(code) => setUsers({ ...users, code: code })}
              />
            </View>
            { loading ? <Loader /> : <NormalButton onPress={() => handleSubmit()} text={t("login.connect")} /> }
          </Animated.View>
        )
      }
      <View style={{
        alignSelf: 'center',
      }}>
        <LinkButtonText text={t("login.no_account")} onPress={() => navigation.navigate('RegisterEmailUsername')} />
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

export default LoginScreen;
