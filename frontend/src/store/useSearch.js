import { create } from "zustand";

const useSearchStore = create((set) => ({
    search: {},
    setSearchData: (data) => set({ search: data }),
}));

export default useSearchStore;
