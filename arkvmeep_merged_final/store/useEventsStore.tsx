import { create } from "zustand";

type Store = {
    isOpenIcons: boolean;
    closeIcons: () => void;
    toggleIcons: () => void;
    isOpenActions: boolean;
    closeActions: () => void;
    toggleActions: () => void;
    isNewTask: boolean;
    openNewTask: () => void;
    closeNewTask: () => void;
    toggleNewTask: () => void;
    isNewGroup: boolean;
    openNewGroup: () => void;
    closeNewGroup: () => void;
    toggleNewGroup: () => void;
    activeGroupId: string | null;
    setActiveGroupId: (id: string | null) => void;
    activeGroupOptionsId: string | null;
    setActiveGroupOptionsId: (id: string | null) => void;
    toggleActiveGroupOptionsId: (groupId: string) => void;
};

const useEventsStore = create<Store>()((set) => ({
    isOpenIcons: false,
    closeIcons: () => set({ isOpenIcons: false }),
    toggleIcons: () => {
        set((state) => ({ isOpenIcons: !state.isOpenIcons }));
    },
    isOpenActions: false,
    closeActions: () => set({ isOpenActions: false }),
    toggleActions: () => {
        set((state) => ({ isOpenActions: !state.isOpenActions }));
    },
    isNewTask: false,
    openNewTask: () => set({ isNewTask: true }),
    closeNewTask: () => set({ isNewTask: false }),
    toggleNewTask: () => {
        set((state) => ({ isNewTask: !state.isNewTask }));
    },
    isNewGroup: false,
    openNewGroup: () => set({ isNewGroup: true }),
    closeNewGroup: () => set({ isNewGroup: false }),
    toggleNewGroup: () => {
        set((state) => ({ isNewGroup: !state.isNewGroup }));
    },
    activeGroupId: null,
    setActiveGroupId: (id) => set({ activeGroupId: id }),
    activeGroupOptionsId: null,
    setActiveGroupOptionsId: (id) => set({ activeGroupOptionsId: id }),
    toggleActiveGroupOptionsId: (groupId) => {
        set((state) => ({
            activeGroupOptionsId:
                state.activeGroupOptionsId === groupId ? null : groupId,
        }));
    },
}));

export default useEventsStore;
