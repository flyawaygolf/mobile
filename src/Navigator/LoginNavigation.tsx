import React, { useEffect, useState } from 'react';

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import ForgotPassword from '../Screens/Login/ForgotPassword';
import { RegisterBirthdayAccept, RegisterEmailUsername, RegisterPassword } from '../Screens/Login/Register';
import RegisterVerification from '../Screens/Login/RegisterVerification';
import { LoginRootParamList, navigationProps, parseURL, ScreenNavigationProps } from '../Services';
import WelcomeScreen from '../Screens/Login/WelcomeScreen';
import { Linking } from 'react-native';

const Stack = createStackNavigator();

export type loginRoutesNames =
    "WelcomeScreen" |
    "LoginScreen" |
    "ForgotPassword" |
    "RegisterEmailUsername" |
    "RegisterPassword" |
    "RegisterBirthdayAccept" |
    "RegisterVerification";

function LoginNavigator({ navigation }: { navigation: navigationProps }) {

    const [routes] = useState<Array<{
        name: string;
        component: ({ navigation }: ScreenNavigationProps<LoginRootParamList, any>) => React.JSX.Element
    }>>([
        { name: "WelcomeScreen", component: WelcomeScreen },
        { name: "LoginScreen", component: LoginScreen },
        { name: "ForgotPassword", component: ForgotPassword },
        { name: "RegisterEmailUsername", component: RegisterEmailUsername },
        { name: "RegisterPassword", component: RegisterPassword },
        { name: "RegisterBirthdayAccept", component: RegisterBirthdayAccept },
        { name: "RegisterVerification", component: RegisterVerification },
    ])

        const navigateToRegister = async (affiliate_to?: string) => {
        return navigation.navigate("LoginNavigator", { screen: "RegisterEmailUsername", params: { affiliate_to: affiliate_to } })
    }

        const redirectLink = (url: string | false) => {
            if (typeof url !== "string") return;
            if (url.startsWith("/account/register")) {
                const affiliateParam = url.split("?affiliate_to=")[1];
                if (affiliateParam) {
                    return navigateToRegister(affiliateParam);
                }
                return navigateToRegister();
            }
            return;
        }
    
        const getUrlAsync = async () => {
            const initialUrl = await Linking.getInitialURL();
            if (!initialUrl) return;
            const param = parseURL(initialUrl);
            return redirectLink(param);
        };

            useEffect(() => {
                getUrlAsync();
                Linking.addEventListener("url", ({ url }) => redirectLink(parseURL(url)));
            }, [])

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="WelcomeScreen">
            {
                routes.map((r, idx) => <Stack.Screen key={idx} name={r.name} component={r.component} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />)
            }
        </Stack.Navigator>
    )
}

export default LoginNavigator;
