export default function RoomInfo({ roomId, isHost }) {

    const copyCode = async () => {

        await navigator.clipboard.writeText(roomId);

        alert("Copied!");
    };

    return (
        <div className="roomInfo">

            <h2>Current Room</h2>

            <h1>{roomId}</h1>

            <p>
                {isHost ? "Host" : "Guest"}
            </p>

            <button onClick={copyCode}>
                Copy Room Code
            </button>

        </div>
    );
}