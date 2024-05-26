import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfilePic } from "../_actions/userAction";
import { API } from "../constants/endpoints";

import axios from "axios";
import toast from "react-hot-toast";

const UploadProfilePic = () => {
	const [profilePicture, setProfilePicture] = useState(null);
	const [profilePictureError, setProfilePictureError] = useState("");

	const currentUser = useSelector((state) => state.userReducer.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleChangeProfilePic = async (e, userId) => {
		e.preventDefault();

		try {
			// if (!profilePicture) {
			// 	setProfilePictureError("Please select a profile picture.");
			// 	return;
			// }

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
			if (response) {
				toast.success(response.data.message);
				dispatch(setProfilePic(response.data.data.profilePicture));
				navigate("/");
			}
		} catch (error) {
			console.log("Change Profile Picture Error: ", error);
		}
	};

	return (
		<main className="h-screen flex items-center justify-center">
			<form
				onSubmit={(e) => handleChangeProfilePic(e, currentUser._id)}
				encType="multipart/form-data"
				className="w-80 flex flex-col gap-1 p-5 rounded-sm bg-customWhite text-customBlack xl:w-96"
			>
				<h2 className="text-center text-2xl font-semibold">
					Upload Photo
				</h2>
				<label htmlFor="profilePicture">Profile Picture</label>
				<input
					type="file"
					name="profilePicture"
					id="profilePicture"
					onChange={(e) => {
						setProfilePicture(e.target.files[0]);
						setProfilePictureError("");
					}}
					className="p-2 border-2 bg-customWhite"
				/>
				{profilePictureError && (
					<p className="text-red-500 text-xs font-semibold">
						{profilePictureError}
					</p>
				)}
				<input
					type="submit"
					value="Save"
					className="p-2 border my-2 rounded-sm bg-customBlack text-customWhite cursor-pointer"
				/>
			</form>
		</main>
	);
};

export default UploadProfilePic;
