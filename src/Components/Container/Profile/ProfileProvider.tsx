import React, { useState } from 'react';
import ProfileContext from './ProfileContext';
import { Animated } from 'react-native';
import { profileInformationsInterface } from '../../../Services/Client/Managers/Interfaces/User';

type SectionProps = React.PropsWithChildren<{}>

function ProfileProvider({ children }: SectionProps) {

    const [scrollY, setScrollY] = useState(new Animated.Value(0));
    const [nickname, setNickname] = useState('');
    const [user_info, setUserInfo] = useState<profileInformationsInterface>({} as profileInformationsInterface);

    return (
        <ProfileContext.Provider value={{ scrollY, setScrollY, nickname, setNickname, setUserInfo, user_info }}>
            {children}
        </ProfileContext.Provider>
    );
}

export default ProfileProvider;
