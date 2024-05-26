import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "../context/SocketContext";
import { API } from "../constants/endpoints";
import { Phone, Video } from "lucide-react";
import Peer from "simple-peer";

const MessageTitle = () => {
	const selectedChat = useSelector((state) => state.convoReducer.selectedChat);
    const user = useSelector((state) => state.userReducer.user);

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
				{selectedChat.profilePicture ? (
					<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
						<img
							src={API.GET_PHOTO_URL(selectedChat.profilePicture)}
							alt={selectedChat.firstName + " Photo"}
							className="w-full h-full rounded-full object-contain"
						/>
					</div>
				) : (
					<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
						<p className="capitalize font-bold text-xl">
							{selectedChat.firstName &&
								selectedChat.firstName.charAt(0)}
						</p>
					</div>
				)}
				<p className="capitalize md:hidden">{selectedChat.firstName}</p>
				<p className="hidden md:flex md:capitalize">
					{selectedChat.firstName} {selectedChat.lastName}
				</p>
			</div>
			<div className="flex gap-5">
				<Phone
					title="Call"
					className="cursor-pointer text-red-700"
					onClick={() => {
						handleCall(selectedChat._id);
					}}
				/>
				<Video
					title="Video Call"
					className="cursor-pointer text-red-700"
					onClick={() => {
						handleCall(selectedChat._id);
					}}
				/>
			</div>
		</div>
	);
};

export default MessageTitle;
