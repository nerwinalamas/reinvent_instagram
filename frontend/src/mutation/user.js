import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfilePhoto } from "../api/user";

export const useUpdateProfilePhotoMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ userId, profilePicture }) => updateProfilePhoto(userId, profilePicture),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts", "userPosts"] }),
	});
};