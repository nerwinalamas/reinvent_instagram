export const setOtherUser = (data) => {
    return {
        type: "SET_OTHER_USER",
        payload: data
    }
}

export const setOtherUserPosts = (posts) => {
    return {
        type: "SET_OTHER_USER_POSTS",
        payload: posts
    }
};

export const followOtherUser = (id) => {
    return {
        type: "FOLLOW_OTHER_USER",
        payload: id
    }
}

export const unfollowOtherUser = (id) => {
    return {
        type: "UNFOLLOW_OTHER_USER",
        payload: id
    }
}

export const likeOtherPost = (postId, userId) => {
	return {
		type: "LIKE_OTHER_POST",
		payload: { postId, userId },
	};
};

export const unlikeOtherPost = (postId, userId) => {
	return {
		type: "UNLIKE_OTHER_POST",
		payload: { postId, userId },
	};
};

export const savedOtherPosts = (post) => {
	return {
		type: "SAVED_OTHER_POST",
		payload: post
	};
};

export const unsavedOtherPosts = (post) => {
	return {
		type: "UNSAVED_OTHER_POST",
		payload: post
	};
};

export const setClickedOtherPost = (data) => {
	return {
		type: "SET_CLICKED_OTHER_POST",
		payload: data,
	};
};