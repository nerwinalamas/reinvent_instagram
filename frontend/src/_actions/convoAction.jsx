export const setConversation = (data) => {
	return {
		type: "SET_CONVERSATION",
		payload: data,
	};
};

export const setSelectedChat = (data) => {
	return {
		type: "SET_SELECTED_CHAT",
		payload: data,
	};
};