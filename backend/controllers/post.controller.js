const Post = require("../models/post.model");
const User = require("../models/user.model");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

// CREATE POST
const createPost = async (req, res) => {
	try {
		const { postContent } = req.body;
		const userId = req.user.userId;

		const user = await User.findById(userId);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		let postPicture = "";

		if (req.file) {
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: "posts",
			});

			fs.unlinkSync(req.file.path);
			postPicture = result.secure_url;
		}

		const post = await Post.create({
			postContent,
			postPicture,
			postedBy: userId,
		});

		res.status(201).json({ success: true, data: post });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET SINGLE POST
const getPostById = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await Post.findById({ _id: postId });

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({ success: true, data: post });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// UPDATE POST
const updatePost = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await Post.findById({ _id: postId });

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		let updatedFields = {};
		if (req.body.postContent) {
			updatedFields.postContent = req.body.postContent;
		}
		if (req.file) {
			if (post.postPicture) {
				const publicId = post.postPicture.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(
					`posts/${publicId}`,
					function (error, result) {
						if (error) {
							console.log("Error: ", error);
						} else {
							console.log("Result: ", result);
						}
					}
				);
			}

			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: "posts",
			});

			fs.unlinkSync(req.file.path);
			updatedFields.postPicture = result.secure_url;
		}

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			updatedFields,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedPost) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({ success: true, data: updatedPost });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// DELETE POST
const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await Post.findById({ _id: postId });

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		if (post.postPicture) {
			const publicId = post.postPicture.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(
				`posts/${publicId}`,
				function (error, result) {
					if (error) {
						console.log("Error: ", error);
					} else {
						console.log("Result: ", result);
					}
				}
			);
		}

		const deletedPost = await Post.findByIdAndDelete({ _id: post._id });

		if (!deletedPost) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({
			success: true,
			message: "Post deleted successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET ALL POST OF THE USER LOGGED IN
const getAllPost = async (req, res) => {
	try {
		const userId = req.user.userId;

		const posts = await Post.find({ postedBy: userId });

		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET ALL POST
const getPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.populate("postedBy")
			.populate({
				path: "comments",
				populate: {
					path: "postedBy",
					select: "firstName lastName userName profilePicture",
				},
			})
			.populate("likes")
			.sort({ createdAt: -1 });

		res.status(200).json({ success: true, data: posts });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// LIKE POST
const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.userId;

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $addToSet: { likes: userId } },
			{ new: true }
		);

		if (!updatedPost) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({ success: true, data: updatedPost });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// UNLIKE POST
const unlikePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.userId;

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{ $pull: { likes: userId } },
			{ new: true }
		);

		if (!updatedPost) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({ success: true, data: updatedPost });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET USER POST IN PROFILE
const getUserPosts = async (req, res) => {
	try {
		const userId = req.params.id;

		const userPosts = await Post.find()
			.populate("postedBy")
			.where("postedBy")
			.equals(userId)
			.populate({
				path: "comments",
				populate: {
					path: "postedBy",
					select: "firstName lastName userName profilePicture",
				},
			})
			.populate("likes")
			.sort({ createdAt: -1 });

		res.status(200).json({ success: true, data: userPosts });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET RANDOM POST - EXPLORE API
const getRandomPosts = async (req, res) => {
	try {
		const randomPosts = await Post.aggregate([
			{ $sample: { size: 10 } },
			{
				$lookup: {
					from: "users",
					localField: "postedBy",
					foreignField: "_id",
					as: "postedBy",
				},
			},
			{ $unwind: "$postedBy" },
		]);

		res.status(200).json({ success: true, data: randomPosts });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// ADD COMMENT IN A POST
const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const { comment } = req.body;
		const userId = req.user.userId;

		const post = await Post.findByIdAndUpdate(
			postId,
			{ $push: { comments: { comment, postedBy: userId } } },
			{ new: true }
		);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({
			success: true,
			message: "Comment added successfully",
			data: post.comments,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET ALL COMMENTS IN A POST
const getAllCommentsByPostId = async (req, res) => {
	try {
		const postId = req.params.id;

		const post = await Post.findById(postId).populate(
			"comments.postedBy",
			"firstName lastName"
		);
		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		const comments = post.comments;

		res.status(200).json({
			success: true,
			data: comments,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;

		const post = await Post.findByIdAndUpdate(
			postId,
			{ $pull: { comments: { _id: commentId } } },
			{ new: true }
		);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
			data: post.comments,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// UPDATE COMMENT
const updateComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const { newComment } = req.body;

		const post = await Post.findById(postId);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		const comment = post.comments.id(commentId);
		if (!comment) {
			return res
				.status(404)
				.json({ success: false, message: "Comment not found" });
		}

		comment.comment = newComment;
		await post.save();

		res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
			data: post.comments,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// GET COMMENT BY ID
const getComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		const comment = post.comments.id(commentId);
		if (!comment) {
			return res
				.status(404)
				.json({ success: false, message: "Comment not found" });
		}

		res.status(200).json({
			success: true,
			message: "Comment deleted successfully",
			data: comment,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// SAVE POST
const savePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.userId;

		const user = await User.findById(userId);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const post = await Post.findById(postId);

		if (!post) {
			return res
				.status(404)
				.json({ success: false, message: "Post not found" });
		}

		if (!user.savedPosts.includes(postId)) {
			user.savedPosts.push(postId);
			await user.save();
		}

		res.status(200).json({
			success: true,
			message: "Post saved successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const unsavePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user.userId;

		const user = await User.findById(userId);

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		user.savedPosts = user.savedPosts.filter(
			(savedPostId) => savedPostId.toString() !== postId
		);
		await user.save();

		res.status(200).json({
			success: true,
			message: "Post unsaved successfully",
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getAllSavedPosts = async (req, res) => {
	try {
		const userId = req.user.userId;

		const user = await User.findById(userId).populate({
			path: "savedPosts",
			populate: { path: "postedBy" },
		});

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "Get all saved post successfully",
			data: user.savedPosts,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = {
	createPost,
	getPostById,
	updatePost,
	deletePost,
	getAllPost,
	getPosts,
	likePost,
	unlikePost,
	getUserPosts,
	getRandomPosts,
	createComment,
	getAllCommentsByPostId,
	deleteComment,
	updateComment,
	getComment,
	savePost,
	unsavePost,
	getAllSavedPosts,
};
