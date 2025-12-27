import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AuthStoreType, UserType } from '@/store/types/authTypes';

const defaultUser: UserType = {
  name: '',
  email: '',
  profileImageUrl: '',
  onboardingCompleted: false,
  nextPage: '',
};
const getToken = () => localStorage.getItem('accessToken');

export const useAuthStore = create<AuthStoreType>()(
  persist(
    (set) => ({
      user: defaultUser,
      isLoggedIn: false,
      setUser: (newUser) => set({ user: newUser, isLoggedIn: !!getToken() }),
      resetUser: () => {
        localStorage.removeItem('accessToken');
        set({ user: defaultUser, isLoggedIn: false });
      },
      updateLoginStatus: () => set({ isLoggedIn: !!getToken() }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.updateLoginStatus();
      },
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          const hasToken = !!getToken();
          if (!hasToken) {
            localStorage.removeItem(name);
            return;
          }
          localStorage.setItem(name, value);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    },
  ),
);
