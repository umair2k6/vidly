import React from 'react';

const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  joinRoom
}) => {
  return (
    <form>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <label>Identity</label>
            <input className="form-control" name="identity" onChange={handleUsernameChange} value={username} />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <label>Room Name</label>
            <input className="form-control" name="roomName" onChange={handleRoomNameChange} value={roomName } />
          </div>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={joinRoom} > Join Room </button>
    </form>
  );
};

export default Lobby;