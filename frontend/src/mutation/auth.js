import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/auth";

export const useLoginUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ email, password }) => loginUser(email, password),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
	});
};