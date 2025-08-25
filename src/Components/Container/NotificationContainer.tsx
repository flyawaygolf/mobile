import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { useClient } from '.';
import SafeBottomContainer from './SafeBottomContainer';
import { readNotificationFeed } from '../../Redux/NotificationFeed/action';
import CustomHeader from '../Header/CustomHeader';

const NotificationContainer = ({ children }: React.PropsWithChildren) => {
    
    const { t } = useTranslation();
    const { client } = useClient();
    const dispatch = useDispatch();

    const ReadAll = async () => {
        await client.notifications.read();
        Toast.show({ text1: t(`commons.success`) as string })
        dispatch(readNotificationFeed())
    }

    return (  
        <SafeBottomContainer>
            <CustomHeader title={t("commons.notifications") as string} leftComponent={<IconButton icon="delete-sweep" onPress={() => ReadAll()}/>} />
            { children }
        </SafeBottomContainer>
    )
};

export default NotificationContainer;