import React, { useState } from "react";
import { useSelector } from "react-redux";
import { validatePost } from "../helpers/formValidation";
import { API } from "../constants/endpoints";

import axios from "axios";
import toast from "react-hot-toast";

const CreatePost = () => {
	const [postContent, setPostContent] = useState("");
	const [postPicture, setPostPicture] = useState(null);

	const [postContentError, setPostContentError] = useState("");
	const [postPictureError, setPostPictureError] = useState("");

	const theme = useSelector((state) => state.themeReducer.theme)

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			!validatePost(
				postContent,
				setPostContentError,
				postPicture,
				setPostPictureError
			)
		)
			return;

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
			if (response) {
				setPostContent("");
				document.getElementById("postPicture").value = null;
				document.getElementById("my_modal_3").close();
			}
		} catch (error) {
			toast.error(error.response.data.message);
			console.log("Create Post Error: ", error);
		}
	};

	return (
		<dialog id="my_modal_3" className="modal ">
			<div className={`modal-box ${theme === "dark" ? "bg-customGray text-customWhite" : "bg-customWhite text-customBlack"}`}>
				<form method="dialog">
					<button
					 	type="button"
						onClick={() => {
							document.getElementById("my_modal_3").close();
							setPostContentError("");
							setPostPictureError("");
						}}
						className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					>
						✕
					</button>
				</form>
				<h3 className="font-bold text-xl text-center">Create Post</h3>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-5 mt-1"
					encType="multipart/form-data"
				>
					<div className="flex flex-col gap-2">
						<label htmlFor="postContent" className="cursor-pointer">
							Post content
						</label>
						<textarea
							name="postContent"
							id="postContent"
							rows="3"
							value={postContent}
							onChange={(e) => {
								setPostContent(e.target.value);
								setPostContentError("");
							}}
							className="p-2 border-2 bg-customWhite text-customBlack"
						></textarea>
					</div>
					{postContentError && (
						<p className="text-red-500 text-xs font-semibold">
							{postContentError}
						</p>
					)}
					<input
						type="file"
						name="postPicture"
						id="postPicture"
						className="w-max cursor-pointer"
						onChange={(e) => {
							setPostPicture(e.target.files[0]);
							setPostPictureError("");
						}}
					/>
					{postPictureError && (
						<p className="text-red-500 text-xs font-semibold">
							{postPictureError}
						</p>
					)}
					<div className="flex items-center justify-center gap-5">
						<button
						 	type="button"
							onClick={() => {
								document.getElementById("my_modal_3").close();
								setPostContentError("");
								setPostPictureError("");
							}}
							className="px-10 py-2 border-2 bg-customWhite text-customBlack font-semibold cursor-pointer"
						>
							Close
						</button>
						<input
							type="submit"
							value="Post"
							className="px-10 py-2 bg-blue-500 text-customWhite font-semibold cursor-pointer"
						/>
					</div>
				</form>
			</div>
		</dialog>
	);
};

export default CreatePost;
