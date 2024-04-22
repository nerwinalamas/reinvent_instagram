import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setConversation, setSelectedChat } from "../_actions/convoAction";
import { useSocket } from "../context/SocketContext";

import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatHeads from "../components/ChatHeads";

import { Phone, Send, Video } from "lucide-react";
import axios from "axios";
import moment from "moment";
import Peer from "simple-peer";

const Messages = () => {
	const [message, setMessage] = useState("");
	const containerRef = useRef(null);
	const {
		socket,
		connectionRef,
		userVideo,
		stream,
		setCallAccepted,
		caller,
		callerSignal,
		receivingCall,
		callAccepted,
		name,
		setReceivingCall,
		setCaller,
		setCallerSignal,
		setName,
		myVideo,
		callEnded,
	} = useSocket();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector((state) => state.userReducer.user);
	const convo = useSelector((state) => state.convoReducer.convo);
	const selectedChat = useSelector(
		(state) => state.convoReducer.selectedChat
	);
	const theme = useSelector((state) => state.themeReducer.theme)

	console.log("selectedChat: ", selectedChat);

	useEffect(() => {
		if (socket) {
			socket.emit("userConnected", user._id);

			socket.on("mensahe", (data) => {
				console.log("mensahe: ", data);
				dispatch(setConversation([...convo, data]));
			});

			socket.on("callUser", (data) => {
				setReceivingCall(true);
				setCaller(data.from);
				setName(data.name);
				setCallerSignal(data.signal);
			});

			return () => {
				socket.off("mensahe");
				socket.off("callUser");
			};
		}
	}, [socket, dispatch, convo, user._id]);

	const getConversation = async (id) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/message/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			if (response.data.length === 0) {
				dispatch(setConversation([]));
			} else {
				dispatch(setConversation(response.data.data.messages));
			}
		} catch (error) {
			console.log("Get Conversation Error: ", error);
		}
	};

	useEffect(() => {
		if (selectedChat && selectedChat._id) {
			getConversation(selectedChat._id);
		}
	}, [selectedChat]);

	useEffect(() => {
		return () => {
			dispatch(setSelectedChat(null));
		};
	}, [dispatch]);

	const handleSendMessage = async (e, id) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				`http://localhost:5000/message/send/${id}`,
				{ message },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			console.log("response ng send: ", response);
			if (response) {
				socket.emit("message", { message, userId: user._id });
				setMessage("");
				dispatch(setConversation([...convo, response.data.data]));
				if (selectedChat && selectedChat._id) {
					getConversation(selectedChat._id);
				}
			}
		} catch (error) {
			console.log("Get Conversation Error: ", error);
		}
	};

	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [convo]);

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

	const answerCall = (id) => {
		setCallAccepted(true);
		const peer = new Peer({ initiator: false, trickle: false, stream });
		peer.on("signal", (data) => {
			socket.emit("answerCall", { signal: data, to: caller });
		});
		peer.on("stream", (currentStream) => {
			userVideo.current.srcObject = currentStream;
		});
		peer.signal(callerSignal);
		connectionRef.current = peer;
		navigate(`/calling/${id}`);
	};

	const handleCall = (id) => {
		callUser(id);
		// setReceivingCall(true); 
		// setCaller(user._id); 
		// setName(user.firstName + " " + user.lastName); 
		navigate(`/calling/${id}`);
	};

	return (
		<div className="h-[89vh] px-5 pb-3 flex gap-3 xl:px-0 xl:w-[90%] xl:mx-auto xl:h-auto xl:justify-center xl:max-w-screen-xl">
			{/* LEFT SIDE - MOBILE VIEW */}
			<ChatHeads />

			{/* RIGHT SIDE */}
			{selectedChat ? (
				<div className="h-full w-full flex flex-col gap-3 md:h-full xl:w-[60%] xl:h-[650px]">
					{/* MESSAGE CONTAINER */}
					<div className={`h-[69vh] rounded-md p-3 md:h-full xl:p-5 xl:h-[67.5vh] ${theme === "dark" ? "bg-customGray" : "bg-slate-100" }`}>
						{/* USER NAME */}
						<div className="flex justify-between items-center border-b pb-3">
							<div className="flex items-center gap-5 cursor-pointer p-2 hover:bg-slate-100 hover:bg-opacity-40 rounded-md">
								{selectedChat.profilePicture ? (
									<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
										<img
											src={`http://localhost:5000/uploads/${selectedChat.profilePicture}`}
											alt={
												selectedChat.firstName +
												" Photo"
											}
											className="w-full h-full rounded-full object-contain"
										/>
									</div>
								) : (
									<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
										<p className="capitalize font-bold text-xl">
											{selectedChat.firstName &&
												selectedChat.firstName.charAt(
													0
												)}
										</p>
									</div>
								)}
								<p className="capitalize md:hidden">{selectedChat.firstName}</p>
								<p className="hidden md:flex md:capitalize">
									{selectedChat.firstName}{" "}
									{selectedChat.lastName}
								</p>
							</div>
							<div className="flex gap-5">
								<Phone 
									title="Call"
									className="cursor-pointer text-red-700"
									onClick={() => {handleCall(selectedChat._id)
									console.log("audio call click")}}
								/>
								<Video
									title="Video Call"
									className="cursor-pointer text-red-700"
									onClick={() => {handleCall(selectedChat._id)
									console.log("video call click")}}
								/>
							</div>
						</div>
						{/* MESSAGES SECTION */}
						<div
							ref={containerRef}
							className="h-[53vh] md:h-[670px] xl:h-[85%] overflow-y-auto px-1 pt-2 mt-2 md:mt-3 flex flex-col gap-2"
						>
							{convo && convo.length > 0 ? (
								convo.map((convo) => (
									<div
										key={convo._id}
										className={`chat ${
											convo.messageBy !== user._id
												? "chat-start"
												: "chat-end"
										}`}
									>
										<div
											className={`chat-bubble flex flex-col gap-1 text-sm xl:text-sm ${
												convo.messageBy === user._id
													? "chat-bubble-info"
													: ""
											}`}
										>
											{convo.message}
											<time className="text-xs opacity-50 xl:text-xs">
												{moment(
													convo.createdAt
												).fromNow()}
											</time>
										</div>
									</div>
								))
							) : (
								<p className="text-center">No message yet</p>
							)}
							{receivingCall && !callAccepted ? (
								<div className="flex flex-col justify-center gap-2 mt-2">
									<h1 className="text-sm lg:text-base"><span className="capitalize">{user.firstName}</span> is calling...</h1>
									<button onClick={() => answerCall(user._id)} className="w-max rounded-md bg-green-500 text-customWhite p-2">Answer</button>
								</div>
							) : null}
						
						</div>
					
					</div>
					{/* INPUT MESSAGE HERE */}
					<form
						onSubmit={(e) => handleSendMessage(e, selectedChat._id)}
						className={`h-28  rounded-md p-3 relative ${theme === "dark" ? "bg-customGray" : "bg-slate-100" } `}
					>
						<textarea
							name="message"
							id="message"
							rows="3"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className={`w-full p-2 rounded-sm text-sm xl:text-base border outline-none ${theme === "dark" ? "bg-customGray" : "bg-slate-200" }`}
						></textarea>
						<button
							type="submit"
							className="w-9 h-9 rounded-full p-2 cursor-pointer bg-blue-500 text-customWhite flex items-center justify-center absolute bottom-5 right-3 xl:w-11 xl:h-11 xl:p-3"
						>
							<Send />
						</button>
					</form>
				</div>
			) : (
				<ChatPlaceholder />
			)}
		</div>
	);
};

export default Messages;
