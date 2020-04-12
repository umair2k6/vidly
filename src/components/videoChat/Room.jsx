import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';
import "./videoChat.css";

const Room = ({ roomName, token, handleLogout }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioMute, setIsAudioMute] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [videoDeviceList, setVideoDeviceList] = useState([]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  useEffect(() => {
    const participantConnected = participant => {
      console.log('participant connected => ', participant);
      setParticipants(prevParticipants => [...prevParticipants, participant]);
    };
    const participantDisconnected = participant => {
      console.log('participant disconnected => ', participant);
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
    }, error => {
      handleLogout();
      console.error(`Unable to connect to Room: ${error.message}`);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(trackPublication => {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token, handleLogout]);
  
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

  if(videoDeviceList.length === 0){
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
      const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput').map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label,
          isSelected : index===0? true: false
      }));
      setVideoDeviceList(videoDevices);
    });
  } 

  const switchCamera = async () => {

    const tracks = Array.from(room.localParticipant.videoTracks.values());
    const currentDevice = tracks.find(track => track.kind === 'video');
    room.localParticipant.unpublishTrack(currentDevice.track);

    const selectedDevice = videoDeviceList.filter(device => !device.isSelected)[0];
    const newDevice = await Video.createLocalVideoTrack({
      deviceId: { exact: selectedDevice.deviceId }
    });

    // Switch camera
    room.localParticipant.publishTrack(newDevice);
    const devices = videoDeviceList.map(device => ({
        deviceId: device.deviceId,
        label: device.label,
        isSelected : !device.isSelected
    }));

    setVideoDeviceList(devices);
  }

  const disconnect = () => {
    room.disconnect();
    handleLogout();
  }

  return (
    <div className="room">
      <div className="remote-participants">{remoteParticipants}</div>
        {room && (
          <React.Fragment>
            <div className="local-participant">
              <Participant
                key={room.localParticipant.sid}
                participant={room.localParticipant}
              />
            </div>
            <div className="controls">
              <button className="btn btn-primary" onClick={toggleVideo}>{isVideoPaused ? "Show Video" : "Hide Video"}</button>
              <button className="btn btn-primary" onClick={toggleMute}> {isAudioMute? "Unmute" : "Mute"}</button>
              {videoDeviceList.length > 1 && (<button className="btn btn-danger" onClick={switchCamera}>Switch Camera</button>)}
              <button className="btn btn-danger" onClick={disconnect}>End Call</button>
            </div>
          </React.Fragment>
        )}
    </div>
  );

};

export default Room;