const peerConnections = {};

const configuration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

export function createPeerConnection(peerId) {

    if (peerConnections[peerId]) {
        return peerConnections[peerId];
    }

    const peer = new RTCPeerConnection(configuration);

    peerConnections[peerId] = peer;

    return peer;
}

export function getPeerConnection(peerId) {
    return peerConnections[peerId];
}

export function removePeerConnection(peerId) {

    if (!peerConnections[peerId]) return;

    peerConnections[peerId].close();

    delete peerConnections[peerId];
}

export function getAllPeerConnections() {
    return peerConnections;
}