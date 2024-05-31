import { create } from "zustand";

const useAuthStore = create((set) => ({
	user: null,
	token: localStorage.getItem("token") || null,
	isAuthenticated: !!localStorage.getItem("token"),
	login: (token) => {
		set({ token, isAuthenticated: true });
		localStorage.setItem("token", token);
	},
	logout: () => {
		set({ token: null, isAuthenticated: false, user: null });
		localStorage.removeItem("token");
	},
	setUser: (user) => set((state) => ({ ...state, user })),
	toggleFollowing: (userId) =>
		set((state) => {
			if (state.user.following.some((user) => user._id === userId)) {
				return {
					user: {
						...state.user,
						following: state.user.following.filter(
							(user) => user._id !== userId
						),
					},
				};
			} else {
				return {
					user: {
						...state.user,
						following: [...state.user.following, { _id: userId }],
					},
				};
			}
		}),
}));

export default useAuthStore;
