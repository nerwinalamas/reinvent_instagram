import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, likePost, savePost, unlikePost, unsavePost } from "../api/post";

export const useCreatePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postContent, postPicture }) => createPost(postContent, postPicture),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};

export const useLikePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: likePost,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};

export const useUnLikePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: unlikePost,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};

export const useSavePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: savePost,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};

export const useUnsavePostMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: unsavePost,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};