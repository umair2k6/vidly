import React from 'react';

const Lobby = ({
  token,
  handleTokenChange,
  joinRoom
}) => {
  return (
    <form>
      <div className="form-group">
        <label>Token</label>
        <textarea className="form-control" name="token" onChange={handleTokenChange} value={token} />
      </div>
      <button type="button" className="btn btn-primary" onClick={joinRoom} > Join Room </button>
    </form>
  );
};

export default Lobby;