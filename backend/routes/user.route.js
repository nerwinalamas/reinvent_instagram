const express = require("express");
const multer = require("multer");
const path = require("path");

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


const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../public/uploads/"));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}${ext}`);
	},
});

const upload = multer({ storage: storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", protect, getUser);
router.get("/user/:id", protect, getOtherUserProfile);
router.post("/follow-toggle/:id", protect, followToggle);
router.put("/user/change/:id", upload.single("profilePicture"), protect, uploadPhoto);
router.get("/following", protect, getFollowing);
router.get("/search/users", protect, searchUser);

module.exports = router;