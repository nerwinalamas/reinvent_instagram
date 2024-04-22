const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
	try {
		const token = req.header("authorization").split(" ")[1];
		const user = jwt.verify(token, process.env.JWT_SECRET);
		// req.body.userId = user.userId;
		req.user = user;
		next();
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = protect;