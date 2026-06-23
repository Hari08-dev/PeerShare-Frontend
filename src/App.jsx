import { useEffect } from "react";
import RoomControls from "./components/RoomControls";
import socket from "./services/socket";

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("user-joined", (data) => {
      console.log("User joined:", data.socketId);
      alert(`User joined: ${data.socketId}`);
    });

    return () => {
      socket.off("connect");
      socket.off("user-joined");
    };
  }, []);

  return (
    <div>
      <h1>P2P Share</h1>
      <RoomControls />
    </div>
  );
}

export default App;