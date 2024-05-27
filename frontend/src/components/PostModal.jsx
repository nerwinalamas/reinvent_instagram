import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { API } from "../constants/endpoints";
import moment from "moment";
import { Bookmark, MessageCircle, Redo2, ThumbsUp } from "lucide-react";
import {
	useCommentPostMutation,
	useCommentPostProfileMutation,
	useDeleteCommentPostMutation,
	useDeleteCommentPostProfileMutation,
} from "../mutation/post";
import toast from "react-hot-toast";

const PostModal = ({
	user,
	clickedPost,
	setClickedPost,
	handleLike,
	handleSavePost,
}) => {
	const location = useLocation();
	const [newComment, setNewComment] = useState("");
	const theme = useSelector((state) => state.themeReducer.theme);
	const createCommentMutation = useCommentPostMutation();
	const deleteCommentMutation = useDeleteCommentPostMutation();
	const createCommentProfileMutation = useCommentPostProfileMutation();
	const deleteCommentProfileMutation = useDeleteCommentPostProfileMutation();

	const handleComment = async (e, postId) => {
		e.preventDefault();

		try {
			if (location.pathname === "/") {
				await createCommentMutation.mutateAsync({
					postId,
					comment: newComment,
				});
			} else {
				await createCommentProfileMutation.mutateAsync({
					postId,
					comment: newComment,
				});
			}

			setNewComment("");
			document.getElementById("post_modal").close(); // BAD FOR UX
		} catch (error) {
			console.log("Create Comment Error: ", error);
		}
	};

	const handleDeleteComment = async (postId, commentId) => {
		try {
			if (location.pathname === "/") {
				deleteCommentMutation.mutate({ postId, commentId });
			} else {
				deleteCommentProfileMutation.mutate({ postId, commentId });
			}

			toast.success("Deleting Comment Successfully!");
			document.getElementById("post_modal").close(); // BAD FOR UX
		} catch (error) {
			console.log("Deleting Comment Error: ", error);
		}
	};

	return (
		<dialog id="post_modal" className="modal">
			<div
				className={`modal-box w-11/12 max-h-[90vh] max-w-5xl  ${
					theme === "dark" ? "bg-customBlack" : "bg-slate-100"
				}`}
			>
				<form method="dialog">
					<button
						onClick={() => setClickedPost(null)}
						className=" btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					>
						✕
					</button>
				</form>
				{clickedPost && (
					<div className="w-full flex flex-col gap-5 md:w-full lg:gap-4">
						<div className="w-full flex items-center gap-5">
							<Link to={`/profile/${clickedPost.postedBy._id}`}>
								{clickedPost.postedBy.profilePicture ? (
									<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
										<img
											src={API.GET_PHOTO_URL(
												clickedPost.postedBy
													.profilePicture
											)}
											alt=""
											className="w-full h-full rounded-full object-contain"
										/>
									</div>
								) : (
									<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack  flex items-center justify-center">
										<p className="capitalize font-bold text-xl">
											{clickedPost.postedBy.firstName &&
												clickedPost.postedBy.firstName.charAt(
													0
												)}
										</p>
									</div>
								)}
							</Link>
							<div>
								<p className="capitalize hover:underline">
									{clickedPost.postedBy.firstName}{" "}
									{clickedPost.postedBy.lastName}
								</p>
								<p className="text-slate-400 text-xs">
									{moment(
										clickedPost.postedBy.createdAt
									).fromNow()}
								</p>
							</div>
						</div>
						{/* CONTENT SECTION */}
						<div className="h-[60vh] overflow-y-auto flex flex-col gap-5 lg:flex-row">
							<img
								src={API.GET_PHOTO_URL(clickedPost.postPicture)}
								alt="Sample Image"
								className={`h-80 xl:max-h-[500px] object-contain rounded-md lg:h-full lg:w-[50vw] xl:w-full ${
									theme === "dark"
										? "bg-black"
										: "bg-slate-200"
								}`}
							/>

							<div className="flex flex-col gap-3 mt-2 lg:hidden">
								{/* REACTION SECTION */}
								<div className="flex justify-between">
									<div className="flex gap-5">
										<ThumbsUp
											className="cursor-pointer"
											title="Like"
											onClick={() =>
												handleLike(
													clickedPost._id,
													clickedPost.likes.some(
														(like) =>
															like._id ===
															user._id
													)
												)
											}
											color={
												clickedPost.likes.some(
													(like) =>
														like._id === user._id
												)
													? "green"
													: "white"
											}
										/>
										<MessageCircle
											className="cursor-pointer"
											title="Comment"
										/>
										<Redo2
											className="cursor-pointer"
											title="Share"
										/>
									</div>
									<Bookmark
										className="cursor-pointer"
										title="Save"
										onClick={() =>
											handleSavePost(
												clickedPost._id,
												user.savedPosts.includes(
													clickedPost._id
												)
											)
										}
										color={
											user.savedPosts.includes(
												clickedPost._id
											)
												? "yellow"
												: "white"
										}
									/>
								</div>
								<p className="text-xs text-slate-300">
									{clickedPost.likes.length}{" "}
									{clickedPost.likes.length > 1
										? "likes"
										: "like"}
								</p>
							</div>

							{/* COMMENT SECTION */}
							{clickedPost && (
								<div className="flex flex-col gap-3 lg:w-full lg:overflow-y-auto xl:w-[30vw]">
									{clickedPost.comments.length > 0 ? (
										clickedPost.comments.map((comment) => (
											<div
												key={comment._id}
												className="flex flex-col gap-1"
											>
												<div
													className={`flex flex-col gap-1 text-sm p-2 rounded-md  ${
														theme === "dark"
															? "bg-slate-800"
															: "bg-slate-200"
													}`}
												>
													<p className="hover:underline font-bold cursor-pointer capitalize">
														{
															comment.postedBy
																.firstName
														}{" "}
														{
															comment.postedBy
																.lastName
														}
													</p>
													<p
														className={`${
															theme === "dark"
																? "text-slate-200"
																: "text-customBlack"
														}`}
													>
														{comment.comment &&
															comment.comment}
													</p>
												</div>
												{comment.postedBy._id ===
													user._id && (
													<div className="flex gap-5 text-xs self-end pr-5">
														<p
															onClick={() =>
																handleDeleteComment(
																	clickedPost._id,
																	comment._id
																)
															}
															className="text-red-500 hover:underline cursor-pointer"
														>
															Delete
														</p>
													</div>
												)}
											</div>
										))
									) : (
										<p>No comments</p>
									)}
								</div>
							)}
						</div>
						<div className="hidden lg:flex lg:flex-col lg:gap-1">
							{/* REACTION SECTION */}
							<div className="flex justify-between">
								<div className="flex gap-5">
									<ThumbsUp
										className="cursor-pointer"
										title="Like"
										onClick={() =>
											handleLike(
												clickedPost._id,
												clickedPost.likes.some(
													(like) =>
														like._id === user._id
												)
											)
										}
										color={
											clickedPost.likes.some(
												(like) => like._id === user._id
											)
												? "green"
												: "white"
										}
									/>
									<MessageCircle
										className="cursor-pointer"
										title="Comment"
									/>
									<Redo2
										className="cursor-pointer"
										title="Share"
									/>
								</div>
								<Bookmark
									className="cursor-pointer"
									title="Save"
									onClick={() =>
										handleSavePost(
											clickedPost._id,
											user.savedPosts.includes(
												clickedPost._id
											)
										)
									}
									color={
										user.savedPosts.includes(
											clickedPost._id
										)
											? "yellow"
											: "white"
									}
								/>
							</div>
							<p className="text-xs text-slate-300">
								{clickedPost.likes.length}{" "}
								{clickedPost.likes.length > 1
									? "likes"
									: "like"}
							</p>
						</div>
						<form
							onSubmit={(e) => handleComment(e, clickedPost._id)}
							className="flex gap-2"
						>
							<input
								type="text"
								name="comment"
								id="comment"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								className={`w-full p-2 rounded-sm border ${
									theme === "dark"
										? "bg-customBlack"
										: "bg-slate-200"
								}`}
							/>
							<input
								type="submit"
								value="Send"
								className="p-2 rounded-sm bg-blue-500 cursor-pointer text-customWhite"
							/>
						</form>
					</div>
				)}
			</div>
		</dialog>
	);
};

export default PostModal;
