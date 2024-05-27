import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, likePost, unlikePost } from "../api/post";

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