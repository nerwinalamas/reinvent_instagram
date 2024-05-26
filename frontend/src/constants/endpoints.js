export const API_URL = import.meta.env.VITE_API_URL;

export const API = {
    // AUTH
    LOGIN: `${API_URL}/login`,
    REGISTER: `${API_URL}/register`,

    // USER
    LOGGED_IN_USER: `${API_URL}/get-user`,
    GET_USER: (userId) => `${API_URL}/user/${userId}`, // USER PROFILE
    GET_USER_POSTS: (userId) => `${API_URL}/post/user/${userId}`,
    UPDATE_PROFILE_PHOTO: (userId) => `${API_URL}/user/change/${userId}`,
    
    // POST
    GET_POSTS: `${API_URL}/post`,
    CREATE_POST: `${API_URL}/post/create`,
    READ_POST: (postId) => `${API_URL}/post/${postId}`,
    UPDATE_POST: (postId) => `${API_URL}/post/${postId}`,
    DELETE_POST: (postId) => `${API_URL}/post/${postId}`,

    GET_SAVED_POSTS: `${API_URL}/post/my/personal/saved/posts`,
    SAVE_POST: (postId) => `${API_URL}/post/save/${postId}`,
    UNSAVE_POST: (postId) => `${API_URL}/post/unsave/${postId}`,

    LIKE_POST: (postId) => `${API_URL}/post/${postId}/like`,
    UNLIKE_POST: (postId) => `${API_URL}/post/${postId}/unlike`,

    GET_EXPLORE_POSTS: `${API_URL}/post/explore/random`,

    // COMMENT
    CREATE_COMMENT: (postId) => `${API_URL}/post/create/comment/${postId}`,
    DELETE_COMMENT: (postId, commentId) => `${API_URL}/post/${postId}/comment/${commentId}`,

    // FOLLOW
    FOLLOW_TOGGLE: (userId) => `${API_URL}/follow-toggle/${userId}`,
    FOLLOWING: `${API_URL}/following`,

    // CHAT
    GET_CONVERSATION: (userId) => `${API_URL}/message/${userId}`,
    SEND_MESSAGE: (userId) => `${API_URL}/message/send/${userId}`,

    // SEARCH
    SEARCH_USER: (query) => `${API_URL}/search/users?query=${query}`,

    GET_PHOTO_URL: (filename) => `${API_URL}/uploads/${filename}`
}