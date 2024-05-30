import axios from "axios";
import { API } from "../constants/endpoints";

export const loginUser = async (email, password) => {
	try {
		const response = await axios.post(API.LOGIN, {
			email,
			password,
		});

		return response.data;
	} catch (error) {
		console.log("Login Error: ", error);
	}
};
