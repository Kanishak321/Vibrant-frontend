import { create } from 'zustand';

export type InboxItem = {
  name: string;
  qty: number;
  price: number;
  notes?: string;
};

export type InboxOrder = {
  id: string;
  platform: 'Swiggy' | 'Zomato' | 'Magicpin';
  time: string;
  amount: number;
  status: 'New' | 'Preparing' | 'Ready' | 'Dispatched' | 'Rejected';
  items: InboxItem[];
  instructions?: string;
};

interface InboxState {
  orders: InboxOrder[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: InboxOrder['status']) => Promise<void>;
}

export const useInboxStore = create<InboxState>((set, get) => ({
  orders: [],
  isLoading: true,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/inbox');
      const data = await res.json();
      set({ orders: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, orders: [] });
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      // Optimistic update
      set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      }));
      
      const res = await fetch(`/api/inbox/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!res.ok) throw new Error("Failed to update");
    } catch (error: any) {
      set({ error: error.message });
      get().fetchOrders(); // Revert on failure
    }
  }
}));