import { create } from 'zustand';

export type Vendor = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  status: string;
};

export type PurchaseItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  date: string;
  amount: number;
  status: string; 
  items: PurchaseItem[];
  remarks?: string;
};

interface PurchasesState {
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id'>) => Promise<void>;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'date'>) => Promise<void>;
  approvePurchaseOrder: (id: string, remarks?: string) => Promise<void>;
  rejectPurchaseOrder: (id: string, remarks: string) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
}

export const usePurchasesStore = create<PurchasesState>((set, get) => ({
  vendors: [],
  purchaseOrders: [],
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [vendorsRes, posRes] = await Promise.all([
        fetch('/api/vendors'),
        fetch('/api/purchases')
      ]);
      const vendors = await vendorsRes.json();
      const pos = await posRes.json();
      
      set({ 
        vendors: Array.isArray(vendors) ? vendors : [], 
        purchaseOrders: Array.isArray(pos) ? pos : [], 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, vendors: [], purchaseOrders: [] });
    }
  },

  addVendor: async (vendor) => {
    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendor)
      });
      const newVendor = await res.json();
      set((state) => ({ vendors: [newVendor, ...state.vendors] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addPurchaseOrder: async (poData) => {
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poData)
      });
      const newPO = await res.json();
      set((state) => ({ purchaseOrders: [newPO, ...state.purchaseOrders] }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  approvePurchaseOrder: async (id, remarks) => {
    try {
      const res = await fetch(`/api/purchases/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks })
      });
      const updatedPO = await res.json();
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map(po => po.id === id ? updatedPO : po)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  rejectPurchaseOrder: async (id, remarks) => {
    try {
      const res = await fetch(`/api/purchases/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks })
      });
      const updatedPO = await res.json();
      set((state) => ({
        purchaseOrders: state.purchaseOrders.map(po => po.id === id ? updatedPO : po)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deletePurchaseOrder: async (id) => {
    try {
      await fetch(`/api/purchases/${id}`, { method: 'DELETE' });
      set((state) => ({
        purchaseOrders: state.purchaseOrders.filter(po => po.id !== id)
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));