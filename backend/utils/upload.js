const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../public/uploads/"));
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		cb(null, `${Date.now()}${ext}`);
	},
});

const fileFilter = (req, file, cb) => {
	const filetypes = /jpeg|jpg|png|gif/;
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype) {
		return cb(null, true);
	} else {
		cb(
			new Error(
				"Invalid file type. Only JPEG, PNG, and GIF files are allowed."
			)
		);
	}
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
