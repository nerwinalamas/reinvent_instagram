import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setClickedOtherPost, setOtherUser } from "../_actions/otherUserAction";
import { API } from "../constants/endpoints";
import axios from "axios";

import PostModal from "../components/PostModal";
import PostReaction from "../components/PostReaction";
import PostUserInfo from "../components/PostUserInfo";
import UserProfile from "../components/UserProfile";
import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../api/post";
import {
	useLikePostProfileMutation,
	useSavePostProfileMutation,
	useUnLikePostProfileMutation,
	useUnsavePostProfileMutation,
} from "../mutation/post";
import useAuthStore from "../store/useAuth";
import useThemeStore from "../store/useTheme";

const Profile = () => {
	const { id } = useParams();

	// otherUser
	const user = useSelector((state) => state.otherUserReducer.otherUser);
	const clickedOtherPost = useSelector(
		(state) => state.otherUserReducer.clickedOtherPost
	);

	const { token, user: currentUser } = useAuthStore();
	const { theme } = useThemeStore();
	const dispatch = useDispatch();

	const likePostMutation = useLikePostProfileMutation();
	const unlikePostMutation = useUnLikePostProfileMutation();
	const savePostMutation = useSavePostProfileMutation();
	const unsavePostMutation = useUnsavePostProfileMutation();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["userPosts", id, token],
		queryFn: () => getUserPosts(id, token),
	});

	// TODO
	const getUser = async (userId) => {
		try {
			const response = await axios.get(API.GET_USER(userId), {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			dispatch(setOtherUser(response.data.data));
		} catch (error) {
			console.log("Get User Profile Error: ", error);
		}
	};

	useEffect(() => {
		getUser(id);
	}, [id, user]);

	const handleClick = (post) => {
		dispatch(setClickedOtherPost(post));
		document.getElementById("post_modal").showModal();
	};

	const handleLike = (postId, isLiked) => {
		try {
			if (isLiked) {
				unlikePostMutation.mutate(postId, token);
			} else {
				likePostMutation.mutate(postId, token);
			}
		} catch (error) {
			console.log("Like/Unlike Post Error: ", error);
		}
	};

	const handleSavePost = (postId, isSaved) => {
		try {
			if (isSaved) {
				unsavePostMutation.mutate(postId, token);
			} else {
				savePostMutation.mutate(postId, token);
			}
		} catch (error) {
			console.log("Save/Unsave Post Error: ", error);
		}
	};

	return (
		<div className="h-auto flex flex-col gap-5">
			{/* USER PROFILE */}
			<UserProfile userId={id} />
			{/* USER POSTS */}
			<div className="flex flex-col items-center gap-5 pb-10">
				{isLoading ? (
					<p>Loading...</p>
				) : isError ? (
					<p>Error: {error}</p>
				) : data.length > 0 ? (
					data.map((post) => (
						<div
							key={post._id}
							className={`w-80 p-3  rounded-md flex flex-col gap-2 md:w-96 md:gap-5 lg:p-5 xl:w-[600px] xl:gap-1 ${
								theme === "dark"
									? "bg-customGray"
									: "bg-slate-100"
							}`}
						>
							{/* USER INFO */}
							<PostUserInfo post={post} user={user} />
							{/* PICTURE SECTION */}
							<img
								src={post.postPicture}
								alt="Sample Image"
								className={`xl:max-h-[500px] object-contain rounded-md ${
									theme === "dark"
										? "bg-customBlack"
										: "bg-slate-200"
								}`}
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
