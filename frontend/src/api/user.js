import { API } from "../constants/endpoints";
import axios from "axios";

export const updateProfilePhoto = async (userId, profilePicture, token) => {
	try {
		const formData = new FormData();
		formData.append("profilePicture", profilePicture);

		const response = await axios.put(
			API.UPDATE_PROFILE_PHOTO(userId),
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Changing Profile Photo Error: ", error);
	}
};

export const searchUser = async (isSearching, token) => {
	try {
		const response = await axios.get(API.SEARCH_USER(isSearching), {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Search User Error: ", error);
	}
};

export const getUser = async (userId, token) => {
	try {
		const response = await axios.get(API.GET_USER(userId), {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get User Error: ", error);
	}
};

export const loggedInUser = async (token) => {
	try {
		const response = await axios.get(API.LOGGED_IN_USER, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get Logged In User Error: ", error);
	}
};

export const followToggle = async (userId, token) => {
	try {
		const response = await axios.post(
			API.FOLLOW_TOGGLE(userId),
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.log("Follow/Unfollow User Error: ", error);
	}
};
