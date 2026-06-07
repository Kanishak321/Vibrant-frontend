import { create } from "zustand";
import { api } from "@/lib/api";

// ─── Types mirroring backend DTOs ──────────────────────────────────────────

export type VegType = "VEG" | "NON_VEG" | "EGG" | "JAIN";

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  imageUrl: string | null;
  kotStationId: string | null;
  active: boolean;
  itemCount: number;
}

export interface MenuVariant {
  id: string;
  name: string;
  price: number;
  displayOrder: number;
  active: boolean;
}

export interface TaxClass {
  id: string;
  name: string;
  percent: number;
  inclusive: boolean;
  jurisdiction: string | null;
}

export interface AddonGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  addons: { id: string; name: string; priceDelta: number }[];
}

export interface ChannelPrice {
  id: string;
  channel: string;
  outletId: string | null;
  price: number;
  effectiveFrom: string | null;
  effectiveTo: string | null;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  shortCode: string | null;
  imageUrl: string | null;
  vegType: VegType;
  active: boolean;
  variantCount: number;
  firstVariantName: string | null;
  firstVariantPrice: number | null;
  displayOrder: number;
}

export interface MenuItemDetail extends MenuItem {
  description: string | null;
  allergens: string | null;
  hsnSacCode: string | null;
  kotStationId: string | null;
  variants: MenuVariant[];
  taxClasses: TaxClass[];
  addonGroups: AddonGroup[];
  prices: ChannelPrice[];
}

// ─── Request payloads ──────────────────────────────────────────────────────

export interface CreateCategoryPayload {
  name: string;
  displayOrder?: number;
  imageUrl?: string;
  kotStationId?: string;
}

export interface CreateItemPayload {
  categoryId: string;
  name: string;
  shortCode?: string;
  description?: string;
  imageUrl?: string;
  vegType: VegType;
  allergens?: string;
  hsnSacCode?: string;
  kotStationId?: string;
  isActive?: boolean;
  displayOrder?: number;
  taxClassIds?: string[];
  addonGroupIds?: string[];
  variants: { name: string; price: number }[];
}

export interface CreateTaxClassPayload {
  name: string;
  percent: number;
  inclusive: boolean;
  jurisdiction?: string;
}

export interface CreateAddonGroupPayload {
  name: string;
  minSelect: number;
  maxSelect: number;
  addons: { name: string; priceDelta: number }[];
}

// ─── Store ─────────────────────────────────────────────────────────────────

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  taxClasses: TaxClass[];
  addonGroups: AddonGroup[];
  loading: boolean;
  error: string | null;

  // Fetchers
  fetchCategories: () => Promise<void>;
  fetchItems: (categoryId?: string, search?: string) => Promise<void>;
  fetchTaxClasses: () => Promise<void>;
  fetchAddonGroups: () => Promise<void>;

  // Category mutations
  createCategory: (data: CreateCategoryPayload) => Promise<MenuCategory>;
  updateCategory: (id: string, data: CreateCategoryPayload) => Promise<MenuCategory>;
  deleteCategory: (id: string) => Promise<void>;

  // Item mutations
  createItem: (data: CreateItemPayload) => Promise<MenuItemDetail>;
  updateItem: (id: string, data: Partial<CreateItemPayload>) => Promise<MenuItemDetail>;
  toggleAvailability: (id: string) => Promise<void>;

  // Tax / addon
  createTaxClass: (data: CreateTaxClassPayload) => Promise<TaxClass>;
  createAddonGroup: (data: CreateAddonGroupPayload) => Promise<AddonGroup>;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  categories: [],
  items: [],
  taxClasses: [],
  addonGroups: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.get<MenuCategory[]>("/api/v1/menu/categories");
      set({ categories: data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  fetchItems: async (categoryId?: string, search?: string) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (categoryId) params.set("categoryId", categoryId);
      if (search) params.set("search", search);
      const qs = params.toString() ? `?${params}` : "";
      const data = await api.get<MenuItem[]>(`/api/v1/menu/items${qs}`);
      set({ items: data, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  fetchTaxClasses: async () => {
    try {
      const data = await api.get<TaxClass[]>("/api/v1/menu/tax-classes");
      set({ taxClasses: data });
    } catch {}
  },

  fetchAddonGroups: async () => {
    try {
      const data = await api.get<AddonGroup[]>("/api/v1/menu/addon-groups");
      set({ addonGroups: data });
    } catch {}
  },

  createCategory: async (data) => {
    const cat = await api.post<MenuCategory>("/api/v1/menu/categories", data);
    set((s) => ({ categories: [...s.categories, cat] }));
    return cat;
  },

  updateCategory: async (id, data) => {
    const cat = await api.put<MenuCategory>(`/api/v1/menu/categories/${id}`, data);
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? cat : c)),
    }));
    return cat;
  },

  deleteCategory: async (id) => {
    await api.delete(`/api/v1/menu/categories/${id}`);
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
    }));
  },

  createItem: async (data) => {
    const item = await api.post<MenuItemDetail>("/api/v1/menu/items", data);
    // Add a slim version to the items list
    const slimItem: MenuItem = {
      id: item.id,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      name: item.name,
      shortCode: item.shortCode,
      imageUrl: item.imageUrl,
      vegType: item.vegType,
      active: item.active,
      variantCount: item.variants ? item.variants.length : 0,
      firstVariantName: item.variants && item.variants.length > 0 ? item.variants[0].name : null,
      firstVariantPrice: item.variants && item.variants.length > 0 ? item.variants[0].price : null,
      displayOrder: item.displayOrder,
    };
    
    set((s) => ({
      items: [...s.items, slimItem],
    }));
    // Refresh categories to update item counts
    get().fetchCategories();
    return item;
  },

  updateItem: async (id, data) => {
    const item = await api.put<MenuItemDetail>(`/api/v1/menu/items/${id}`, data);
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? (item as unknown as MenuItem) : i)),
    }));
    return item;
  },

  toggleAvailability: async (id) => {
    const updated = await api.patch<MenuItem>(`/api/v1/menu/items/${id}/availability`);
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, active: updated.active } : i)),
    }));
  },

  createTaxClass: async (data) => {
    const tc = await api.post<TaxClass>("/api/v1/menu/tax-classes", data);
    set((s) => ({ taxClasses: [...s.taxClasses, tc] }));
    return tc;
  },

  createAddonGroup: async (data) => {
    const ag = await api.post<AddonGroup>("/api/v1/menu/addon-groups", data);
    set((s) => ({ addonGroups: [...s.addonGroups, ag] }));
    return ag;
  },
}));