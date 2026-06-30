export default function PeerList({ peers }) {

    return (

        <div className="peerBox">

            <h2>Connected Peers</h2>

            {peers.length === 0 && (
                <p>No peers connected.</p>
            )}

            {peers.map((peer, index) => (

                <div
                    key={peer}
                    className="peer"
                >
                    Peer {index + 1}

                    <small>
                        {peer.substring(0, 6)}
                    </small>

                </div>

            ))}

        </div>

    );
}