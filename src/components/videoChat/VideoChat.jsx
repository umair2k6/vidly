import React, { useState, useCallback } from 'react'; 
import Lobby from './Lobby';
import Room from './Room';

const VideoChat = () => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleUsernameChange = useCallback(event => {
    setUsername(event.target.value);
  }, []);

  const handleTokenChange = useCallback(event => {
    setToken(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback(event => {
    setRoomName(event.target.value);
  }, []);

  const joinRoom = useCallback(async event => {
    setIsConnected(true);
  }, []);

  const handleLogout = useCallback(event => {
    setToken('');
    setIsConnected(false);
  }, []);

  let render;
  if (isConnected) {
    render = (
      <Room roomName={roomName} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
         username={username}
         roomName={roomName}
         token={token}
         handleTokenChange={handleTokenChange}
         handleUsernameChange={handleUsernameChange}
         handleRoomNameChange={handleRoomNameChange}
         joinRoom={joinRoom}
      />
    );
  }
  return render;
};

export default VideoChat;