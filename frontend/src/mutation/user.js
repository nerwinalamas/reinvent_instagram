import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loggedInUser, searchUser, updateProfilePhoto } from "../api/user";

export const useUpdateProfilePhotoMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ userId, profilePicture, token }) => updateProfilePhoto(userId, profilePicture, token),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts", "userPosts"] }),
	});
};

export const useSearchUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ isSearching, token }) => searchUser(isSearching, token),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["search"] }),
	});
};

export const useCurrentUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: loggedInUser,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
	});
};