import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import React, { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

const CallControls = ({ toggleAudio, setToggleAudio, toggleVideo, setToggleVideo }) => {
    const { socket, connectionRef, myVideo, setCallEnded, stream, setReceivingCall } = useSocket();

    const handleAudio = () => {
		setToggleAudio((prev) => !prev);
	};

    const handleVideo = () => {
		const newToggleState = !toggleVideo;
		setToggleVideo(newToggleState);
		socket.emit("camera_state_change", newToggleState);

		if (myVideo.current) {
			myVideo.current.srcObject = toggleVideo ? null : stream;
		}
	};

	const handleEndCall = () => {
        socket.emit("endCall")
	};

    useEffect(() => {
        socket.on("callEnded", () => {
            setCallEnded(true);
            setReceivingCall(false);
            connectionRef.current.destroy();
        })
    }, [])

	return (
		<div className="absolute bottom-10 p-2 w-80 flex items-center justify-evenly rounded-full bg-customGray">
			{toggleVideo ? (
				<Video
					title="Video"
					onClick={handleVideo}
					className="cursor-pointer"
				/>
			) : (
				<VideoOff
					title="Video"
					onClick={handleVideo}
					className="cursor-pointer"
				/>
			)}
			{toggleAudio ? (
				<MicOff
					title="Mic"
					onClick={handleAudio}
					className="cursor-pointer"
				/>
			) : (
				<Mic
					title="Mic"
					onClick={handleAudio}
					className="cursor-pointer"
				/>
			)}

			<div
				onClick={handleEndCall}
				title="End Call"
				className="w-11 h-11 p-3 flex items-center justify-center rounded-full cursor-pointer bg-red-600"
			>
				<PhoneOff />
			</div>
		</div>
	);
};

export default CallControls;
