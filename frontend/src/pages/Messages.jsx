import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConversation, setSelectedChat } from "../_actions/convoAction";
import { useSocket } from "../context/SocketContext";
import { API } from "../constants/endpoints";
import axios from "axios";

import MessageForm from "../components/MessageForm";
import MessageTitle from "../components/MessageTitle";
import MessageSection from "../components/MessageSection";
import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatHeads from "../components/ChatHeads";

const Messages = () => {
	const { socket, setReceivingCall, setCaller, setCallerSignal, setName, callEnded } = useSocket();
	const user = useSelector((state) => state.userReducer.user);
	const convo = useSelector((state) => state.convoReducer.convo);
	const selectedChat = useSelector((state) => state.convoReducer.selectedChat);
	const theme = useSelector((state) => state.themeReducer.theme);

	const dispatch = useDispatch();

	useEffect(() => {
		if (socket) {
			socket.emit("userConnected", user._id);

			socket.on("mensahe", (data) => {
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
				API.GET_CONVERSATION(id),
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
	}, [selectedChat, callEnded]);

	useEffect(() => {
		return () => {
			dispatch(setSelectedChat(null));
		};
	}, [dispatch]);

	return (
		<div className="h-[89vh] px-5 pb-3 flex gap-3 xl:px-0 xl:w-[90%] xl:mx-auto xl:h-auto xl:justify-center xl:max-w-screen-xl">
			{/* LEFT SIDE - MOBILE VIEW */}
			<ChatHeads />

			{/* RIGHT SIDE */}
			{selectedChat ? (
				<div className="h-full w-full flex flex-col gap-3 md:h-full xl:w-[60%] xl:h-[650px]">
					{/* MESSAGE CONTAINER */}
					<div
						className={`h-[69vh] rounded-md p-3 md:h-full xl:p-5 xl:h-[67.5vh] ${
							theme === "dark" ? "bg-customGray" : "bg-slate-100"
						}`}
					>
						{/* USER NAME */}
						<MessageTitle />
						{/* MESSAGES SECTION */}
						<MessageSection />
					</div>
					{/* INPUT MESSAGE HERE */}
					<MessageForm getConversation={getConversation} />
				</div>
			) : (
				<ChatPlaceholder />
			)}
		</div>
	);
};

export default Messages;
