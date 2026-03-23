import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // used for mock auth only
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[]; // Mock database of registered users
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (name: string, email: string) => Promise<{ success: boolean; error?: string }>;
  deleteUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      users: [],

      login: async (email, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const { users } = get();
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          // Remove password from user session object
          const { password: _, ...userWithoutPassword } = foundUser;
          set({ user: userWithoutPassword as User, isAuthenticated: true });
          return { success: true };
        }
        return { success: false, error: 'Invalid email or password' };
      },

      register: async (name, email, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const { users } = get();
        if (users.some(u => u.email === email)) {
          return { success: false, error: 'Email already exists' };
        }
        
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          email,
          password
        };
        
        const { password: _, ...userSession } = newUser;
        
        set({ 
          users: [...users, newUser],
          user: userSession as User,
          isAuthenticated: true 
        });
        
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: async (name, email) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { user, users } = get();
        if (!user) return { success: false, error: 'Not authenticated' };
        
        // check if email is taken by someone else
        if (users.some(u => u.email === email && u.id !== user.id)) {
          return { success: false, error: 'Email already exists' };
        }

        const updatedUser = { ...user, name, email };
        set({
          user: updatedUser,
          users: users.map(u => u.id === user.id ? { ...u, name, email } : u)
        });
        return { success: true };
      },

      deleteUser: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const { user, users } = get();
        if (!user) return;
        
        set({
          user: null,
          isAuthenticated: false,
          users: users.filter(u => u.id !== user.id)
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        users: state.users,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), // Persist these fields
    }
  )
);
