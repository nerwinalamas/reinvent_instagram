import { API } from "../constants/endpoints";
import axios from "axios";

export const getConversation = async (userId) => {
	try {
		const response = await axios.get(API.GET_CONVERSATION(userId), {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get Conversation Error: ", error);
	}
};

export const getChatmates = async () => {
	try {
		const response = await axios.get(API.FOLLOWING, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get Chatmates Error: ", error);
	}
};

export const sendMessage = async (userId, message) => {
	try {
		const response = await axios.post(
			API.SEND_MESSAGE(userId),
			{ message },
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Sending Message Error: ", error);
	}
};
