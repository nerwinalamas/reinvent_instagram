import { create } from "zustand";

const useAuthStore = create((set) => ({
	token: localStorage.getItem("token") || null,
	isAuthenticated: !!localStorage.getItem("token"),
	login: (token) => {
		set({ token, isAuthenticated: true });
		localStorage.setItem("token", token);
	},
	logout: () => {
		set({ token: null, isAuthenticated: false });
		localStorage.removeItem("token");
	},
}));

export default useAuthStore;
