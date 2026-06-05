import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'Manager' | 'Cashier' | 'Captain' | 'Inventory Manager' | 'Auditor' | 'Admin';
export type UserStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  outletName: string;
  outletAddress: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  registerUser: (user: Omit<User, 'id' | 'status' | 'createdAt'>) => void;
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  adminLogin: () => void;
}

const mockAdminUser: User = {
  id: 'admin-1',
  fullName: 'Super Admin',
  email: 'admin@vibrnd.com',
  mobile: '1234567890',
  outletName: 'VIBRND HQ',
  outletAddress: 'Admin HQ',
  role: 'Admin',
  status: 'Approved',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [mockAdminUser],
      isAuthenticated: false,
      login: (email) => {
        const foundUser = get().users.find((u) => u.email === email);
        if (foundUser) {
          if (foundUser.status === 'Approved') {
            set({ user: foundUser, isAuthenticated: true });
          } else {
            throw new Error(`Account status: ${foundUser.status}`);
          }
        } else {
          throw new Error('User not found');
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      registerUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: Math.random().toString(36).substring(7),
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      approveUser: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status: 'Approved' } : u
          ),
        })),
      rejectUser: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, status: 'Rejected' } : u
          ),
        })),
      adminLogin: () => {
        set({ user: mockAdminUser, isAuthenticated: true });
      },
    }),
    {
      name: 'vibrnd-auth-storage',
    }
  )
);
