import { useState } from "react";
import socket from "../services/socket";

function RoomControls() {
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    socket.emit("create-room", roomId);
    alert(`Created room ${roomId}`);
  };

  const joinRoom = () => {
    socket.emit("join-room", roomId);
    alert(`Joined room ${roomId}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button onClick={createRoom}>
        Create Room
      </button>

      <button onClick={joinRoom}>
        Join Room
      </button>
    </div>
  );
}

export default RoomControls;