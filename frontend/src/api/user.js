import { API } from "../constants/endpoints";
import axios from "axios";

export const updateProfilePhoto = async (userId, profilePicture) => {
	try {
		const formData = new FormData();
		formData.append("profilePicture", profilePicture);

		const response = await axios.put(
			API.UPDATE_PROFILE_PHOTO(userId),
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Changing Profile Photo Error: ", error);
	}
};

export const searchUser = async (isSearching) => {
	try {
		const response = await axios.get(API.SEARCH_USER(isSearching), {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Search User Error: ", error);
	}
};

export const getUser = async (userId) => {
	try {
		const response = await axios.get(API.GET_USER(userId), {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Calling User Error: ", error);
	}
};
