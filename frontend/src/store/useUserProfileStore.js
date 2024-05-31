import { create } from "zustand";

const useUserProfileStore = create((set) => ({
	otherUser: null,
	setOtherUser: (otherUser) => set((state) => ({ ...state, otherUser })),
	toggleFollow: (userId) =>
		set((state) => {
			if (state.otherUser.followers.some((user) => user._id === userId)) {
				return {
					otherUser: {
						...state.otherUser,
						followers: state.otherUser.followers.filter(
							(user) => user._id !== userId
						),
					},
				};
			} else {
				return {
					otherUser: {
						...state.otherUser,
						followers: [
							...state.otherUser.followers,
							{ _id: userId },
						],
					},
				};
			}
		}),
}));

export default useUserProfileStore;
