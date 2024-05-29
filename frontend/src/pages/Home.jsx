import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../_actions/userAction";
import { setClickedPost } from "../_actions/postsAction";
import { API } from "../constants/endpoints";

import PostUserInfo from "../components/PostUserInfo";
import PostReaction from "../components/PostReaction";
import PostModal from "../components/PostModal";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../api/post";
import {
	useLikePostMutation,
	useSavePostMutation,
	useUnLikePostMutation,
	useUnsavePostMutation,
} from "../mutation/post";

const Home = () => {
	const user = useSelector((state) => state.userReducer.user);
	const clickedPost = useSelector((state) => state.postReducer.clickedPost);
	const theme = useSelector((state) => state.themeReducer.theme);

	const likePostMutation = useLikePostMutation();
	const unlikePostMutation = useUnLikePostMutation();
	const savePostMutation = useSavePostMutation();
	const unsavePostMutation = useUnsavePostMutation();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["posts"],
		queryFn: getPosts,
	});

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!localStorage.getItem("token")) {
			navigate("/login");
		}
	}, []);

	const fetchUser = async () => {
		try {
			const response = await axios.get(API.LOGGED_IN_USER, {
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

	const handleClick = (post) => {
		dispatch(setClickedPost(post));
		document.getElementById("post_modal").showModal();
	};

	const handleLike = (postId, isLiked) => {
		try {
			if (isLiked) {
				unlikePostMutation.mutate(postId);
			} else {
				likePostMutation.mutate(postId);
			}
		} catch (error) {
			console.log("Like/Unlike Post Error: ", error);
		}
	};

	const handleSavePost = (postId, isSaved) => {
		try {
			if (isSaved) {
				unsavePostMutation.mutate(postId);
			} else {
				savePostMutation.mutate(postId);
			}
		} catch (error) {
			console.log("Save/Unsave Post Error: ", error);
		}
	};

	return (
		<div className="w-screen px-5 flex flex-col items-center gap-5 pb-10 md:px-10 md:py-7 xl:flex xl:justify-between xl:gap-5 xl:py-0 xl:w-[99%] xl:mx-auto">
			{/* POST CARD */}
			{isLoading ? (
				<p>Loading...</p>
			) : isError ? (
				<p>Error: {error}</p>
			) : data.length > 0 ? (
				data.map((post) => (
					<div
						key={post._id}
						className={`w-80 p-3  rounded-md flex flex-col gap-2 md:w-96 md:gap-5 lg:p-5 xl:w-[600px] xl:gap-1 ${
							theme === "dark" ? "bg-customGray" : "bg-slate-100"
						}`}
					>
						{/* USER INFO */}
						<PostUserInfo post={post} user={user} />
						{/* PICTURE SECTION */}
						<img
							src={post.postPicture}
							alt="post photo"
							className={`xl:max-h-[500px] object-contain rounded-md ${
								theme === "dark"
									? "bg-customBlack"
									: "bg-slate-200"
							}`}
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
				<p>No posts</p>
			)}
		</div>
	);
};

export default Home;
