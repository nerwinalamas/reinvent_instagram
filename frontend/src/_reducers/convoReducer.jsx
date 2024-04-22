const initialState = {
	convo: [],
    selectedChat: null,
};

const convoReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_CONVERSATION":
			return {
				...state,
				convo: action.payload,
			};
		case "SET_SELECTED_CHAT":
			return {
				...state,
				selectedChat: action.payload,
			};
		default:
			return state;
	}
};

export default convoReducer;
