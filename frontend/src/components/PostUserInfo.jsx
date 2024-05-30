import React from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import { Ellipsis } from "lucide-react";
import {
	useDeletePostMutation,
	useDeletePostProfileMutation,
} from "../mutation/post";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuth";
import useThemeStore from "../store/useTheme";

const PostUserInfo = ({ post, user }) => {
	const location = useLocation();
	const { token, user: currentUser } = useAuthStore();
	const { theme } = useThemeStore();
	const deletePostMutation = useDeletePostMutation();
	const deletePostProfileMutation = useDeletePostProfileMutation();

	const handleDelete = async (postId) => {
		const toastId = toast.loading("Deleting Post...");
		try {
			if (location.pathname === "/") {
				deletePostMutation.mutate(
					{ postId, token },
					{
						onSuccess: () => {
							toast.success("Deleting Post Successfully!", {
								id: toastId,
							});
						},
					}
				);
			} else {
				deletePostProfileMutation.mutate(
					{ postId, token },
					{
						onSuccess: () => {
							toast.success("Deleting Post Successfully!", {
								id: toastId,
							});
						},
					}
				);
			}
		} catch (error) {
			toast.error("An unexpected error occurred", { id: toastId });
			console.log("Deleting Post Error: ", error);
		}
	};

	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-3 xl:mb-3">
				<Link to={`/profile/${post.postedBy._id}`}>
					{post.postedBy.profilePicture ? (
						<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
							<img
								src={post.postedBy.profilePicture}
								alt={post.postedBy.firstName + " Photo"}
								className="w-full h-full rounded-full object-contain"
							/>
						</div>
					) : (
						<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
							<p className="capitalize font-bold text-xl">
								{post.postedBy.firstName &&
									post.postedBy.firstName.charAt(0)}
							</p>
						</div>
					)}
				</Link>
				<div className="flex flex-col gap-1 text-sm">
					<div className="flex gap-5">
						<Link to={`/profile/${post.postedBy._id}`}>
							<p className="capitalize hover:underline">
								{post.postedBy.firstName}{" "}
								{post.postedBy.lastName}
							</p>
						</Link>
					</div>
					<p className="text-slate-400 text-xs">
						{moment(post.postedBy.createdAt).fromNow()}
					</p>
				</div>
			</div>

			{currentUser && currentUser._id === post.postedBy._id && (
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button" className="m-2">
						<Ellipsis className="cursor-pointer" />
					</div>
					<ul
						tabIndex={0}
						className={`dropdown-content z-[1] menu p-2 shadow border rounded-md w-40 h-40 ${
							theme === "dark" ? "bg-customGray" : "bg-slate-100"
						}`}
					>
						<li>
							<Link to={`/post/update/${post._id}`}>Update</Link>
						</li>
						<li>
							<a onClick={() => handleDelete(post._id)}>Delete</a>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default PostUserInfo;
