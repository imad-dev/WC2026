import { create } from 'zustand'

interface UIStore {
  activeGroup: string
  activeTab: string
  isLivePanelOpen: boolean
  setActiveGroup: (group: string) => void
  setActiveTab: (tab: string) => void
  toggleLivePanel: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  activeGroup: 'F',
  activeTab: 'overview',
  isLivePanelOpen: true,
  setActiveGroup: (group) => set({ activeGroup: group }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleLivePanel: () => set((state) => ({ isLivePanelOpen: !state.isLivePanelOpen })),
}))
