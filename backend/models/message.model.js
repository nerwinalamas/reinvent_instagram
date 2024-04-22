const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
	{
		message: {
			type: String,
			required: true,
			trim: true,
		},
		messageBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		messageTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
