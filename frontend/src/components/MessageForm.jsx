import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../context/SocketContext";
import { useSendMessageMutation } from "../mutation/message";
import { Send } from "lucide-react";

const MessageForm = () => {
	const [message, setMessage] = useState("");
	const theme = useSelector((state) => state.themeReducer.theme);
    const selectedChat = useSelector((state) => state.convoReducer.selectedChat);
    const user = useSelector((state) => state.userReducer.user);
	const sendMessageMutation = useSendMessageMutation();
	const { socket } = useSocket();

	const handleSendMessage = async (e, id) => {
		e.preventDefault();

		try {
			sendMessageMutation.mutate({ userId: id, message }, {
				onSuccess: () => {
					socket.emit("message", { message, userId: user._id });
					setMessage("");
				}
			})
		} catch (error) {
			console.log("Get Conversation Error: ", error);
		}
	};

	return (
		<form
			onSubmit={(e) => handleSendMessage(e, selectedChat._id)}
			className={`h-28  rounded-md p-3 relative ${
				theme === "dark" ? "bg-customGray" : "bg-slate-100"
			} `}
		>
			<textarea
				name="message"
				id="message"
				rows="3"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className={`w-full p-2 rounded-sm text-sm xl:text-base border outline-none ${
					theme === "dark" ? "bg-customGray" : "bg-slate-200"
				}`}
			></textarea>
			<button
				type="submit"
				className="w-9 h-9 rounded-full p-2 cursor-pointer bg-blue-500 text-customWhite flex items-center justify-center absolute bottom-5 right-3 xl:w-11 xl:h-11 xl:p-3"
			>
				<Send />
			</button>
		</form>
	);
};

export default MessageForm;
