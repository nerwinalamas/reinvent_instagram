import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { validatePost } from "../helpers/formValidation";
import toast from "react-hot-toast";
import { useGetPostMutation, useUpdatePostMutation } from "../mutation/post";
import useAuthStore from "../store/useAuth";

const UpdatePost = () => {
	const { id } = useParams();
	const [data, setData] = useState({ postContent: "", postPicture: null });
	const { token } = useAuthStore();
	const updatePostMutation = useUpdatePostMutation();
	const getPostMutation = useGetPostMutation();

	const [postContentError, setPostContentError] = useState("");
	const [postPictureError, setPostPictureError] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		getPostMutation.mutate({ postId: id, token }, {
			onSuccess: (data) => {
				setData(data)
			}
		})
	}, [id])

	const handleSubmit = async (e) => {
		e.preventDefault();

		const postContent = e.target.postContent.value;
		const postPicture = e.target.postPicture.files[0];

		if (
			!validatePost(
				data.postContent,
				setPostContentError,
				data.postPicture,
				setPostPictureError
			)
		)
			return;

		const toastId = toast.loading("Updating Post...");

		try {
			updatePostMutation.mutate(
				{ postId: id, postContent, postPicture, token },
				{
					onSuccess: () => {
						toast.success("Post Updated Successfully", { id: toastId });
						navigate("/");
					},
					onError: (error) => {
						toast.error("An error occurred", { id: toastId });
						console.log("Update Post Error: ", error);
					},
				}
			);
		} catch (error) {
			toast.error("An unexpected error occurred", { id: toastId });
			console.error("Update Post Error:", error);
		}
	};

	return (
		<div className="p-5 flex items-center justify-center">
			<form
				className="w-80 flex flex-col gap-5 mt-1 xl:w-96"
				encType="multipart/form-data"
				onSubmit={handleSubmit}
			>
				<h2 className="text-center text-2xl font-semibold">
					Update Post
				</h2>
				<div className="flex flex-col gap-2">
					<label htmlFor="postContent" className="cursor-pointer">
						Post content
					</label>
					<textarea
						name="postContent"
						id="postContent"
						rows="3"
						value={data.postContent}
						onChange={(e) => {
							setData({ ...data, postContent: e.target.value });
							setPostContentError("");
						}}
						className="p-2 bg-customWhite text-customBlack border rounded-sm"
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
					// value={data.postPicture}
					onChange={(e) => {
						setData({ ...data, postPicture: e.target.files[0] });
						setPostPictureError("");
					}}
					className="w-max cursor-pointer"
				/>
				{postPictureError && (
					<p className="text-red-500 text-xs font-semibold">
						{postPictureError}
					</p>
				)}
				<div className="flex flex-col gap-5 xl:flex-row xl:justify-center">
					<Link
						to="/"
						className="py-2 bg-customWhite text-center text-customBlack border font-semibold cursor-pointer xl:px-10"
					>
						Cancel
					</Link>
					<input
						type="submit"
						value="Update"
						className=" py-2 bg-blue-500 text-customWhite font-semibold cursor-pointer xl:px-10"
					/>
				</div>
			</form>
		</div>
	);
};

export default UpdatePost;
