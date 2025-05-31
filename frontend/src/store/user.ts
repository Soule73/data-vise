import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';

interface DecodedToken {
  id: string;
  email?: string;
  username?: string;
  role: string;
  exp: number;
}

function getUserFromToken(token: string | null) {
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.id,
      username: decoded.username || '',
      email: decoded.email || '',
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

interface UserState {
  user: { id: string; username: string; email: string; role: string } | null;
  token: string | null;
  setUser: (user: { id: string; username: string; email: string; role: string }, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>(
  persist(
    (set) => ({
      user: getUserFromToken(localStorage.getItem('token')),
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
