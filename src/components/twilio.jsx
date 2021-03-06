import React, { Component } from 'react';
import Video from 'twilio-video';
import axios from 'axios';


class Twilio  extends Component {
  constructor(props) {
    super();
    this.state = {
      touched: {},
      identity: '',  /* Will hold the fake name assigned to the client. The name is generated by faker on the server */
      roomName: '',    /* Will store the room name */
      roomNameErr: false,  /* Track error for room name TextField. This will    enable us to show an error message when this variable is true */
      previewTracks: null,
      localMediaAvailable: false, /* Represents the availability of a LocalAudioTrack(microphone) and a LocalVideoTrack(camera) */
      hasJoinedRoom: false,
      activeRoom: null // Track the current active room
    };
    this.localMedia = React.createRef();
    this.remoteMedia = React.createRef();
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks =this.detachParticipantTracks.bind(this);
  }

  componentDidMount() {
    console.log("component mounted");
    const url = 'http://tf-ecs-telehealth-423902183.eu-west-1.elb.amazonaws.com/api/v1/Twilio';
    const payload = {
      "identity": "Test",
      "room": "testdoc"
    }
     axios.post(url, payload).then(results => {
    const { identity, token } = results.data;
    this.setState({ identity, token });
  });
  }

  handleInputChange(e){
    const target = e.target;
    const value = target.value;
    const name = target.name;
    const {touched} = this.state;
    touched[name] = true;
    this.setState({
        [name]: value,
        touched
    });
  }
  

  joinRoom() {
    /* 
    Show an error message on room name text field if user tries
    joining a room without providing a room name. This is enabled by setting `roomNameErr` to true
    */
    if (!this.state.roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

    console.log("Joining room '" + this.state.roomName + "'...");
    let connectOptions = {
        name: this.state.roomName
    };

    if (this.state.previewTracks) {
      console.log(this.state.previewTracks);
      connectOptions.tracks = this.state.previewTracks;
    }

    /* 
    Connect to a room by providing the token and connection
    options that include the room name and tracks. We also show an alert if an error occurs while connecting to the room.    
    */  
   console.log(this.remoteMedia.current);
   
    Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
      alert('Could not connect to Twilio: ' + error.message);
    });
  }

  leaveRoom() {
    this.state.activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  }
  
  getTracks(participant) {
    return Array.from(participant.tracks.values()).filter(function (publication) {
      return publication.track;
    }).map(function (publication) {
      return publication.track;
    });
  }

  // Attach the Tracks to the DOM.
  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach());
    });
  }

  // Attach the Participant's Tracks to the DOM.
  attachParticipantTracks(participant, container) {
    console.log("attach participant = > ", participant, container);
    var tracks = this.getTracks(participant);
    this.attachTracks(tracks, container);
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }

  detachParticipantTracks(participant) {
    var tracks = this.getTracks(participant);
    this.detachTracks(tracks);
  }

  roomJoined(room) {
    // Called when a participant joins a room
    console.log("Joined as '" + this.state.identity + "'");
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true  // Removes ‘Join Room’ button and shows ‘Leave Room’
    });

    // Attach LocalParticipant's tracks to the DOM, if not already attached.
    var previewContainer = this.localMedia.current;
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }
    // ... more event listeners
    // Attach the Tracks of the room's participants.
    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'");
      var previewContainer = this.remoteMedia.current;
      this.attachParticipantTracks(participant, previewContainer);
    });

    // Participant joining room
    room.on('participantConnected', participant => {
      console.log("Joining: '" + participant.identity + "'");
      var previewContainer = this.remoteMedia.current;
      this.attachParticipantTracks(participant, previewContainer);
    });

    // Attach participant’s tracks to DOM when they add a track
    room.on('trackAdded', (track, participant) => {
      console.log(participant.identity + ' added track: ' + track.kind);
      var previewContainer = this.remoteMedia.current;
      this.attachTracks([track], previewContainer);
    });

    // Detach participant’s track from DOM when they remove a track.
    room.on('trackRemoved', (track, participant) => {
      this.log(participant.identity + ' removed track: ' + track.kind);
      this.detachTracks([track]);
    });

    // Detach all participant’s track when they leave a room.
    room.on('participantDisconnected', participant => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
    });

    // Once the local participant leaves the room, detach the Tracks
    // of all other participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.setState({ hasJoinedRoom: false, localMediaAvailable: false, activeRoom : null });
    });
  }

  render() { 
    const {identity, roomName, token, touched, hasJoinedRoom, localMediaAvailable } = this.state;
    let showLocalTrack = localMediaAvailable ? (
      <div className="flex-item"><div ref={this.localMedia} /></div>) : '';   
  /*
   Controls showing of ‘Join Room’ or ‘Leave Room’ button.  
   Hide 'Join Room' button if user has already joined a room otherwise 
   show `Leave Room` button.
  */
  let joinOrLeaveRoomButton = hasJoinedRoom ? (
    <button className="btn btn-primary" onClick={this.leaveRoom} > Leave Room </button>) : (
    <button className="btn btn-primary" onClick={this.joinRoom} > Join Room</button>);

    return ( 
      <React.Fragment>
        <h3>Twilio Video Calling</h3>
        {!hasJoinedRoom && (<form>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Identity</label>
                <input className="form-control" name="identity" onChange={this.handleInputChange} value={identity} />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label>Room Name</label>
                <input className="form-control" name="roomName" onChange={this.handleInputChange} value={roomName } />
                {!roomName && touched.roomName && <div className="alert alert-danger">Room name is required</div>}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Token</label>
            <textarea className="form-control" name="token" onChange={this.handleInputChange} value={token} />
          </div>
        </form>)}
        <div>
          <div className="flex-container">
            {showLocalTrack} {/* Show local track if available */}
            <div className="flex-item">
              {joinOrLeaveRoomButton}
            </div>
            {/* 
              The following div element shows all remote media (other participant’s tracks) 
            */}
            <div className="flex-item" ref={this.remoteMedia} />
          </div>
        </div>
      </React.Fragment>
     );
  }
}
 
export default Twilio ;