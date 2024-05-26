import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConversation } from "../_actions/convoAction";
import { useSocket } from "../context/SocketContext";
import { API } from "../constants/endpoints";

import axios from "axios";
import { Send } from "lucide-react";

const MessageForm = ({ getConversation }) => {
	const [message, setMessage] = useState("");
	const theme = useSelector((state) => state.themeReducer.theme);
	const convo = useSelector((state) => state.convoReducer.convo);
    const selectedChat = useSelector((state) => state.convoReducer.selectedChat);
    const user = useSelector((state) => state.userReducer.user);
	const { socket } = useSocket();

	const dispatch = useDispatch();

	const handleSendMessage = async (e, id) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				API.SEND_MESSAGE(id),
				{ message },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
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
