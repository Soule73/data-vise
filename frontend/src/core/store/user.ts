import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { UserState } from '../types/ui';

export const useUserStore = create<UserState>(
  persist(
    (set) => ({
      user: null,
      token: localStorage.getItem('token'),
      setUser: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        console.log('Logging out...');
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'user-store',
    }
  ) as StateCreator<UserState, [], [], UserState>
);

// Synchronisation du logout entre onglets et re-render global
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'token' && event.newValue === null) {
      useUserStore.getState().logout();
    }
  });
}
