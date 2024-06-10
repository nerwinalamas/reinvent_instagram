import { create } from "zustand";

const useClickedPostStore = create((set) => ({
    clickedHomePost: null,
    clickedProfilePost: null,
    setClickHomePost: (data) => set({ clickedHomePost: data }),
    setClickProfilePost: (data) => set({ clickedProfilePost: data }),
}));

export default useClickedPostStore;
