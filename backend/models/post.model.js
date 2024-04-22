const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		postContent: {
			type: String,
			required: true,
			trim: true,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		postPicture: {
			type: String,
			required: true,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				comment: { type: String, required: true, trim: true },
				postedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
