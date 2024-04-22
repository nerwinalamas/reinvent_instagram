const initialState = {
	posts: [],
	clickedPost: null,
};

const postReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_POSTS":
			return {
				...state,
				posts: action.payload,
			};
		case "DELETE_POST":
			return {
				...state,
				posts: state.posts.filter((post) => post.id !== action.payload),
			};
		case "UPDATE_POST":
			const updatePost = state.posts.map((post) => {
				if (post.id === action.payload.id) {
					return {
						...post,
						postContent: action.payload.data.postContent,
						postPicture: action.payload.data.postPicture,
					};
				}
				return post;
			});

			return {
				...state,
				posts: updatePost,
			};
		case "LIKE_POST":
			const likePost = state.posts.map((post) => {
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
				posts: likePost,
			};
		case "UNLIKE_POST":
			const unlikePost = state.posts.map((post) => {
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
				posts: unlikePost,
			};
		case "CREATE_COMMENT":
			const createComment = state.posts.map((post) => {
				if (post.id === action.payload.postId) {
					return {
						...post,
						comments: [...post.comments, action.payload.comment],
					};
				}
				return post;
			});
			
			return {
				...state,
				posts: createComment,
			};
		case "DELETE_COMMENT":
			const deleteComment = state.posts.map((post) => {
				if (post.id === action.payload.postId) {
					const updatedComments = post.comments.filter(comment => comment.id !== action.payload.commentId);
					return {
						...post,
						comments: updatedComments,
					};
				}
				return post;
			});
			
			return {
				...state,
				posts: deleteComment,
			};
		case "UPDATE_COMMENT":
			const updateComment = state.posts.map((post) => {
				if (post.id === action.payload.postId) {
					const updatingComment = post.comments.map((comment) => {
						if (comment.id === action.payload.commentId) {
							return {
								...comment,
								comment: action.payload.comment,
							}
						}
						return comment;
					})
					return {
						...post,
						comments: updatingComment,
					};
				}
				return post;
			})
			return {
				...state,
				posts: updateComment
			}
		case "SET_CLICKED_POST":
			return {
				...state,
				clickedPost: action.payload,
			};
		case "CLEAR_CLICKED_POST":
			return {
				...state,
				clickedPost: null,
			};
		default:
			return state;
	}
};

export default postReducer;
