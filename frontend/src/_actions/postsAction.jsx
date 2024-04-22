export const setPosts = (data) => {
	return {
		type: "SET_POSTS",
		payload: data,
	};
};

export const deletePost = (id) => {
	return {
		type: "DELETE_POST",
		payload: id,
	};
};

export const updatePost = (id, data) => {
	return {
		type: "UPDATE_POST",
		payload: { id, data },
	};
};

export const likePost = (postId, userId) => {
	return {
		type: "LIKE_POST",
		payload: { postId, userId },
	};
};

export const unlikePost = (postId, userId) => {
	return {
		type: "UNLIKE_POST",
		payload: { postId, userId },
	};
};

export const createComment = (postId, comment) => {
	return {
		type: "CREATE_COMMENT",
		payload: { postId, comment },
	};
};

export const deleteComment = (postId, commentId) => {
	return {
		type: "DELETE_COMMENT",
		payload: { postId, commentId },
	};
};

export const updateComment = (postId, commentId, comment) => {
	return {
		type: "UPDATE_COMMENT",
		payload: { postId, commentId, comment },
	};
};

export const setClickedPost = (data) => {
	return {
		type: "SET_CLICKED_POST",
		payload: data,
	};
};

export const clearClickedPost = () => {
	return {
		type: "CLEAR_CLICKED_POST",
	};
};