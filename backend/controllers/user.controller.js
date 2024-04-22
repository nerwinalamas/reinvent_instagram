const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
	try {
		const { email, firstName, lastName, userName, password } = req.body;

		const exists = await User.findOne({ $or: [{ email }, { userName }] });

		if (exists) {
			res.status(400);
			throw new Error("User Exists");
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			email,
			firstName,
			lastName,
			userName,
			password: hashPassword,
		});

		if (user) {
			res.status(200).json({
				success: true,
				message: "Register User Successfully",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			res.status(400);
			throw new Error("Invalid Credentials");
		}

		const matchPassword = await bcrypt.compare(password, user.password);

		if (!matchPassword) {
			res.status(400);
			throw new Error("Invalid Credentials");
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "15d",
		});

		if (user) {
			res.status(200).json({
				success: true,
				message: "User Login Successfully",
				token,
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).select("-password");

		if (user) {
			res.status(200).json({
				success: true,
				message: "Get User Successfully",
				data: user,
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getOtherUserProfile = async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await User.findById({ _id: userId })
			.populate("followers")
			.populate("following")
			.select("-password");

		if (user) {
			res.status(200).json({
				success: true,
				message: "Get User Profile Successfully",
				data: user,
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const followToggle = async (req, res) => {
	try {
		const userId = req.params.id;
		const loggedInUser = req.user.userId;

		const user = await User.findById(userId);
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		if (user.followers.includes(loggedInUser)) {
			await User.findByIdAndUpdate(
				loggedInUser,
				{ $pull: { following: userId } },
				{ new: true }
			);
			await User.findByIdAndUpdate(
				userId,
				{ $pull: { followers: loggedInUser } },
				{ new: true }
			);
			res.status(200).json({ success: true, message: "Unfollowed user" });
		} else {
			await User.findByIdAndUpdate(
				loggedInUser,
				{ $addToSet: { following: userId } },
				{ new: true }
			);
			await User.findByIdAndUpdate(
				userId,
				{ $addToSet: { followers: loggedInUser } },
				{ new: true }
			);
			res.status(200).json({ success: true, message: "Followed user" });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const uploadPhoto = async (req, res) => {
	try {
		const userId = req.params.id;
		let profilePicture = "";

		if (req.file) {
			profilePicture = req.file.filename;
		}

		const user = await User.findByIdAndUpdate(userId, { profilePicture });

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		res.status(200).json({
			success: true,
			message: "User picture updated successfully",
			data: user,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getFollowing = async (req, res) => {
	try {
		const userId = req.user.userId;

		const currentUser = await User.findById(userId);

		if (!currentUser) {
			return res
				.status(404)
				.json({ success: false, message: "User not found" });
		}

		const followingIds = currentUser.following;
		const followingUsers = await User.find({
			_id: { $in: followingIds },
		}).select("-password");

		res.status(200).json({ success: true, data: followingUsers });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const searchUser = async (req, res) => {
	const { query } = req.query;

	try {
		const searchResults = await User.find({
			$or: [
				{ firstName: { $regex: query, $options: "i" } },
				{ lastName: { $regex: query, $options: "i" } },
				{ userName: { $regex: query, $options: "i" } },
			],
		}).select("-password");

		res.status(200).json({ success: true, data: searchResults });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
	getUser,
	getOtherUserProfile,
	followToggle,
	uploadPhoto,
	getFollowing,
	searchUser,
};
