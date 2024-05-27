import { API } from "../constants/endpoints";
import axios from "axios";

export const getPosts = async () => {
    try {
        const response = await axios.get(API.GET_POSTS, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data.data
    } catch (error) {
        console.log("Get Posts Error: ", error);
    }
};

export const createPost = async (postContent, postPicture) => {
    try {
        const formData = new FormData();
        formData.append("postContent", postContent);
        formData.append("postPicture", postPicture);

        const response = await axios.post(
            API.CREATE_POST,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem(
                        "token"
                    )}`,
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.log("Creating Post Error: ", error);
    }
};

export const getUserPosts = async (userId) => {
    try {
        const response = await axios.get(
            API.GET_USER_POSTS(userId),
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "token"
                    )}`,
                },
            }
        );
        return response.data.data
    } catch (error) {
        console.log("Get Posts Error: ", error);
    }
};