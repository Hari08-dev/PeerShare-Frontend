import { useEffect, useState } from "react";

import socket from "./services/socket";

import RoomControls from "./components/RoomControls";
import RoomInfo from "./components/RoomInfo";
import PeerList from "./components/PeerList";

import "./App.css";

function App() {

    const [roomId, setRoomId] = useState("");

    const [joined, setJoined] = useState(false);

    const [isHost, setIsHost] = useState(false);

    const [peers, setPeers] = useState([]);

    useEffect(() => {

        socket.on("room-created", (data) => {

            setRoomId(data.roomId);
            setJoined(true);
            setIsHost(true);

        });

        socket.on("room-joined", (data) => {

            setRoomId(data.roomId);
            setJoined(true);
            setIsHost(false);

        });

        socket.on("room-users", (users) => {

            setPeers(users);

        });

        socket.on("room-error", (msg) => {

            alert(msg);

        });

        socket.on("peer-joined", (id) => {

            console.log(id + " joined");

        });

        socket.on("peer-left", (id) => {

            console.log(id + " left");

        });

        return () => {

            socket.off();

        };

    }, []);

    return (

        <div className="container">

            <h1>Peer Share</h1>

            <RoomControls
                roomId={roomId}
                setRoomId={setRoomId}
                joined={joined}
                setJoined={setJoined}
                isHost={isHost}
                setIsHost={setIsHost}
            />

            {joined && (
                <>
                    <RoomInfo
                        roomId={roomId}
                        isHost={isHost}
                    />

                    <PeerList
                        peers={peers}
                    />
                </>
            )}

        </div>

    );
}

export default App;