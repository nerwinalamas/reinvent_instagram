import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createComment,
    createPost,
    deleteComment,
    deletePost,
    getPost,
    likePost,
    savePost,
    unlikePost,
    unsavePost,
    updatePost,
} from "../api/post";

export const useCreatePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postContent, postPicture, token }) =>
            createPost(postContent, postPicture, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

export const useUpdatePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, postContent, postPicture, token }) =>
            updatePost(postId, postContent, postPicture, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => deletePost(postId, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

export const useLikePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => likePost(postId, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

export const useUnLikePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => unlikePost(postId, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

export const useSavePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => savePost(postId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};

export const useUnsavePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => unsavePost(postId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
};

export const useCommentPostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, comment, token }) =>
            createComment(postId, comment, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

export const useDeleteCommentPostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, token }) =>
            deleteComment(postId, commentId, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};

// FOR PROFILE PAGE
export const useLikePostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => likePost(postId, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useUnLikePostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => unlikePost(postId, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useSavePostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => savePost(postId, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useUnsavePostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => unsavePost(postId, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useCommentPostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, comment, token }) =>
            createComment(postId, comment, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useDeleteCommentPostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, token }) =>
            deleteComment(postId, commentId, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useDeletePostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => deletePost(postId, token),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useCreatePostProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postContent, postPicture }) =>
            createPost(postContent, postPicture),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: ["userPosts"] }),
    });
};

export const useGetPostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, token }) => getPost(postId, token),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
    });
};
