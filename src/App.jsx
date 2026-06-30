import { useEffect, useState } from "react";

import socket from "./services/socket";

import {
    createOffer,
    handleOffer,
    handleAnswer,
    handleIce,
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

    const [peers, setPeers] = useState([]);

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

            const otherPeers = users.filter(
                (id) => id !== socket.id
            );

            setPeers(otherPeers);

        });

        socket.on("room-error", (msg) => {

            alert(msg);

        });

        socket.on("peer-joined", async (id) => {

            console.log(id + " joined");

            await createOffer(id, socket);

        });

        socket.on("peer-left", (id) => {

            console.log(id + " left");

            removePeerConnection(id);

        });

        return () => {

            socket.off();

        };

        socket.on("offer", async ({ sender, offer }) => {

            await handleOffer(sender, offer, socket);

        });

        socket.on("answer", async ({ sender, answer }) => {

            await handleAnswer(sender, answer);

        });

        socket.on("ice-candidate", async ({ sender, candidate }) => {

            await handleIce(sender, candidate);

        });

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