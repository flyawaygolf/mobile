import * as React from 'react';
import Client from '../../../Services/Client';
import { myInformationInterface } from '../../../Services/Client/Managers/Interfaces/Me';

export interface locationType {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  }

export interface ClientContextI {
    client: Client;
    token: string;
    user: myInformationInterface,
    location: locationType,
    state: 'loading' | 'loged' | 'logout' | 'switch_user';
    setValue: (params: any) => {} | any
}

export const clientContextPlaceholder: ClientContextI = {
    client: new Client({ token: "-" }),
    token: '',
    user: {
        user_id: "-",
        username: "-",
        nickname: "-",
        avatar: "base_1.png",
        accent_color: "#DCDCDC",
        locale: "US",
        language_spoken: [],
        certified: false,
        flags: 0,
        is_private: false,
        allow_dm: true,
        premium_type: 0,
        banned: false,
        activated: true,
        birthday: new Date(),
        session_id: "-",
        token: "-",
        gender: 0,
        premium_settings: undefined,
        golf_info: {
            handicap: 0,
            player_status: 0,
            location: {
                latitude: 0,
                longitude: 0,
            },
        },
    },
    location: {
        latitude: 48.864716,
        longitude: 2.349014,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    },
    state: 'loading',
    setValue: () => {},
};

const ClientContext = React.createContext<ClientContextI>(clientContextPlaceholder);

ClientContext.displayName = 'ClientContext';

export default ClientContext;
