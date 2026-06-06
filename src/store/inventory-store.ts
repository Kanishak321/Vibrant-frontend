import { create } from 'zustand';

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: string;
  minStock: string;
  status: string;
  lastUpdated: string;
};

interface InventoryState {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateItem: (id: string, data: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
}

const initialItems: InventoryItem[] = [
  { id: "1", name: "Basmati Rice", category: "Grains", quantity: "250 kg", minStock: "50 kg", status: "In Stock", lastUpdated: "Today, 09:30 AM" },
  { id: "2", name: "Chicken Breast", category: "Meat", quantity: "15 kg", minStock: "20 kg", status: "Low Stock", lastUpdated: "Today, 10:15 AM" },
  { id: "3", name: "Onions", category: "Vegetables", quantity: "0 kg", minStock: "30 kg", status: "Out of Stock", lastUpdated: "Yesterday, 08:00 PM" },
  { id: "4", name: "Amul Butter", category: "Dairy", quantity: "45 pkts", minStock: "10 pkts", status: "In Stock", lastUpdated: "Today, 11:45 AM" },
  { id: "5", name: "Tomato Puree", category: "Packaged", quantity: "8 cans", minStock: "15 cans", status: "Low Stock", lastUpdated: "Yesterday, 04:30 PM" },
];

export const useInventoryStore = create<InventoryState>((set) => ({
  items: initialItems,
  addItem: (itemData) => set((state) => {
    // Derive status based on quantity/minStock logic (simple mock implementation)
    // In a real app we'd parse the numbers. For now we just use a default status.
    const status = "In Stock";
    
    return {
      items: [
        ...state.items, 
        { 
          ...itemData, 
          id: crypto.randomUUID(), 
          status, 
          lastUpdated: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
        }
      ]
    };
  }),
  updateItem: (id, data) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, ...data, lastUpdated: 'Just now' } : item)
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  }))
}));