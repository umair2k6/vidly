import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Lobby from './Lobby';
import Room from './Room';

const VideoChat = () => {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState(null);

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
    const url = 'http://tf-ecs-telehealth-423902183.eu-west-1.elb.amazonaws.com/api/v1/Twilio';
    const payload = JSON.stringify({
          identity: username,
          room: roomName
    });
    // const headers = {
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }
    // };
    // const data = await axios.post(url, payload, headers).then(res => res.json());


    const data = await fetch(url, {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    console.log(data);
    
    setToken(data.token);
  }, [roomName, username]);

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