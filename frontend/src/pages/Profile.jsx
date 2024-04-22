
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savedPosts, unsavedPosts } from "../_actions/userAction";
import { likePost, setClickedPost, unlikePost } from "../_actions/postsAction";

import PostModal from "../components/PostModal";
import PostReaction from "../components/PostReaction";
import PostUserInfo from "../components/PostUserInfo";
import UserProfile from "../components/UserProfile";

import axios from "axios";
import { likeOtherPost, savedOtherPosts, setClickedOtherPost, setOtherUser, setOtherUserPosts, unlikeOtherPost, unsavedOtherPosts } from "../_actions/otherUserAction";
import { Bookmark, MessageCircle, Redo2, ThumbsUp } from "lucide-react";

const Profile = () => {
	const { id } = useParams();

	// otherUser
	const user = useSelector((state) => state.otherUserReducer.otherUser)
	const otherUserPosts = useSelector((state) => state.otherUserReducer.otherUserPosts)
	const clickedOtherPost = useSelector((state) => state.otherUserReducer.clickedOtherPost);

	// console.log("otherUser: ", otherUser)
	// console.log("otherUserPosts: ", otherUserPosts)

	// console.log("user: ", user)

	const currentUser = useSelector((state) => state.userReducer.user);
	// const clickedPost = useSelector((state) => state.postReducer.clickedPost);
	const theme = useSelector((state) => state.themeReducer.theme)
	const dispatch = useDispatch();

	const getUser = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/user/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			dispatch(setOtherUser(response.data.data))
		} catch (error) {
			console.log("Get User Profile Error: ", error);
		}
	};

	useEffect(() => {
		getUser(id);
	}, [id, user]);

	const getPosts = async (userId) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/post/user/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			dispatch(setOtherUserPosts(response.data.data))
		} catch (error) {
			console.log("Get Posts Error: ", error);
		}
	};

	useEffect(() => {
		getPosts(id);
	}, [otherUserPosts, dispatch, user._id]);


	const handleClick = (post) => {
		dispatch(setClickedOtherPost(post));
		document.getElementById("post_modal").showModal();
	};

	const handleLike = async (postId, isLiked) => {
		try {
			if (isLiked) {
				const response = await axios.post(
					`http://localhost:5000/post/${postId}/unlike`,
					{},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				// dispatch(unlikePost(postId, currentUser._id));
				dispatch(unlikeOtherPost(postId, currentUser._id));
				const updatedLikes = clickedOtherPost.likes.filter(
					(likeId) => likeId !== user._id
				);
				dispatch(
					setClickedOtherPost({ ...clickedOtherPost, likes: updatedLikes })
				);
			} else {
				const response = await axios.post(
					`http://localhost:5000/post/${postId}/like`,
					{},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				// dispatch(likePost(postId, currentUser._id));
				dispatch(likeOtherPost(postId, currentUser._id));
				dispatch(
					setClickedOtherPost({
						...clickedOtherPost,
						likes: [...clickedOtherPost.likes, currentUser._id],
					})
				);
			}
		} catch (error) {
			console.log("Like Posts Error: ", error);
		}
	};
	
	const handleSavePost = async (postId, isSaved) => {
		try {
			if (isSaved) {
				const response = await axios.delete(
					`http://localhost:5000/post/unsave/${postId}`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				dispatch(unsavedOtherPosts(postId));
				dispatch(unsavedPosts(postId));
				const updatedSavedPosts = clickedOtherPost.savedPosts.filter(
					(savedPostId) => savedPostId !== postId
				);
				dispatch(
					setClickedOtherPost({
						...clickedOtherPost,
						savedPosts: updatedSavedPosts,
					})
				);
			} else {
				const response = await axios.post(
					`http://localhost:5000/post/save/${postId}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				dispatch(savedOtherPosts(postId));
				dispatch(savedPosts(postId));
				dispatch(
					setClickedOtherPost({
						...clickedOtherPost,
						savedPosts: [...clickedOtherPost.savedPosts, postId],
					})
				);
			}
		} catch (error) {
			console.log("Save Post Error: ", error);
		}
	};

	return (
		<div className="h-auto flex flex-col gap-5">
			{/* USER PROFILE */}
			<UserProfile />
			{/* USER POSTS */}
			<div className="flex flex-col items-center gap-5 pb-10">
				{otherUserPosts.length > 0 ? (
					otherUserPosts.map((post) => (
						<div
							key={post._id}
							className={`w-80 p-3  rounded-md flex flex-col gap-2 md:w-96 md:gap-5 lg:p-5 xl:w-[600px] xl:gap-1 ${theme === "dark" ? "bg-customGray" : "bg-slate-100" }`}
						>
							{/* USER INFO */}
							<PostUserInfo post={post} user={user} />
							{/* PICTURE SECTION */}
							<img
								src={`http://localhost:5000/uploads/${post.postPicture}`}
								alt="Sample Image"
								className={`xl:max-h-[500px] object-contain rounded-md ${theme === "dark" ? "bg-customBlack" : "bg-slate-200" }`}
							/>
							{/* REACTION SECTION */}

							<PostReaction
								post={post}
								user={currentUser}
								handleClick={handleClick}
								handleLike={handleLike}
								handleSavePost={handleSavePost}
							/>

							{/* POST DESCRIPTION SECTION */}
							<div className="text-sm p-2 line-clamp-1">
								{post.postContent}
							</div>
							<p
								onClick={() => handleClick(post)}
								className="p-2 text-sm text-slate-300 hover:underline cursor-pointer"
							>
								view all comments
							</p>

							{/* POST MODAL */}
							<PostModal
								user={currentUser}
								clickedPost={clickedOtherPost}
								setClickedPost={setClickedOtherPost}
								handleLike={handleLike}
								handleSavePost={handleSavePost}
							/>
						</div>
					))
				) : (
					<p>No posts</p>
				)}
			</div>
		</div>
	);
};

export default Profile;
