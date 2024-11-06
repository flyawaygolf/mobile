import * as React from 'react';
import Client from '../../../Services/Client';
import { myInformationInterface } from '../../../Services/Client/Managers/Interfaces/Me';

export interface ClientContextI {
    client: Client;
    token: string;
    user: myInformationInterface,
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
        golf_info: {
            handicap: 0,
            player_status: 0,
            location: [0, 0],
        },
    },
    state: 'loading',
    setValue: () => {},
};

const ClientContext = React.createContext<ClientContextI>(clientContextPlaceholder);

ClientContext.displayName = 'ClientContext';

export default ClientContext;
