import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [focused, setFocused] = useState('remote');

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  useEffect(() => {
    const participantConnected = participant => {
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };
    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });
    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);
  
  const toggleMute = () => {
    const publications = room.localParticipant.audioTracks
    publications.forEach( publication => {
      if (isAudioMute) {
        publication.track.enable();
      } else {
        publication.track.disable();
      }
      setIsAudioMute(!isAudioMute);
    });       
  }

  const toggleVideo = () => {
      const publications = room.localParticipant.videoTracks
      publications.forEach( publication => {
      if (isVideoPaused) {
        publication.track.enable();
      } else {
        publication.track.disable();
      }
      setIsVideoPaused(!isVideoPaused);
    });
  }

  return (
    <div className="room">
      <h3>Room: {roomName}</h3>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
        <button className="btn btn-secondary" onClick={toggleVideo}>{isVideoPaused ? "Show Video" : "Hide Video"}</button>
        <button className="btn btn-secondary" onClick={toggleMute}> {isAudioMute? "Unmute" : "Mute"}</button>
        <button className="btn btn-danger" onClick={handleLogout}>End Call</button>
      </div>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );

};

export default Room;