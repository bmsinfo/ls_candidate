'use client';

import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  isMobile: boolean;
  isClient: boolean;
  isSessionEnded: boolean;
  isSubmitingAnswer: boolean;
  isDarkMode: boolean;
  activeModal: string | null;
  // Actions
  setLoading: (loading: boolean) => void;
  setSessionEnded: (loading: boolean) => void;
  setSubmitingAnswer: (loading: boolean) => void;
  toggleDarkMode: () => void;
  setActiveModal: (modalId: string | null) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsClient: (isClient: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  isMobile: false,
  isClient: false,
  isSessionEnded: false,
  isSubmitingAnswer: false,
  isDarkMode: false,
  sidebarOpen: false,
  activeModal: null,

  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),

  setSessionEnded: (loading) =>
    set(() => ({
      isSessionEnded: loading,
    })),

  setSubmitingAnswer: (loading) =>
    set(() => ({
      isSubmitingAnswer: loading,
    })),
  toggleDarkMode: () =>
    set((state) => ({
      isDarkMode: !state.isDarkMode,
    })),

  setActiveModal: (modalId) =>
    set(() => ({
      activeModal: modalId,
    })),
  setIsMobile: (isMobile) => set({ isMobile }),
  setIsClient: (isClient) => set({ isClient }),
}));
