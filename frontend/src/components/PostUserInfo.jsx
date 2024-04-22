import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../_actions/postsAction";

import axios from "axios";
import moment from "moment";
import { Ellipsis } from "lucide-react";

const PostUserInfo = ({ post, user }) => {
	const theme = useSelector((state) => state.themeReducer.theme);
	const currentUser = useSelector((state) => state.userReducer.user)
	const dispatch = useDispatch();

	const handleDelete = async (id) => {
		try {
			const response = await axios.delete(
				`http://localhost:5000/post/${id}`,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);
			dispatch(deletePost(response.data.data));
		} catch (error) {
			console.log("Get Posts Error: ", error);
		}
	};

	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-3 xl:mb-3">
				<Link to={`/profile/${post.postedBy._id}`}>
					{post.postedBy.profilePicture ? (
						<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
							<img
								src={`http://localhost:5000/uploads/${post.postedBy.profilePicture}`}
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
						<Link to={`/post/update/${post._id}`}>
							<li>
								<a>Update</a>
							</li>
						</Link>
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
