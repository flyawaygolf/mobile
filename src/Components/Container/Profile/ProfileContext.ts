import * as React from 'react';
import { Animated } from 'react-native';
import { profileInformationsInterface } from '../../../Services/Client/Managers/Interfaces/User';

export interface ProfileContextI {
    scrollY: Animated.Value,
    setScrollY: (params: any) => {} | any,
    nickname: string,
    setNickname: (params: any) => {} | any,
    user_info: profileInformationsInterface,
    setUserInfo: (params: any) => {} | any,
}

export const profileContextPlaceholder: ProfileContextI = {
    scrollY: new Animated.Value(0),
    setScrollY: () => {},
    nickname: '',
    setNickname: () => {},
    user_info: {} as profileInformationsInterface,
    setUserInfo: () => {},
};

const ProfileContext = React.createContext<ProfileContextI>(profileContextPlaceholder);

ProfileContext.displayName = 'ProfileContext';

export default ProfileContext;
