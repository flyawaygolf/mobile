import { DrawerNavigationProp } from '@react-navigation/drawer';
import { loginRoutesNames } from '../Navigator/LoginNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';
import { MessageStackScreens } from '../Navigator/MessageStack';
import { SettingsStackScreens } from '../Navigator/SettingsStack';
import { ProfileStackScreens } from '../Navigator/ProfileStack';
import { GolfStackScreens } from '../Navigator/GolfsStack';
import { PostsStackScreens } from '../Navigator/PostsStack';
import { CreateStackScreens } from '../Navigator/CreateStack';
import { SinglePostInfoType } from '../Components/Posts/PostContext';

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
    PostsStack: {
        screen?: PostsStackScreens;
        params: {
            post_id?: string,
            query?: string;
        }
    };
    CreateStack: {
        screen: CreateStackScreens;
        params: {
            post_id?: string;
            shared_post?: SinglePostInfoType;
            attached_post?: SinglePostInfoType;
            attached_post_id?: string;
            initFiles?: string[];
            initContent?: string;
            type?: "photo" | "video",
            info?: {
                name: string;
                type: string;
                uri: string;
              }
        }
    };
    SelfProfileScreen: undefined;
};

export type ScreenNavigationProps<T extends ParamListBase, V extends keyof T> = StackScreenProps<T, V>

export type navigationProps = DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>
