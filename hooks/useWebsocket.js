import { useEffect, useRef, useContext, useState, useCallback } from 'react';

import { ActionCableContext } from '../contexts/webSocket';

export const makeSocketID = (pathname, username) => {
  switch (pathname) { 
    case "/edit": {
      if (!username) return null
      return `${ username }-edit`
    }
    case "/": return null //no socket needed for home page
    default: return pathname.replace("/", "")
  }
}

const useActionCable = (handlers = {}, socket_id) => {
  const cable = useContext(ActionCableContext);
  const channelName = "NotificationsChannel"

  useEffect(() => {
    if (!cable || !socket_id) return
    let subscription;

    try {
      //change username: to soclek_id
      subscription = cable.subscriptions.create({ channel: channelName, socket_id: socket_id }, {
        connected: () => {
          console.log("Connected to channel: " + socket_id);
          if (handlers.connected) handlers.connected();
        },
  
        disconnected: () => {
          console.log("Disconnected from channel: " + socket_id);
          if (handlers.disconnected) handlers.disconnected();
        },
  
        received: (data) => {
          // console.log("🚀 socket Received data: ", data);
          if (handlers.received) handlers.received(data);
        }
      });
    } catch (error) { 
      console.log("Error Connecting to websocket: ", error);
    }


    // Clean up function
    return () => {
      if (subscription) {
        cable?.subscriptions.remove(subscription);
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket_id, cable]); 
}
export default useActionCable;

