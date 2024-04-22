import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savedPosts, setUser, unsavedPosts } from "../_actions/userAction";
import {
	likePost,
	setClickedPost,
	setPosts,
	unlikePost,
} from "../_actions/postsAction";

import PostUserInfo from "../components/PostUserInfo";
import PostReaction from "../components/PostReaction";
import PostModal from "../components/PostModal";

import axios from "axios";

const Home = () => {
	const posts = useSelector((state) => state.postReducer.posts);
	const user = useSelector((state) => state.userReducer.user);
	const clickedPost = useSelector((state) => state.postReducer.clickedPost);
	const theme = useSelector((state) => state.themeReducer.theme)

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/login");
		}
	}, []);

	const fetchUser = async () => {
		try {
			const response = await axios.get("http://localhost:5000/get-user", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			dispatch(setUser(response.data.data));
		} catch (error) {
			console.log("Error: ", error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, [dispatch]);

	const getPosts = async () => {
		try {
			const response = await axios.get("http://localhost:5000/post", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			dispatch(setPosts(response.data.data));
		} catch (error) {
			console.log("Get Posts Error: ", error);
		}
	};

	useEffect(() => {
		getPosts();
	}, [posts, user]);

	const handleClick = (post) => {
		dispatch(setClickedPost(post));
		document.getElementById("post_modal").showModal();
	};

	const handleLike = async (id, isLiked) => {
		try {
			if (isLiked) {
				const response = await axios.post(
					`http://localhost:5000/post/${id}/unlike`,
					{},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				dispatch(unlikePost(id, user._id));
				const updatedLikes = clickedPost.likes.filter(
					(likeId) => likeId !== user._id
				);
				dispatch(
					setClickedPost({ ...clickedPost, likes: updatedLikes })
				);
			} else {
				const response = await axios.post(
					`http://localhost:5000/post/${id}/like`,
					{},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				dispatch(likePost(id, user._id));
				dispatch(
					setClickedPost({
						...clickedPost,
						likes: [...clickedPost.likes, user._id],
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
				dispatch(unsavedPosts(postId));
				const updatedSavedPosts = clickedPost.savedPosts.filter(
					(savedPostId) => savedPostId !== postId
				);
				dispatch(
					setClickedPost({
						...clickedPost,
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
				dispatch(savedPosts(postId));
				dispatch(
					setClickedPost({
						...clickedPost,
						savedPosts: [...clickedPost.savedPosts, postId],
					})
				);
			}
		} catch (error) {
			console.log("Save Post Error: ", error);
		}
	};

	return (
		<div className="w-screen px-5 flex flex-col items-center gap-5 pb-10 md:px-10 md:py-7 xl:flex xl:justify-between xl:gap-5 xl:py-0 xl:w-[99%] xl:mx-auto">
			{/* POST CARD */}
			{posts.length > 0 ? (
				posts.map((post) => (
					<div
						key={post._id}
						className={`w-80 p-3  rounded-md flex flex-col gap-2 md:w-96 md:gap-5 lg:p-5 xl:w-[600px] xl:gap-1 ${theme === "dark" ? "bg-customGray" : "bg-slate-100" }`}
					>
						{/* USER INFO */}
						<PostUserInfo post={post} user={user} />
						{/* PICTURE SECTION */}
						<img
							src={`http://localhost:5000/uploads/${post.postPicture}`}
							alt="post photo"
							className={`xl:max-h-[500px] object-contain rounded-md ${theme === "dark" ? "bg-customBlack" : "bg-slate-200" }`}
						/>
						{/* REACTION SECTION */}
						<PostReaction
							post={post}
							user={user}
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
							user={user}
							clickedPost={clickedPost}
							setClickedPost={setClickedPost}
							handleLike={handleLike}
							handleSavePost={handleSavePost}
						/>
					</div>
				))
			) : (
				<p>No Posts</p>
			)}
		</div>
	);
};

export default Home;
