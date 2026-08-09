import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (userData) => {
    localStorage.setItem('token', userData.token);
    set({ user: userData, token: userData.token, isAuthenticated: true });
  },
  updateUser: (updatedData) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedData };
      return { user: newUser };
    });
  },
  logout: async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout API failed', e);
    }
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.success) {
            set({ user: data.data, token, isAuthenticated: true });
          } else {
            get().logout();
          }
        } catch(e) {
          console.error(e);
          get().logout();
        }
      }
    }
  },
}));
