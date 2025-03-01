import create from 'zustand';

interface UtilStoreState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUtilStore = create<UtilStoreState>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));
