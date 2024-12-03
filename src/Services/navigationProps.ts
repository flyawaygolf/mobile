import { DrawerNavigationProp } from '@react-navigation/drawer';
import { loginRoutesNames } from '../Navigator/LoginNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { MessageStackScreens } from '../Navigator/MessageStack';
import { SettingsStackScreens } from '../Navigator/SettingsStack';
import { userInfo } from './Client/Managers/Interfaces/Global';
import { golfInterface } from './Client/Managers/Interfaces/Search';
import { ProfileStackScreens } from '../Navigator/ProfileStack';
import { GolfStackScreens } from '../Navigator/GolfsStack';

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

export type ProfileStackParams = {
    ProfileScreen: {
        user_id: string;
    };
    ProfileEditScreen: undefined;
}

export type GolfsStackParams = {
    GolfsProfileScreen: {
        golf_id: string;
    };
}


export type RootStackParamList = {
    MapScreen: undefined;
    DrawerNavigation: undefined;
    ProfileStack: {
        screen: ProfileStackScreens,
        params?: object;
    };
    GolfsStack: {
        screen: GolfStackScreens,
        params?: object;
    };
    Splash: undefined;
    LoginNavigator?: {
        screen: loginRoutesNames
    };
    ProfileEditScreen: undefined;
    MessagesStack: {
        screen?: MessageStackScreens
        params?: object;
    },
    SettingsStack: {
        screen?: SettingsStackScreens
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
