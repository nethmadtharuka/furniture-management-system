import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Set authentication
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      // Login
      login: (user, token) => {
        get().setAuth(user, token);
      },

      // Logout
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Update user
      updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },

      // Check if user is staff
      isStaff: () => {
        const { user } = get();
        return user?.role === 'STAFF' || user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;