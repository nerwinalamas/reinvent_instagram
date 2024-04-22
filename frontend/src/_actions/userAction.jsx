export const setUser = (data) => {
    return {
        type: "SET_USER",
        payload: data
    }
}

export const followUser = (id) => {
    return {
        type: "FOLLOW_USER",
        payload: id
    }
}

export const unfollowUser = (id) => {
    return {
        type: "UNFOLLOW_USER",
        payload: id
    }
}

export const setProfilePic = (photo) => {
	return {
		type: "UPLOAD_USER_PHOTO",
		payload: photo
	};
};

export const savedPosts = (post) => {
	return {
		type: "SAVED_POST",
		payload: post
	};
};

export const unsavedPosts = (post) => {
	return {
		type: "UNSAVED_POST",
		payload: post
	};
};
