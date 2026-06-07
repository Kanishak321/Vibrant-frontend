"use client";

import { useEffect, useState, Fragment } from "react";
import {
  Plus, Search, RefreshCw, Tag, Power, PowerOff, DollarSign
} from "lucide-react";
import { useMenuStore, MenuItem, MenuCategory } from "@/store/menu-store";
import { AddItemModal } from "./AddItemModal";
import { toast } from "sonner";

// ─── Veg Type Config ───────────────────────────────────────────────────────
const VEG_DOT: Record<string, { cls: string; label: string }> = {
  VEG: { cls: "bg-green-500", label: "Veg" },
  NON_VEG: { cls: "bg-red-500", label: "Non-Veg" },
  EGG: { cls: "bg-yellow-400", label: "Egg" },
  JAIN: { cls: "bg-emerald-300", label: "Jain" },
};

// ─── Skeleton row ──────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="p-4">
          <div className="h-4 rounded-md bg-muted animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Channel price row (inline expandable) ─────────────────────────────────
function ChannelPriceRow({ itemId }: { itemId: string }) {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/menu/items/${itemId}/prices`)
      .then((r) => r.json())
      .then((json) => setPrices(json.data ?? []))
      .catch(() => setPrices([]))
      .finally(() => setLoading(false));
  }, [itemId]);

  const CHANNELS = ["DINE_IN", "PARCEL", "ZOMATO", "SWIGGY", "MAGICPIN", "ONDC"];

  return (
    <tr className="bg-muted/20">
      <td colSpan={6} className="px-4 pb-4 pt-1">
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Channel Prices
          </p>
          {loading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-28 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : prices.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No channel overrides — using variant base prices.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {CHANNELS.map((ch) => {
                const p = prices.find((x: any) => x.channel === ch);
                return (
                  <div
                    key={ch}
                    className={`px-3 py-2 rounded-lg border text-sm ${p
                        ? "border-primary/40 bg-primary/5 text-foreground"
                        : "border-border text-muted-foreground/50"
                      }`}
                  >
                    <p className="text-[10px] font-medium uppercase tracking-wider opacity-70 mb-0.5">
                      {ch.replace("_", " ")}
                    </p>
                    <p className="font-semibold">{p ? `₹${p.price}` : "—"}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function MenuManagementPage() {
  const {
    categories, items, taxClasses, addonGroups, loading,
    fetchCategories, fetchItems, fetchTaxClasses, fetchAddonGroups,
    toggleAvailability, deleteCategory, createCategory,
  } = useMenuStore();

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | "ALL">("ALL");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [expandedPriceRows, setExpandedPriceRows] = useState<Set<string>>(new Set());
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchTaxClasses();
    fetchAddonGroups();
  }, []);

  // Re-fetch items when filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems(
        activeCategoryId === "ALL" ? undefined : activeCategoryId,
        search || undefined
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [activeCategoryId, search]);

  const handleToggle = async (item: MenuItem) => {
    setTogglingId(item.id);
    try {
      await toggleAvailability(item.id);
      toast.success(`"${item.name}" marked ${item.active ? "out of stock" : "available"}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const togglePriceRow = (id: string) => {
    setExpandedPriceRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await createCategory({ name: newCategoryName.trim() });
      setNewCategoryName("");
      toast.success("Category created");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    try {
      await deleteCategory(id);
      toast.success(`"${name}" removed`);
      if (activeCategoryId === id) setActiveCategoryId("ALL");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchCategories(); fetchItems(); }}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="h-9 px-4 rounded-lg text-sm font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors"
          >
            Categories
          </button>
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="h-9 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Items", value: items.length, color: "text-foreground" },
          { label: "Active", value: items.filter((i) => i.active).length, color: "text-emerald-500" },
          { label: "Out of Stock", value: items.filter((i) => !i.active).length, color: "text-red-500" },
          { label: "Categories", value: categories.length, color: "text-primary" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Category tabs + table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Category filter pills */}
        <div className="flex items-center gap-1 px-4 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveCategoryId("ALL")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategoryId === "ALL"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            All ({items.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategoryId === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
            >
              {cat.name} ({cat.itemCount})
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 pt-3 border-b border-border">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or short code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border bg-background px-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Item</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Category</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Variant / Base Price</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Variants</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                </>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                        <Tag className="w-7 h-7 opacity-40" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">No items found</p>
                        <p className="text-xs mt-1">Add your first menu item to get started</p>
                      </div>
                      <button
                        onClick={() => setIsAddItemOpen(true)}
                        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Add Item
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <Fragment key={item.id}>
                    <tr
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors group"
                    >
                      {/* Name + veg dot */}
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-2.5 h-2.5 rounded-sm shrink-0 ${VEG_DOT[item.vegType]?.cls ?? "bg-gray-400"
                              }`}
                            title={VEG_DOT[item.vegType]?.label}
                          />
                          <div>
                            <p className={`font-medium ${item.active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                              {item.name}
                            </p>
                            {item.shortCode && (
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{item.shortCode}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">
                          {item.categoryName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4">
                        <div className="text-sm font-semibold text-foreground">
                          {item.firstVariantName && (
                            <span className="text-xs text-muted-foreground font-normal mr-1">
                              {item.firstVariantName}
                            </span>
                          )}
                          {item.firstVariantPrice != null
                            ? `₹${Number(item.firstVariantPrice).toFixed(2)}`
                            : "—"}
                        </div>
                      </td>

                      {/* Variant count */}
                      <td className="p-4 text-muted-foreground">{item.variantCount}</td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold gap-1.5 ${item.active
                              ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20"
                              : "bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20"
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.active ? "bg-emerald-500" : "bg-red-500"}`} />
                          {item.active ? "Available" : "Out of Stock"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Channel prices toggle */}
                          <button
                            onClick={() => togglePriceRow(item.id)}
                            className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center"
                            title="Channel Prices"
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                          </button>

                          {/* Toggle availability */}
                          <button
                            onClick={() => handleToggle(item)}
                            disabled={togglingId === item.id}
                            className={`h-8 w-8 rounded-lg transition-colors inline-flex items-center justify-center ${item.active
                                ? "hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
                                : "hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500"
                              }`}
                            title={item.active ? "Mark Out of Stock" : "Mark Available"}
                          >
                            {togglingId === item.id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : item.active ? (
                              <PowerOff className="h-3.5 w-3.5" />
                            ) : (
                              <Power className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded channel prices */}
                    {expandedPriceRows.has(item.id) && (
                      <ChannelPriceRow key={`prices-${item.id}`} itemId={item.id} />
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Item Modal ── */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        categories={categories}
        taxClasses={taxClasses}
        addonGroups={addonGroups}
      />

      {/* ── Category Management Modal ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-foreground tracking-tight">Manage Categories</h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Add new */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-xl border border-border bg-white/30 backdrop-blur-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="New category name"
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <button
                  onClick={handleAddCategory}
                  className="h-11 px-5 flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* List */}
              <div className="border border-border rounded-xl overflow-hidden max-h-64 overflow-y-auto divide-y divide-border bg-white/5 backdrop-blur-sm">
                {categories.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No categories yet.</div>
                ) : (
                  categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 hover:bg-white/10 transition-colors rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.itemCount} items</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-full text-red-500/80 hover:text-white hover:bg-red-600 transition-colors"
                        title="Deactivate"
                      >
                        <Plus className="w-4 h-4 rotate-45" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}