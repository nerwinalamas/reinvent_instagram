import { create } from "zustand";

const useUserProfileStore = create((set) => ({
	otherUser: null,
	setOtherUser: (otherUser) => set((state) => ({ ...state, otherUser }))
}));

export default useUserProfileStore;
