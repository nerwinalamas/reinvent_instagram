import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUser, loggedInUser, searchUser, updateProfilePhoto } from "../api/user";

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

export const useOtherUserProfileMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userId, token }) => getUser(userId, token),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
	});
};