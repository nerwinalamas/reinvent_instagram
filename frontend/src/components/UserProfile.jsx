import { Link } from "react-router-dom";
import FollowersModal from "./modals/FollowersModal";
import FollowingModal from "./modals/FollowingModal";
import { useQuery } from "@tanstack/react-query";
import { getUserPosts } from "../api/post";
import useAuthStore from "../store/useAuth";
import useThemeStore from "../store/useTheme";
import useUserProfileStore from "../store/useUserProfileStore";
import { useFollowUserToggleMutation } from "../mutation/user";
import toast from "react-hot-toast";

const UserProfile = ({ userId }) => {
	const { otherUser, toggleFollow } = useUserProfileStore();
	const { token, user: currentUser, toggleFollowing } = useAuthStore();
	const { theme } = useThemeStore();
	const followUserToggleMutation = useFollowUserToggleMutation();

	const { data } = useQuery({
		queryKey: ["userPosts", userId, token],
		queryFn: () => getUserPosts(userId, token),
		enabled: !!token,
	});

	const handleFollow = async (userId) => {
		try {
			followUserToggleMutation.mutate(
				{ userId, token },
				{
					onSuccess: (data) => {
						toggleFollow(currentUser._id);
						toggleFollowing(userId);
						toast.success(`${data.message} Successfully`);
					},
					onError: (error) => {
						console.error("Follow/Unfollow User Error:", error);
						toast.error("Error following/unfollowing user");
					},
				}
			);
		} catch (error) {
			console.error("Follow/Unfollow User Error:", error);
			toast.error("Error following/unfollowing user");
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
					otherUser && otherUser.profilePicture
						? "bg-customBlack"
						: "bg-customWhite text-customBlack "
				}`}
			>
				{otherUser && otherUser.profilePicture ? (
					<img
						src={otherUser.profilePicture}
						alt=""
						className="w-full h-full rounded-full object-contain"
					/>
				) : (
					<p className="capitalize font-semibold text-5xl">
						{otherUser &&
							otherUser.firstName &&
							otherUser.firstName.charAt(0)}
					</p>
				)}
			</div>

			{otherUser && currentUser && otherUser._id === currentUser._id ? (
				<Link
					to={`/edit/profile/${currentUser._id}`}
					className="absolute right-3 top-3 text-blue-500 hover:underline cursor-pointer xl:right-5 xl:top-5"
				>
					Upload Photo
				</Link>
			) : (
				otherUser &&
				currentUser && (
					<p
						onClick={() => handleFollow(otherUser._id)}
						className="absolute right-3 top-3 text-blue-500 hover:underline cursor-pointer xl:right-5 xl:top-5"
					>
						{otherUser.followers.some(
							(follower) => follower._id === currentUser._id
						)
							? "Unfollow"
							: "Follow"}
					</p>
				)
			)}

			<div className="flex flex-col gap-1 text-center">
				<p className="text-lg capitalize font-medium">
					{otherUser && otherUser.firstName}{" "}
					{otherUser && otherUser.lastName}
				</p>
				<p className="text-xs">{otherUser && otherUser.userName}</p>
			</div>
			<div className="flex gap-5 text-sm mt-5">
				<p>
					{data && data.length}{" "}
					{data && data.length > 1 ? "posts" : "post"}
				</p>
				<p
					className="cursor-pointer hover:underline"
					onClick={() =>
						document.getElementById("followers_modal").showModal()
					}
				>
					{otherUser &&
						otherUser.followers &&
						otherUser.followers.length}{" "}
					{otherUser &&
					otherUser.followers &&
					otherUser.followers.length > 1
						? "followers"
						: "follower"}
				</p>
				<p
					className="cursor-pointer hover:underline"
					onClick={() =>
						document.getElementById("following_modal").showModal()
					}
				>
					{otherUser &&
						otherUser.following &&
						otherUser.following.length}{" "}
					following
				</p>
			</div>
			<FollowersModal />
			<FollowingModal />
		</div>
	);
};

export default UserProfile;
