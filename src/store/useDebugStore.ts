import { create } from "zustand";

interface DebugState {
  isDebugMode: boolean;
  debugInfo: Record<string, unknown>;

  // Actions
  toggleDebugMode: () => void;
  setDebugInfo: (key: string, value: unknown) => void;
  clearDebugInfo: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  // 初始状态
  isDebugMode: process.env.NODE_ENV === "development",
  debugInfo: {},

  // Actions
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  setDebugInfo: (key, value) =>
    set((state) => ({
      debugInfo: { ...state.debugInfo, [key]: value },
    })),
  clearDebugInfo: () => set({ debugInfo: {} }),
}));








