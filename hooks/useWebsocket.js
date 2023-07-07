import { useEffect, useRef, useContext, useState, useCallback } from 'react';

import { apiHost } from '../config/settings';

import { ActionCableContext } from '../contexts/webSocket';
import UserContext from '../contexts/user';
import { useImageFallbackContext } from '../contexts/imageFallback';

const useActionCable = (handlers = {}, user) => {
  const cable = useContext(ActionCableContext);

  const channelName = "NotificationsChannel"
  const username = user?.username || "guest"


  useEffect(() => {
    if(!cable) return
        
    const subscription = cable.subscriptions.create({ channel: channelName, username: username }, {
      connected: () => {
        console.log("Connected to channel: " + channelName);
        if (handlers.connected) handlers.connected();
      },

      disconnected: () => {
        console.log("Disconnected from channel: " + channelName);
        if (handlers.disconnected) handlers.disconnected();
      },

      received: (data) => {
        console.log("Received data: ", data);
        // setReceivedData(data);  // Save the received data in state
        if (handlers.received) handlers.received(data);
      }
    });


    // Clean up function
    return () => {
      cable?.subscriptions.remove(subscription);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, cable]); 
}
export default useActionCable;

