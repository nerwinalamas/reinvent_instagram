const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const {
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
	getAllSavedPosts
} = require("../controllers/post.controller");
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

router.post("/create", protect, upload.single("postPicture"), createPost);
router.get("/:id", protect, getPostById);
router.put("/:id", protect, upload.single("postPicture"), updatePost);
router.delete("/:id", protect, deletePost);
router.get("/posts/user", protect, getAllPost);
router.get("/", protect, getPosts);
router.post("/:id/like", protect, likePost);
router.post("/:id/unlike", protect, unlikePost);
router.get("/user/:id", protect, getUserPosts);
router.get("/explore/random", protect, getRandomPosts);
router.post("/create/comment/:id", protect, createComment);
router.get("/comments/:id", protect, getAllCommentsByPostId);
router.delete("/:postId/comment/:commentId", protect, deleteComment);
router.put("/:postId/comment/:commentId", protect, updateComment);
router.get("/:postId/comment/:commentId", protect, getComment);
router.post("/save/:id", protect, savePost);
router.delete("/unsave/:id", protect, unsavePost);
router.get("/my/personal/saved/posts", protect, getAllSavedPosts);

module.exports = router;
