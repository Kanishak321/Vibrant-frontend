import { create } from 'zustand';

export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  variants: string;
};

interface MenuState {
  items: MenuItem[];
  categories: string[];
  addItem: (item: Omit<MenuItem, 'id'>) => void;
  updateItem: (id: string, data: Partial<MenuItem>) => void;
  removeItem: (id: string) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
}

const initialItems: MenuItem[] = [
  { id: "1", name: "Paneer Tikka", category: "Starters", price: 280, status: "Available", variants: "2" },
  { id: "2", name: "Chicken Kabab", category: "Starters", price: 320, status: "Available", variants: "2" },
  { id: "3", name: "Butter Chicken", category: "Main Course", price: 450, status: "Out of Stock", variants: "3" },
  { id: "4", name: "Dal Makhani", category: "Main Course", price: 250, status: "Available", variants: "1" },
  { id: "5", name: "Garlic Naan", category: "Breads", price: 60, status: "Available", variants: "1" },
];

export const useMenuStore = create<MenuState>((set) => ({
  items: initialItems,
  categories: ["Starters", "Main Course", "Breads", "Desserts", "Beverages"],
  addItem: (itemData) => set((state) => ({
    items: [...state.items, { ...itemData, id: crypto.randomUUID() }]
  })),
  updateItem: (id, data) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, ...data } : item)
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
  addCategory: (category) => set((state) => {
    if (state.categories.includes(category)) return state;
    return { categories: [...state.categories, category] };
  }),
  removeCategory: (category) => set((state) => ({
    categories: state.categories.filter(c => c !== category)
  }))
}));