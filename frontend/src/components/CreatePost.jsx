import React, { useState } from "react";
import { useSelector } from "react-redux";
import { validatePost } from "../helpers/formValidation";
import { useCreatePostMutation, useCreatePostProfileMutation } from "../mutation/post";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const CreatePost = () => {
	const location = useLocation();

	const [postContent, setPostContent] = useState("");
	const [postPicture, setPostPicture] = useState(null);

	const [postContentError, setPostContentError] = useState("");
	const [postPictureError, setPostPictureError] = useState("");

	const theme = useSelector((state) => state.themeReducer.theme);
	const createPostMutation = useCreatePostMutation();
	const createPostProfileMutation = useCreatePostProfileMutation();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const postContent = e.target.postContent.value;
		const postPicture = e.target.postPicture.files[0];

		if (
			!validatePost(
				postContent,
				setPostContentError,
				postPicture,
				setPostPictureError
			)
		)
			return;

		const toastId = toast.loading("Loading...");

		try {
			if (location.pathname === "/") {
				createPostMutation.mutate(
					{ postContent, postPicture },
					{
						onSuccess: () => {
							setPostContent("");
							toast.success("Create Post Successfully", { id: toastId });
							document.getElementById("postPicture").value = null;
							document.getElementById("my_modal_3").close();
						},
						onError: (error) => {
							toast.error("An error occurred", { id: toastId });
							console.log("Create Post Error: ", error);
						},
					}
				);
			} else {
				createPostProfileMutation.mutate(
					{ postContent, postPicture },
					{
						onSuccess: () => {
							setPostContent("");
							toast.success("Create Post Successfully", { id: toastId });
							document.getElementById("postPicture").value = null;
							document.getElementById("my_modal_3").close();
						},
						onError: (error) => {
							toast.error("An error occurred", { id: toastId });
							console.log("Create Post Error: ", error);
						},
					}
				);
			}
			
		} catch (error) {
			toast.error("An unexpected error occurred", { id: toastId });
			console.log("Create Post Error: ", error);
		}
	};

	return (
		<dialog id="my_modal_3" className="modal ">
			<div
				className={`modal-box ${
					theme === "dark"
						? "bg-customGray text-customWhite"
						: "bg-customWhite text-customBlack"
				}`}
			>
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
					onSubmit={(e) => handleSubmit(e, postContent, postPicture)}
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
