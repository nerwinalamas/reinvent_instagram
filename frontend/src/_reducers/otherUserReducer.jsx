const initialState = {
	otherUser: {},
    otherUserPosts: [],
    clickedOtherPost: null,
};

const otherUserReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_OTHER_USER":
			return {
				...state,
				otherUser: action.payload,
			};
        case "SET_OTHER_USER_POSTS":
            return {
                ...state,
                otherUserPosts: action.payload,
            };
        case "FOLLOW_OTHER_USER":
            return {
                ...state,
                otherUser: {
                    ...state.otherUser,
                    followers: [...state.otherUser.followers, action.payload],
                },
            };
        case "UNFOLLOW_OTHER_USER":
            return {
                ...state,
                otherUser: {
                    ...state.otherUser,
                    followers: state.otherUser.followers.filter(
                        (followerId) => followerId !== action.payload
                    ),
                },
            };
        case "LIKE_OTHER_POST":
            const likePost = state.otherUserPosts.map((post) => {
                if (post.id === action.payload.postId) {
                    if (!post.likes.includes(action.payload.userId)) {
                        return {
                            ...post,
                            likes: [...post.likes, action.payload.userId],
                        };
                    }
                }
                return post;
            });

            return {
                ...state,
                otherUserPosts: likePost,
            };
        case "UNLIKE_OTHER_POST":
            const unlikePost = state.otherUserPosts.map((post) => {
                if (post.id === action.payload.postId) {
                    const updatedLikes = post.likes.filter((like) => like.id !== action.payload.userId);
                    return {
                        ...post,
                        likes: updatedLikes,
                    };
                }
                return post;
            });

            return {
                ...state,
                otherUserPosts: unlikePost,
            };
        case "SAVED_OTHER_POST":
            return {
                ...state,
                otherUser: {
                    ...state.otherUser,
                    savedPosts: [...state.otherUser.savedPosts, action.payload],
                },
            };
        case "UNSAVED_OTHER_POST":
            return {
                ...state,
                otherUser: {
                    ...state.otherUser,
                    savedPosts: state.otherUser.savedPosts.filter((post) => post !== action.payload),
                },
            };
        case "SET_CLICKED_OTHER_POST":
			return {
				...state,
				clickedOtherPost: action.payload,
			};
		default:
			return state;
	}
};

export default otherUserReducer;
