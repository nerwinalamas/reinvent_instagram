import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateProfilePhotoMutation } from "../mutation/user";
import useAuthStore from "../store/useAuth";

const UploadProfilePic = () => {
	const [profilePicture, setProfilePicture] = useState(null);
	const [profilePictureError, setProfilePictureError] = useState("");

	const { token, user: currentUser } = useAuthStore();
	const navigate = useNavigate();

	const updateProfilePhotoMutation = useUpdateProfilePhotoMutation();

	const handleChangeProfilePic = async (e, userId) => {
		e.preventDefault();

		const profilePicture = e.target.profilePicture.files[0];
		const toastId = toast.loading("Uploading Profile Photo...");
		try {
			updateProfilePhotoMutation.mutate(
				{ userId, profilePicture, token },
				{
					onSuccess: () => {
						toast.success("Profile Photo Updated Succesfully!", {
							id: toastId,
						});
						navigate("/");
					},
				}
			);
		} catch (error) {
			toast.error("An unexpected error occurred", { id: toastId });
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
