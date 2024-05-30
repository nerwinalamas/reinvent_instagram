import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Bookmark } from "lucide-react";
import moment from "moment";
import { useSavePostMutation, useUnsavePostMutation } from "../mutation/post";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/useAuth";

const SavedPost = () => {
	const theme = useSelector((state) => state.themeReducer.theme);
	const { token, user } = useAuthStore();
	const savePostMutation = useSavePostMutation();
	const unsavePostMutation = useUnsavePostMutation();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["posts", token],
		queryFn: () => getSavedPosts(token),
	});

	const handleSavePost = async (postId, isSaved) => {
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
		<div className="p-5 flex flex-col gap-5 justify-center items-center">
			<h1 className="text-2xl font-bold self-start md:px-20 lg:text-2xl xl:px-36">
				Saved posts
			</h1>

			{isLoading ? (
				<p>Loading...</p>
			) : isError ? (
				<p>Error: {error}</p>
			) : data.length > 0 ? (
				data.map((post) => (
					<div
						key={post._id}
						className={`w-80 p-3 rounded-md flex flex-col gap-2 md:w-96 md:gap-5 lg:p-5 xl:w-[600px] xl:gap-1 ${
							theme === "dark" ? "bg-customGray" : "bg-slate-100"
						}`}
					>
						{/* USER INFO */}
						<div className="flex justify-between items-center">
							<div className="flex items-center gap-3 xl:mb-3">
								<Link to={`/profile/${post.postedBy._id}`}>
									{post.postedBy.profilePicture ? (
										<div className="w-11 h-11 rounded-full flex flex-col bg-customBlack items-center justify-center">
											<img
												src={
													post.postedBy.profilePicture
												}
												alt={
													post.postedBy.firstName +
													" Photo"
												}
												className="w-full h-full rounded-full object-contain"
											/>
										</div>
									) : (
										<div className="w-11 h-11 rounded-full bg-customWhite text-customBlack flex items-center justify-center">
											<p className="capitalize font-bold text-xl">
												{post.postedBy.firstName &&
													post.postedBy.firstName.charAt(
														0
													)}
											</p>
										</div>
									)}
								</Link>
								<div className="flex flex-col gap-1 text-sm">
									<Link to={`/profile/${post.postedBy._id}`}>
										<p className="capitalize hover:underline">
											{post.postedBy.firstName}{" "}
											{post.postedBy.lastName}
										</p>
									</Link>
									<p className="text-slate-400 text-xs">
										{moment(
											post.postedBy.createdAt
										).fromNow()}
									</p>
								</div>
							</div>
						</div>
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
						<div className="flex flex-col gap-3">
							{/* REACTION SECTION */}
							<div className="flex justify-between">
								<div></div>
								<Bookmark
									className="cursor-pointer"
									title="Save"
									onClick={() =>
										handleSavePost(
											post._id,
											user &&
												user.savedPosts &&
												user.savedPosts.includes(
													post._id
												)
										)
									}
									color={
										user &&
										user.savedPosts &&
										user.savedPosts.includes(post._id)
											? "yellow"
											: "white"
									}
								/>
							</div>
						</div>
						{/* POST DESCRIPTION SECTION */}
						<div className="text-sm p-2 line-clamp-1">
							{post.postContent}
						</div>
					</div>
				))
			) : (
				<p>No Saved Posts</p>
			)}
		</div>
	);
};

export default SavedPost;
