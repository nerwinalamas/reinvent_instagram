import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../_actions/convoAction";
import { useSocket } from "../context/SocketContext";

import MessageForm from "../components/MessageForm";
import MessageTitle from "../components/MessageTitle";
import MessageSection from "../components/MessageSection";
import ChatPlaceholder from "../components/ChatPlaceholder";
import ChatHeads from "../components/ChatHeads";

const Messages = () => {
	const { socket, setReceivingCall, setCaller, setCallerSignal, setName } = useSocket();
	const user = useSelector((state) => state.userReducer.user);
	const selectedChat = useSelector((state) => state.convoReducer.selectedChat);
	const theme = useSelector((state) => state.themeReducer.theme);

	const dispatch = useDispatch();

	useEffect(() => {
		if (socket) {
			socket.emit("userConnected", user._id);

			socket.on("callUser", (data) => {
				setReceivingCall(true);
				setCaller(data.from);
				setName(data.name);
				setCallerSignal(data.signal);
			});

			return () => {
				socket.off("callUser");
			};
		}
	}, [socket, user._id]);

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
					<MessageForm />
				</div>
			) : (
				<ChatPlaceholder />
			)}
		</div>
	);
};

export default Messages;
