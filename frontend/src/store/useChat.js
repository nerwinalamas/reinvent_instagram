import { create } from "zustand";

const useChatStore = create((set) => ({
    chat: null,
    setChat: (chat) => set({ chat }),
}));

export default useChatStore;
