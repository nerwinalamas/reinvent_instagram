const express = require("express");

const router = express.Router();
const {
	registerUser,
	loginUser,
	getUser,
	getOtherUserProfile,
	followToggle,
	uploadPhoto,
	getFollowing,
	searchUser
} = require("../controllers/user.controller");
const protect = require("../middleware/auth.middleware");
const upload = require("../utils/upload");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", protect, getUser);
router.get("/user/:id", protect, getOtherUserProfile);
router.post("/follow-toggle/:id", protect, followToggle);
router.put("/user/change/:id", upload.single("profilePicture"), protect, uploadPhoto);
router.get("/following", protect, getFollowing);
router.get("/search/users", protect, searchUser);

module.exports = router;