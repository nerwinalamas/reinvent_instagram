import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../api/message";

export const useSendMessageMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ userId, message, token }) => sendMessage(userId, message, token),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversation"] }),
	});
};