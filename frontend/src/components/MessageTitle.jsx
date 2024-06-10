import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { Phone, Video } from "lucide-react";
import Peer from "simple-peer";
import useAuthStore from "../store/useAuth";
import useChatStore from "../store/useChat";

const MessageTitle = () => {
	const { user } = useAuthStore();
	const { chat } = useChatStore();

    const navigate = useNavigate()

    const {
		socket,
		connectionRef,
		userVideo,
		stream,
		setCallAccepted,
		setReceivingCall,
	} = useSocket();

    const callUser = (userToCallId) => {
		const peer = new Peer({ initiator: true, trickle: false, stream });
		peer.on("signal", (data) => {
			socket.emit("callUser", {
				userToCall: userToCallId,
				signalData: data,
				from: user._id,
				name: user.firstName + " " + user.lastName,
			});
		});
		peer.on("stream", (currentStream) => {
			userVideo.current.srcObject = currentStream;
		});
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});
		connectionRef.current = peer;
	};

	const handleCall = (id) => {
		callUser(id);
		// setReceivingCall(true);
		// setCallAccepted(false);
		// setCaller(user._id);
		// setName(user.firstName + " " + user.lastName);
		navigate(`/calling/${id}`);
	};

	return (
		<div className="flex justify-between items-center border-b pb-3">
			<div className="flex items-center gap-5 cursor-pointer p-2 hover:bg-slate-100 hover:bg-opacity-40 rounded-md">
				{chat.profilePicture ? (
					<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
						<img
							src={chat.profilePicture}
							alt={chat.firstName + " Photo"}
							className="w-full h-full rounded-full object-contain"
						/>
					</div>
				) : (
					<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
						<p className="capitalize font-bold text-xl">
							{chat.firstName &&
								chat.firstName.charAt(0)}
						</p>
					</div>
				)}
				<p className="capitalize md:hidden">{chat.firstName}</p>
				<p className="hidden md:flex md:capitalize">
					{chat.firstName} {chat.lastName}
				</p>
			</div>
			<div className="flex gap-5">
				<Phone
					title="Call"
					className="cursor-pointer text-red-700"
					onClick={() => {
						handleCall(chat._id);
					}}
				/>
				<Video
					title="Video Call"
					className="cursor-pointer text-red-700"
					onClick={() => {
						handleCall(chat._id);
					}}
				/>
			</div>
		</div>
	);
};

export default MessageTitle;
