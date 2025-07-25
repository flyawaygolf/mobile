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
import { BottomStackScreens } from '../Navigator/BottomNavigation';
import { EventStackScreens } from '../Navigator/EventStack';
import { SubscriptionInterface } from './Client/Managers/Interfaces';
import { ScorecardStackScreens } from '../Navigator/ScorecardStack';
import { eventsInterface } from './Client/Managers/Interfaces/Events';
import { golfInterface } from './Client/Managers/Interfaces/Golf';
import { PremiumStackScreens } from '../Navigator/PremiumStack';
import { GuestStackScreens } from '../Navigator/GuestStack';

export type LoginRootParamList = {
    WelcomeScreen: undefined;
    ForgotPassword: undefined;
    LoginScreen?: {
        email?: string;
    };
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
    GuestStack: undefined;
    DrawerNavigation: undefined;
}

export type ProfileStackParams = {
    ProfileScreen: {
        nickname: string;
    };
    ProfileEditScreen: undefined;
    ProfileFollower: {
        nickname: string;
        type: "subscribers" | "subscriptions";
    };
}

export type GolfsStackParams = {
    GolfsProfileScreen: {
        golf_id: string;
    };
    GolfsPlayedScreen: undefined;
    LittleMapScreen: {
        longitude: number;
        latitude: number;
        golf_id?: string;
    };
}

export type ScorecardStackParams = {
    ScorecardHomeScreen: undefined;
    ScorecardCreateScreen: {
        golf_id: string;
    };
}

export type RootStackParamList = {
    DrawerNavigation: undefined;
    ScorecardStack: {
        screen: ScorecardStackScreens;
        params?: object;
    };
    ProfileStack: {
        screen: ProfileStackScreens,
        params?: {
            nickname?: string;
            type?: "subscribers" | "subscriptions";
        };
    };
    NotificationsScreen: undefined;
    FavoritesScreen: undefined;
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
        screen?: SettingsStackScreens;
        params?: {
            subscription?: SubscriptionInterface.getSubscriptionsResponseInterface;
        };
    },
    RegisterVerificationCode: {
        code: string | false;
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
            target_id?: string;
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
            },
            attached_event?: eventsInterface;
            attached_golf?: golfInterface;
        }
    };
    EventStack: {
        screen: EventStackScreens;
        params?: {
            event_id?: string;
        }
    };
    PremiumStack: {
        screen: PremiumStackScreens;
    }
    GuestStack: {
        screen: GuestStackScreens;
    };
    BottomNavigation: {
        screen: BottomStackScreens;
        params?: {
            initial_location: {
                longitude: number;
                latitude: number;
            }
        }
    };
};

export type ScreenNavigationProps<T extends ParamListBase, V extends keyof T> = StackScreenProps<T, V>

export type navigationProps = DrawerNavigationProp<RootStackParamList, 'DrawerNavigation'>
