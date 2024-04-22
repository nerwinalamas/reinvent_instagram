const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");
const { app, server } = require("./socket/socket")

const connectDb = require("./config/db");
const userRoute = require("./routes/user.route");
const postRoute = require("./routes/post.route");
const messageRoute = require("./routes/message.route");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "public", "uploads")));

connectDb();

app.use("/", userRoute);
app.use("/post", postRoute);
app.use("/message", messageRoute);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));