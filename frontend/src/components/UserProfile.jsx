import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../_actions/userAction";

import axios from "axios";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import { followOtherUser, unfollowOtherUser } from "../_actions/otherUserAction";

const UserProfile = () => {
	const currentUser = useSelector((state) => state.userReducer.user);
	const otherUser = useSelector((state) => state.otherUserReducer.otherUser)
	const otherUserPosts = useSelector((state) => state.otherUserReducer.otherUserPosts)
	const theme = useSelector((state) => state.themeReducer.theme);

	const dispatch = useDispatch();

	// console.log("otherUser: ", otherUser);
	// console.log("currentUser: ", currentUser);

	const handleFollow = async (id) => {
		try {
			const response = await axios.post(
				`http://localhost:5000/follow-toggle/${id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			if (response.data.message === "Followed user") {
				// dispatch(followUser(id));
				dispatch(followOtherUser(id));
			} else if (response.data.message === "Unfollowed user") {
				// dispatch(unfollowUser(id));
				dispatch(unfollowOtherUser(id));
			}
		} catch (error) {
			console.log("Follow User Error: ", error);
		}
	};

	return (
		<div
			className={`w-80 relative p-5 flex flex-col gap-2 items-center justify-center mx-auto rounded-md md:w-96 xl:h-fit xl:xl:w-[600px] ${
				theme === "dark" ? "bg-customGray" : "bg-slate-100"
			}`}
		>
			<div
				className={`w-32 h-32 rounded-full flex  items-center justify-center relative ${
					otherUser.profilePicture
						? "bg-customBlack"
						: "bg-customWhite text-customBlack "
				}`}
			>
				{otherUser.profilePicture ? (
					<img
						src={`http://localhost:5000/uploads/${otherUser.profilePicture}`}
						alt=""
						className="w-full h-full rounded-full object-contain"
					/>
				) : (
					<p className="capitalize font-semibold text-5xl">
						{otherUser.firstName && otherUser.firstName.charAt(0)}
					</p>
				)}
			</div>

			{otherUser._id && currentUser._id && otherUser._id === currentUser._id && (
				<Link
					to={`/edit/profile/${currentUser._id}`}
					className="absolute right-3 top-3 text-blue-500 hover:underline cursor-pointer xl:right-5 xl:top-5"
				>
					Upload Photo
				</Link>
			)}

			{otherUser._id &&
				currentUser._id &&
				otherUser._id !== currentUser._id &&
				!otherUser.followers.find(follower => follower._id === currentUser._id) && (
					<p
						onClick={() => handleFollow(otherUser._id)}
						className="absolute right-3 top-3 text-blue-500 hover:underline cursor-pointer xl:right-5 xl:top-5"
					>
						Follow
					</p>
			)}

			{otherUser._id &&
				currentUser._id &&
				otherUser._id !== currentUser._id &&
				otherUser.followers.find(follower => follower._id === currentUser._id) && (
					<p
						onClick={() => handleFollow(otherUser._id)}
						className="absolute right-3 top-3 text-blue-500 hover:underline cursor-pointer xl:right-5 xl:top-5"
					>
						Unfollow
					</p>
			)}

			<div className="flex flex-col gap-1 text-center">
				<p className="text-lg capitalize font-medium">
					{otherUser.firstName} {otherUser.lastName}
				</p>
				<p className="text-xs">{otherUser.userName}</p>
			</div>
			<div className="flex gap-5 text-sm mt-5">
				<p>
					{otherUserPosts && otherUserPosts.length}{" "}
					{otherUserPosts && otherUserPosts.length > 1 ? "posts" : "post"}
				</p>
				<p
					className="cursor-pointer hover:underline"
					onClick={() =>
						document.getElementById("followers_modal").showModal()
					}
				>
					{otherUser.followers && otherUser.followers.length} followers
				</p>
				<p
					className="cursor-pointer hover:underline"
					onClick={() =>
						document.getElementById("following_modal").showModal()
					}
				>
					{otherUser.following && otherUser.following.length} following
				</p>
			</div>
			<FollowersModal />
			<FollowingModal />
		</div>
	);
};

export default UserProfile;
