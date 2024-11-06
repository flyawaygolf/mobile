import React, { useState } from 'react';

import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Screens/Login/LoginScreen';
import ForgotPassword from '../Screens/Login/ForgotPassword';
import { RegisterBirthdayAccept, RegisterEmailUsername, RegisterPassword } from '../Screens/Login/Register';
import RegisterVerification from '../Screens/Login/RegisterVerification';
import { LoginRootParamList, ScreenNavigationProps } from '../Services';

const Stack = createStackNavigator();

export type loginRoutesNames =
    "LoginScreen" |
    "ForgotPassword" |
    "RegisterEmailUsername" |
    "RegisterPassword" |
    "RegisterBirthdayAccept" |
    "RegisterVerification"

function LoginNavigator() {

    const [routes] = useState<Array<{
        name: string;
        component: ({ navigation }: ScreenNavigationProps<LoginRootParamList, any>) => React.JSX.Element
    }>>([
        { name: "LoginScreen", component: LoginScreen },
        { name: "ForgotPassword", component: ForgotPassword },
        { name: "RegisterEmailUsername", component: RegisterEmailUsername },
        { name: "RegisterPassword", component: RegisterPassword },
        { name: "RegisterBirthdayAccept", component: RegisterBirthdayAccept },
        { name: "RegisterVerification", component: RegisterVerification },
    ])

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LoginScreen">
            {
                routes.map((r, idx) => <Stack.Screen key={idx} name={r.name} component={r.component} options={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }} />)
            }
        </Stack.Navigator>
    )
}

export default LoginNavigator;
