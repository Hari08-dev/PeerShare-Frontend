// client/src/services/webrtc.js

const configuration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ],
    },
  ],
};

class WebRTCService {
  constructor() {
    this.socket = null;

    // peerId -> RTCPeerConnection
    this.peers = new Map();

    // callbacks
    this.onConnectionStateChange = null;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  async createPeer(peerId) {
    if (this.peers.has(peerId)) {
      return this.peers.get(peerId);
    }

    const peer = new RTCPeerConnection(configuration);

    peer.onicecandidate = (event) => {
      if (!event.candidate || !this.socket) return;

      this.socket.emit("ice-candidate", {
        to: peerId,
        candidate: event.candidate,
      });
    };

    peer.onconnectionstatechange = () => {
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(
          peerId,
          peer.connectionState
        );
      }

      if (
        peer.connectionState === "failed" ||
        peer.connectionState === "closed" ||
        peer.connectionState === "disconnected"
      ) {
        this.removePeer(peerId);
      }
    };

    this.peers.set(peerId, peer);

    return peer;
  }

  async createOffer(peerId) {
    const peer = this.peers.get(peerId);

    const offer = await peer.createOffer();

    await peer.setLocalDescription(offer);

    return offer;
  }

  async createAnswer(peerId, offer) {
    const peer = this.peers.get(peerId);

    await peer.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peer.createAnswer();

    await peer.setLocalDescription(answer);

    return answer;
  }

  async handleAnswer(peerId, answer) {
    const peer = this.peers.get(peerId);

    if (!peer) return;

    await peer.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  }

  async addIceCandidate(peerId, candidate) {
    const peer = this.peers.get(peerId);

    if (!peer) return;

    try {
      await peer.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (err) {
      console.error(err);
    }
  }

  getPeer(peerId) {
    return this.peers.get(peerId);
  }

  removePeer(peerId) {
    const peer = this.peers.get(peerId);

    if (!peer) return;

    peer.close();

    this.peers.delete(peerId);
  }

  cleanup() {
    for (const peerId of this.peers.keys()) {
      this.removePeer(peerId);
    }

    this.socket = null;
  }
}

export default new WebRTCService();