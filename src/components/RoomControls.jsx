import { useState } from "react";
import socket from "../services/socket";

export default function RoomControls({
    roomId,
    setRoomId,
    joined,
    setJoined,
    isHost,
    setIsHost,
}) {

    const [joinCode, setJoinCode] = useState("");

    const createRoom = () => {
        socket.emit("create-room");
    };

    const joinRoom = () => {

        if (!joinCode.trim()) return;

        socket.emit("join-room", joinCode);
    };

    const leaveRoom = () => {

        socket.emit("leave-room");

        setJoined(false);
        setRoomId("");
        setIsHost(false);
    };

    return (
        <div className="controls">

            {!joined && (
                <>
                    <button onClick={createRoom}>
                        Create Room
                    </button>

                    <input
                        placeholder="Room Code"
                        value={joinCode}
                        onChange={(e) =>
                            setJoinCode(e.target.value.toUpperCase())
                        }
                    />

                    <button onClick={joinRoom}>
                        Join Room
                    </button>
                </>
            )}

            {joined && (
                <button
                    className="leave"
                    onClick={leaveRoom}
                >
                    Leave Room
                </button>
            )}
        </div>
    );
}