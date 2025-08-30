export type initialWebSocketStateType = {
    code: number;
    connected: boolean;
    data: {
        [x: string]: any;
    };
};

export const initialWebSocketState: initialWebSocketStateType = {
    code: -1,
    connected: false,
    data: {},
};

export const reducer = (state = initialWebSocketState, action: initialWebSocketStateType) => {

    switch(action.code) {
        case 0:
            return { code: action.code, data: "waiting", connected: false };
        case 1:
            return { code: action.code, data: "", connected: true };
        default:
            return { ...state, code: action.code, data: action.data };
    }
}
