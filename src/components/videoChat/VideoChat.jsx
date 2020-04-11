import React, { useState, useCallback } from 'react';
import Lobby from './Lobby';
import Room from './Room';

const VideoChat = () => {
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const joinRoom = useCallback(async event => {
    setIsConnected(true);
  }, []);

  const handleLogout = () => {
    setIsConnected(false);
    setToken('');
  };

  const handleTokenChange = useCallback(event => {
    setToken(event.target.value);
  }, []);

  return (
    <React.Fragment>
      {isConnected && token ? (<Room token={token} handleLogout={handleLogout} />) : (
        <Lobby
          token={token}
          handleTokenChange={handleTokenChange}
          joinRoom={joinRoom}
        />
      )}
    </React.Fragment>
  );
};

export default VideoChat;