export let peerConnection = null;

export function createPeerConnection() {

    peerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    });

    return peerConnection;

}