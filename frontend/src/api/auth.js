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

export const registerUser = async (
	email,
	firstName,
	lastName,
	userName,
	password
) => {
	try {
		const response = await axios.post(API.REGISTER, {
			email,
			firstName,
			lastName,
			userName,
			password,
		});

		return response.data;
	} catch (error) {
		console.log("Registration Error: ", error);
	}
};
