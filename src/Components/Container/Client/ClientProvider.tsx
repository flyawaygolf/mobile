import React, { useEffect, useState } from 'react';
import ClientContext, { clientContextPlaceholder } from './ClientContext';
import { DefaultTheme, Provider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useRealm } from '@realm/react';
import AwesomeIcon from '@react-native-vector-icons/material-design-icons';

import useTheme from '../Theme/useTheme';
import { addUser, deleteUser, getAllUsers } from './../../../Services/Realm/userDatabase';
import { getStorageInfo, initStorage, setStorage, settingsStorageI, userStorageI } from './../../../Services/storage';
import Client from '../../../Services/Client';
import { premiumAdvantages } from '../../../Services/premiumAdvantages';

type SectionProps = React.PropsWithChildren<{}>

function ClientProvider({ children }: SectionProps) {

    const [value, setValue] = useState(clientContextPlaceholder);
    const { setTheme, colors } = useTheme();
    const { i18n } = useTranslation();

    const realm = useRealm();

    const connectToNewUser = async (user_id?: string) => {

        if (user_id) deleteUser(realm, user_id);

        const users = getAllUsers(realm);

        if (users.length < 1) return setValue({ ...value, state: "logout" });
        const user_info = users[0];
        setValue({
            ...value,
            state: "loading",
        })

        const settings = getStorageInfo("settings") as settingsStorageI;

        const new_client = new Client({
            token: user_info.token,
            autoTranslate: settings?.auto_translate ?? false
        })

        const informations = await new_client.user.myinformations();
        if (informations.data) {
            setStorage("user_info", informations.data)
            const advantages = premiumAdvantages(informations.data.premium_type, informations.data.flags);
            if (!advantages.translatePosts()) setStorage("settings", { ...settings, auto_translate: false });

            return setValue({
                ...value, client: new_client, token: user_info.token, user: informations.data, state: "loged", location: {
                    latitude: informations.data.golf_info.location.latitude,
                    longitude: informations.data.golf_info.location.longitude,
                    latitudeDelta: 0.5,
                    longitudeDelta: 0.5,
                }
            })
        } else return setValue({ ...value, state: "logout" });
    }

    const connectToToken = async (user_info: userStorageI) => {
        const settings = getStorageInfo("settings") as settingsStorageI;

        const client = new Client({
            token: user_info?.token ?? "",
            autoTranslate: settings?.auto_translate ?? false
        });

        const user = await client.user.myinformations();
        if (user.error || !user.data) return await connectToNewUser(user_info?.user_id);
        const informations = user.data;       

        addUser(realm, informations);

        return setValue({
            ...value, client: client, token: user_info?.token ?? "", user: informations, state: "loged", location: {
                latitude: informations.golf_info.location.latitude,
                longitude: informations.golf_info.location.longitude,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            }
        })
    }

    async function splash() {
        const { settings, user_info } = await initStorage();

        if (settings) {
            if (settings?.theme) setTheme(settings.theme);
            if (settings?.locale) i18n.changeLanguage(settings.locale);
        }

        if (Platform.OS === "ios") {
            const trackPermission = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
            if (trackPermission === RESULTS.DENIED || trackPermission === RESULTS.LIMITED) await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
        }

        if (!user_info) return await connectToNewUser();

        const user_token = user_info?.token;
        if (!user_token) return await connectToNewUser();

        return await connectToToken(user_info);
    }

    useEffect(() => {
        if (value.state === "switch_user") {
            splash()
        }
    }, [value.state])

    useEffect(() => {
        splash();
    }, [realm]);

    return (
        <ClientContext.Provider value={{ ...value, setValue }}>
            <Provider
                settings={{
                    icon: (props) => <AwesomeIcon {...props} />,
                }}
                theme={{
                    ...DefaultTheme,
                    version: 3,
                    colors: {
                        'backdrop': 'rgba(50, 47, 55, 0.4)',
                        'background': colors.bg_primary,
                        'elevation': {
                            'level0': 'transparent',
                            'level1': colors.bg_primary,
                            'level2': colors.bg_primary,
                            'level3': colors.bg_primary,
                            'level4': colors.bg_primary,
                            'level5': colors.bg_primary,
                        },
                        'error': colors.color_red,
                        'errorContainer': 'rgba(249, 222, 220, 1)',
                        'inverseOnSurface': 'rgba(244, 239, 244, 1)',
                        'inversePrimary': 'rgba(208, 188, 255, 1)',
                        'inverseSurface': 'rgba(49, 48, 51, 1)',
                        'onBackground': colors.text_normal,
                        'onError': 'rgba(255, 255, 255, 1)',
                        'onErrorContainer': 'rgba(65, 14, 11, 1)',
                        'onPrimary': colors.bg_primary,
                        'onPrimaryContainer': colors.text_normal,
                        'onSecondary': 'rgba(255, 255, 255, 1)',
                        'onSecondaryContainer': colors.text_normal,
                        'onSurface': colors.text_normal,
                        'onSurfaceDisabled': colors.text_normal_hover,
                        'onSurfaceVariant': colors.text_normal,
                        'onTertiary': 'rgba(255, 255, 255, 1)',
                        'onTertiaryContainer': 'rgba(49, 17, 29, 1)',
                        'outline': 'rgba(121, 116, 126, 1)',
                        'outlineVariant': colors.fa_primary,
                        'primary': colors.fa_primary,
                        'primaryContainer': colors.fa_primary,
                        'secondary': 'rgba(98, 91, 113, 1)',
                        'secondaryContainer': colors.bg_secondary,
                        'surface': colors.bg_primary,
                        'surfaceDisabled': colors.text_muted,
                        'surfaceVariant': colors.bg_secondary,
                        'tertiary': 'rgba(125, 82, 96, 1)',
                        'tertiaryContainer': 'rgba(255, 216, 228, 1)',
                    },
                }}>
                {children}
            </Provider>
        </ClientContext.Provider>
    );
}

export default ClientProvider;
