import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUser, updateProfilePhoto } from "../api/user";

export const useUpdateProfilePhotoMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ userId, profilePicture }) => updateProfilePhoto(userId, profilePicture),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts", "userPosts"] }),
	});
};

export const useSearchUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: searchUser,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["search"] }),
	});
};