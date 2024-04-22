import React from "react";
import { Bookmark, MessageCircle, Redo2, ThumbsUp } from "lucide-react";
import { useSelector } from "react-redux";
import LikeModal from "./LikeModal";

const PostReaction = ({
	post,
	user,
	handleClick,
	handleLike,
	handleSavePost,
}) => {
	const theme = useSelector((state) => state.themeReducer.theme);

	return (
		<div className="flex flex-col gap-3 mt-2">
			<div className="flex justify-between">
				<div className="flex gap-5">
					<ThumbsUp
						className="cursor-pointer"
						title="Like"
						onClick={() =>
							handleLike(post._id, post.likes.some(like => like._id === user._id))
						}
						color={
							post.likes.some(like => like._id === user._id)
								? "green"
								: theme === "dark"
								? "white"
								: "black"
						}
					/>
					<MessageCircle
						className="cursor-pointer"
						title="Comment"
						onClick={() => handleClick(post)}
					/>
					<Redo2 className="cursor-pointer" title="Share" />
				</div>
				<Bookmark
					className="cursor-pointer"
					title="Save"
					onClick={() =>
						handleSavePost(
							post._id,
							user.savedPosts?.includes(post._id)
						)
					}
					color={
						user.savedPosts?.includes(post._id) ? "yellow" : "white"
					}
				/>
			</div>
			<p
				className="text-xs text-slate-300 cursor-pointer hover:underline"
				onClick={() =>
					document.getElementById(`like_modal-${post._id}`).showModal()
				}
			>
				{post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
			</p>
			<LikeModal post={post} user={user} />
		</div>
	);
};

export default PostReaction;
