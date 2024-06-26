import { create } from "zustand";

const useChatStore = create((set) => ({
    chat: [],
    setChat: (chat) => set({ chat }),
}));

export default useChatStore;
