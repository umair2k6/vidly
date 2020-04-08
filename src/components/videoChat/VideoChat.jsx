import React, { useState, useCallback } from 'react';
import Lobby from './Lobby';
import Room from './Room';

const VideoChat = () => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  // eslint-disable-next-line no-restricted-globals
  const [isLocalhost] = useState(location.hostname === "localhost"? true : false);

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
    if(localStorage.getItem('twilio')){
      setToken(localStorage.getItem('twilio'));
    } else {
      // eslint-disable-next-line no-restricted-globals
      let newToken;
      if (isLocalhost){
        const url = 'http://tf-ecs-telehealth-423902183.eu-west-1.elb.amazonaws.com/api/v1/Twilio';
        const payload = JSON.stringify({
              identity: username,
              room: roomName
        });
        const data = await fetch(url, {
          method: 'POST',
          body: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json());
        newToken = data.token;
      } else {
        newToken = token;
      }
      localStorage.setItem('twilio', newToken);
      setToken(newToken);
    }
    
  }, [roomName, username, isLocalhost, token]);

  const handleLogout = useCallback(event => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <Room roomName={roomName} token={token} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
         username={username}
         roomName={roomName}
         token={token}
         isLocalhost={isLocalhost}
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