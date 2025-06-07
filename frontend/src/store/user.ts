import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: { id: string; name: string; description?: string }[];
}

interface UserState {
  user: { id: string; username: string; email: string; role: UserRole | null } | null;
  token: string | null;
  setUser: (user: { id: string; username: string; email: string; role: UserRole | null }, token: string) => void;
  logout: () => void;
}

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
