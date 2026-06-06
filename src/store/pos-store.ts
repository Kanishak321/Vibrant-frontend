import { create } from 'zustand';

export type PosItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
};

export type CartItem = PosItem & {
  cartItemId: string;
  quantity: number;
};

interface PosState {
  cart: CartItem[];
  addToCart: (item: PosItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cart: [],
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find((cItem) => cItem.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((cItem) =>
            cItem.id === item.id
              ? { ...cItem, quantity: cItem.quantity + 1 }
              : cItem
          ),
        };
      }
      return {
        cart: [...state.cart, { ...item, cartItemId: crypto.randomUUID(), quantity: 1 }],
      };
    });
  },
  removeFromCart: (cartItemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.cartItemId !== cartItemId),
    }));
  },
  updateQuantity: (cartItemId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));