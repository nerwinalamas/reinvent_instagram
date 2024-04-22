const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],
    }
});

const findRecipientSocketId = (userId) => {
    return userSocketMap[userId];
};

const userSocketMap = {};
const userCameraState = {};

io.on("connection", function(socket) {
    socket.on("userConnected", function(userId) {
        userSocketMap[userId] = socket.id;
    });

    socket.on("message", function(data) {
        try {
            io.emit("mensahe", data);
        } catch (error) {
            console.error("Error handling message:", error);
        }
    });

    socket.on("disconnect", function() {
        const userId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
        if (userId) {
            delete userSocketMap[userId];
            delete userCameraState[socket.id];
            socket.broadcast.emit("camera_state_change", { userId: socket.id, newState: false }); 
        }
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        // io.to(userToCall).emit("callUser", { signal: signalData, from, name });
        io.emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        // io.to(data.to).emit("callAccepted", data.signal)
        io.emit("callAccepted", data.signal)
    });

    socket.on("camera_state_change", (newState) => {
        userCameraState[socket.id] = newState;
        socket.broadcast.emit("camera_state_change", { userId: socket.id, newState });
      });
});

module.exports = { app, io, server };