import { API } from "../constants/endpoints";
import axios from "axios";

export const getPosts = async (token) => {
	try {
		const response = await axios.get(API.GET_POSTS, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get Posts Error: ", error);
	}
};

export const createPost = async (postContent, postPicture, token) => {
	try {
		const formData = new FormData();
		formData.append("postContent", postContent);
		formData.append("postPicture", postPicture);

		const response = await axios.post(API.CREATE_POST, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Creating Post Error: ", error);
	}
};

export const updatePost = async (postId, postContent, postPicture, token) => {
	try {
		const formData = new FormData();
		formData.append("postContent", postContent);
		formData.append("postPicture", postPicture);

		const response = await axios.put(API.UPDATE_POST(postId), formData, {
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.error("Updating Post Error:", error);
	}
};

export const deletePost = async (postId, token) => {
	try {
		const response = await axios.delete(API.DELETE_POST(postId), {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Deleting Post Error: ", error);
	}
};

export const getUserPosts = async (userId, token) => {
	try {
		const response = await axios.get(API.GET_USER_POSTS(userId), {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get User Posts Error: ", error);
	}
};

export const likePost = async (postId, token) => {
	try {
		const response = await axios.post(
			API.LIKE_POST(postId),
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Like Post Error: ", error);
	}
};

export const unlikePost = async (postId, token) => {
	try {
		const response = await axios.post(
			API.UNLIKE_POST(postId),
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Unlike Post Error: ", error);
	}
};

export const savePost = async (postId, token) => {
	try {
		const response = await axios.post(
			API.SAVE_POST(postId),
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Saved Post Error: ", error);
	}
};

export const unsavePost = async (postId, token) => {
	try {
		const response = await axios.delete(API.UNSAVE_POST(postId), {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Unsaved Post Error: ", error);
	}
};

export const createComment = async (postId, comment, token) => {
	try {
		const response = await axios.post(
			API.CREATE_COMMENT(postId),
			{ comment },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Comment Post Error: ", error);
	}
};

export const deleteComment = async (postId, commentId, token) => {
	try {
		const response = await axios.delete(
			API.DELETE_COMMENT(postId, commentId),
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.data.data;
	} catch (error) {
		console.log("Deleting Comment Error: ", error);
	}
};

export const getExplorePosts = async (token) => {
	try {
		const response = await axios.get(API.GET_EXPLORE_POSTS, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get Explore Posts Error: ", error);
	}
};

export const getSavedPosts = async (token) => {
	try {
		const response = await axios.get(API.GET_SAVED_POSTS, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data.data;
	} catch (error) {
		console.log("Get Saved Posts Error: ", error);
	}
};
