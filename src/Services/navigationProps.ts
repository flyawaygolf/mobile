import { DrawerNavigationProp } from '@react-navigation/drawer';
import { loginRoutesNames } from '../Navigator/LoginNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

export type LoginRootParamList = {
    ForgotPassword: undefined;
    LoginScreen: undefined;
    RegisterEmailUsername: undefined;
    RegisterPassword: {
        email: string;
        username: string;
    };
    RegisterBirthdayAccept: {
        email: string;
        username: string;
        password: string;
    };
    RegisterVerification: {
        email: string;
    };
    DrawerNavigation: undefined;
}

export type RootStackParamList = {
    ProfileStack: {
        screen: string,
        params: {
            nickname?: string
            [x: string]: any;
        }
    };
    MapScreen: undefined;
    DrawerNavigation: undefined;
    Splash: undefined;
    LoginNavigator?: {
        screen: loginRoutesNames
    };
    ProfileEditScreen: undefined;
    MessagesStack: {
        screen?: "CreateGroupScreen" | "MessageScreen",
        params?: object;
    },
    SettingsStack: {
        screen?: "BlockScreen" | "SessionScreen" | "SecurityScreen"
    },
    RegisterVerificationCode: {
        code: string[] | false;
        [x: string]: any;
    };
    ChangePassword: {
        code: string[] | false;
        [x: string]: any;
    };
};

export type ScreenNavigationProps<T extends ParamListBase, V extends keyof T> = StackScreenProps<T, V>

export type navigationProps = DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>
