import { useEffect, useRef, useContext } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import UserContext from '../contexts/user';
import { apiHost } from '../config/settings';

function useWebSocket(onMessage) {
  const clientRef = useRef(null);
  const [user] = useContext(UserContext);

  useEffect(() => {
    const client = new W3CWebSocket(`${ apiHost }/cable?username=${ user?.username || "guest" }`);

    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };

    client.onerror = (error) => {
      console.log(`WebSocket Error: ${error.message }`);
    };

    client.onclose = (event) => {
      console.log(`WebSocket Connection Closed: ${ event.code }`);
    };

    client.onmessage = (message) => {
      const result = JSON.parse(message.data);
      console.log("🚀 WEBSCOCKET HIT", result);
      if (result.type === 'message') {
        const { message, data } = result;
        onMessage(message, data);
      }
    };

    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, [user?.username, onMessage]);

  return clientRef;  // Return the client ref if you want to use it outside
}
export default useWebSocket;