const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		const db = await mongoose.connect(process.env.MONGO_URI);
		if (db) {
			console.log("Connection Open");
		}
	} catch (error) {
		console.log(error);
		console.log("Connection Failed");
	}
};

module.exports = connectDb;