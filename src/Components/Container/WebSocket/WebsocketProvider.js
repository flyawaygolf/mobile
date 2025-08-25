import React, { useEffect, useReducer } from "react";

import { useConnectionCallback, useMessageCallback } from "./eventHandlers";
import { initialWebSocketState, reducer } from "./reducer";
import WebSocketContext from "./webSocketContext";
import { useWebLocalsocket } from "./websocketUtils";
import { webSocketRoutes } from "../../../Services/Client";
import useClient from "../Client/useClient";

const WebSocketContextProvider = ({ children }) => {
    const client = useClient()
    const [notification, dispatch] = useReducer(reducer, initialWebSocketState);

    const onOpen = useConnectionCallback();
    const onMessage = useMessageCallback(dispatch);
    const [connect, sendMessage] = useWebLocalsocket(onOpen, onMessage);

    useEffect(() => {
        if (client.state === "loged") {
            connect()
        }
    }, [client.state])

    useEffect(() => {
        if (notification.code === webSocketRoutes.CONNECT) {
            sendMessage({
                code: webSocketRoutes.CHECK_CONNECTION,
                token: client.token,
            });
        }
    }, [notification]);

    return <WebSocketContext.Provider value={{ notification, sendMessage, dispatch }}>{children}</WebSocketContext.Provider>
}

export default WebSocketContextProvider;
