import { useEffect, useState } from "react";
import webrtc from "../services/webrtc";

export default function useWebRTC(socket, roomId, username) {
  const [connectedPeers, setConnectedPeers] = useState([]);

  useEffect(() => {
    if (!socket || !roomId || !username) return;

    webrtc.setSocket(socket);

    socket.emit("join-room", {
      roomId,
      username,
    });

    const handleExistingPeers = async (peers) => {
      for (const peer of peers) {
        await webrtc.createPeer(peer.peerId);

        const offer = await webrtc.createOffer(peer.peerId);

        socket.emit("offer", {
          to: peer.peerId,
          offer,
        });
      }
    };

    const handlePeerJoined = async ({ peerId }) => {
      await webrtc.createPeer(peerId);
    };

    const handleOffer = async ({ from, offer }) => {
      await webrtc.createPeer(from);

      const answer = await webrtc.createAnswer(from, offer);

      socket.emit("answer", {
        to: from,
        answer,
      });
    };

    const handleAnswer = async ({ from, answer }) => {
      await webrtc.handleAnswer(from, answer);
    };

    const handleIceCandidate = async ({ from, candidate }) => {
      await webrtc.addIceCandidate(from, candidate);
    };

    const handlePeerLeft = ({ peerId }) => {
      webrtc.removePeer(peerId);

      setConnectedPeers((prev) =>
        prev.filter((id) => id !== peerId)
      );
    };

    webrtc.onConnectionStateChange = (peerId, state) => {
      if (state === "connected") {
        setConnectedPeers((prev) => {
          if (prev.includes(peerId)) return prev;

          return [...prev, peerId];
        });
      }

      if (
        state === "failed" ||
        state === "closed" ||
        state === "disconnected"
      ) {
        setConnectedPeers((prev) =>
          prev.filter((id) => id !== peerId)
        );
      }
    };

    socket.on("existing-peers", handleExistingPeers);
    socket.on("peer-joined", handlePeerJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("peer-left", handlePeerLeft);

    return () => {
      socket.emit("leave-room");

      socket.off("existing-peers", handleExistingPeers);
      socket.off("peer-joined", handlePeerJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("peer-left", handlePeerLeft);

      webrtc.cleanup();
    };
  }, [socket, roomId, username]);

  return {
    connectedPeers,
  };
}