import { useCallback, useEffect, useState } from 'react';
import { websocketurl } from '../../../Services/constante';
import { deviceInfo } from '../../../Services';


export function useWebLocalsocket(onOpen, onMessage) {
  const [session, setSession] = useState(null);

  const updateOpenHandler = () => {
    if (!session) return;
    session.addEventListener('open', onOpen);
    return () => {
      session.removeEventListener('open', onOpen);
    };
  };

  const updateMessageHandler = () => {
    if (!session) return;
    session.addEventListener('message', onMessage);
    return () => {
      session.removeEventListener('message', onMessage);
    };
  };

  useEffect(updateOpenHandler, [session, onOpen]);
  useEffect(updateMessageHandler, [session, onMessage]);

  const connect = useCallback(() => {
      const ws = new WebSocket(websocketurl);
      setSession(ws);
    },[]);

  const sendMessage = async (data = {
    code: 0,
    token: "",
    data: {},
  }) => {
    const info = deviceInfo()
    session.send(JSON.stringify({
      device_id: `${data.token}-${info.imei}`,
      code: data.code,
      token: data?.token,
      data: data?.data,
    }));
  };

  const close = useCallback(() => {
    if (session.readyState === session.OPEN) session.close(1001);
  }, [session]);

  return [connect, sendMessage, close];
}
