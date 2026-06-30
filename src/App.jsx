import { useEffect, useState } from "react";

import socket from "./services/socket";

import {
    createPeerConnection,
    getPeerConnection,
    removePeerConnection,
} from "./services/webrtc";

import RoomControls from "./components/RoomControls";
import RoomInfo from "./components/RoomInfo";
import PeerList from "./components/PeerList";

import "./App.css";

function App() {

    const [roomId, setRoomId] = useState("");

    const [joined, setJoined] = useState(false);

    const [isHost, setIsHost] = useState(false);

    const [peers, setPeers] = useState({});

    const [selectedFile, setSelectedFile] = useState(null);

    const [connecting, setConnecting] = useState(false);

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

            const peerMap = {};

            users.forEach((id) => {

                if (id !== socket.id) {

                    peerMap[id] = createPeerConnection(id);

                }

            });

            setPeers(peerMap);

        });

        socket.on("room-error", (msg) => {

            alert(msg);

        });

        socket.on("peer-joined", (id) => {

            console.log(id + " joined");

            createPeerConnection(id);

        });

        socket.on("peer-left", (id) => {

            console.log(id + " left");

            removePeerConnection(id);

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