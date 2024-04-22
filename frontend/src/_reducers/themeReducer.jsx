const initialState = {
	theme: localStorage.getItem("theme") || "dark",
};

const themeReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_THEME":
			return {
				...state,
				theme: action.payload,
			};
		default:
			return state;
	}
};

export default themeReducer;
