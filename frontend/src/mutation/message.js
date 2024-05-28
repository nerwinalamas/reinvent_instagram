import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../api/message";

export const useSendMessageMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
        mutationFn: ({ userId, message }) => sendMessage(userId, message),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversation"] }),
	});
};