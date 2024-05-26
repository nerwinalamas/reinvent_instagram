const express = require("express");

const router = express.Router();
const { 
    sendMessage, 
    getMessages 
} = require("../controllers/message.controller");
const protect = require("../middleware/auth.middleware");

router.post("/send/:id", protect, sendMessage)
router.get("/:id", protect, getMessages)

module.exports = router;