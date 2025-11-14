import { create } from "zustand";

interface UIState {
  // 模态框状态
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // 侧边栏状态
  isSidebarOpen: boolean;

  // 加载状态
  isLoading: boolean;

  // Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // 初始状态
  isModalOpen: false,
  modalContent: null,
  isSidebarOpen: false,
  isLoading: false,

  // Actions
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setLoading: (loading) => set({ isLoading: loading }),
}));










