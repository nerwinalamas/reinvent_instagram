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
