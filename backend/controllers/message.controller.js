const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const messageTo = req.params.id;
		const messageBy = req.user.userId;

		let convo = await Conversation.findOne({
			participants: { $all: [messageBy, messageTo] },
		});

        if (!convo) {
            convo = await Conversation.create({
                participants: [messageBy, messageTo]
            })
        }

        const newMessage = await Message.create({
            message,
            messageBy,
            messageTo
        })

        if (newMessage) {
            if (!convo.messages.includes(newMessage._id)) {
                convo.messages.push(newMessage._id);
                await convo.save();
            }
        }

		res.status(200).json({ success: true, message: "Message sent successfully", data: newMessage });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getMessages = async (req, res) => {
	try {
		const messageTo = req.params.id;
		const messageBy = req.user.userId;

		let convo = await Conversation.findOne({
			participants: { $all: [messageBy, messageTo] },
		}).populate("messages");

		if (!convo) return res.status(200).json([]);

		res.status(200).json({ success: true, data: convo });
	} catch (error) {
		console.error("Get Conversation Error:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { sendMessage, getMessages };
