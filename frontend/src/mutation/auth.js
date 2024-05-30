import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/auth";

export const useLoginUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ email, password }) => loginUser(email, password),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
	});
};

export const useRegisterUserMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ email, firstName, lastName, userName, password }) =>
			registerUser(email, firstName, lastName, userName, password),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
	});
};
