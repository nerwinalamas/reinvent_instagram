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
                    Authorization: `Bearer ${localStorage.getItem(
                        "token"
                    )}`,
                },
            }
        );

        return response.data.data
    } catch (error) {
        console.log("Changing Profile Photo Error: ", error);
    }
};