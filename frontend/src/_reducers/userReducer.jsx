const initialState = {
	user: {},
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_USER":
			return {
				...state,
				user: action.payload,
			};
		case "FOLLOW_USER":
			return {
				...state,
				user: {
					...state.user,
					followers: [...state.user.followers, action.payload],
				},
			};
		case "UNFOLLOW_USER":
			return {
				...state,
				user: {
					...state.user,
					followers: state.user.followers.filter(
						(followerId) => followerId !== action.payload
					),
				},
			};
		case "UPLOAD_USER_PHOTO":
			return {
				...state,
				user: {
					...state.user,
					profile: action.payload,
				},
			};
		case "SAVED_POST":
			return {
				...state,
				user: {
					...state.user,
					savedPosts: [...state.user.savedPosts, action.payload],
				},
			};
		case "UNSAVED_POST":
			return {
				...state,
				user: {
					...state.user,
					savedPosts: state.user.savedPosts.filter((post) => post !== action.payload),
				},
			};
		default:
			return state;
	}
};

export default userReducer;
