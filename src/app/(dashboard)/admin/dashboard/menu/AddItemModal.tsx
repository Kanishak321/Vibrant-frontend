"use client";

import { useState, useEffect } from "react";
import {
  X, Plus, Trash2, ChevronDown, ChevronUp,
  Leaf, Flame, Egg, Sprout, AlertCircle, Check,
} from "lucide-react";
import { useMenuStore, MenuCategory, TaxClass, AddonGroup, VegType } from "@/store/menu-store";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: MenuCategory[];
  taxClasses: TaxClass[];
  addonGroups: AddonGroup[];
}

const VEG_OPTIONS: { value: VegType; label: string; icon: React.ReactNode; ring: string; badge: string }[] = [
  {
    value: "VEG",
    label: "Veg",
    icon: <span className="w-3 h-3 rounded-sm border-2 border-green-600 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-green-600" /></span>,
    ring: "ring-green-500",
    badge: "bg-green-50 border-green-300 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400",
  },
  {
    value: "NON_VEG",
    label: "Non-Veg",
    icon: <span className="w-3 h-3 rounded-sm border-2 border-red-600 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-red-600" /></span>,
    ring: "ring-red-500",
    badge: "bg-red-50 border-red-300 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-400",
  },
  {
    value: "EGG",
    label: "Egg",
    icon: <span className="w-3 h-3 rounded-sm border-2 border-yellow-500 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /></span>,
    ring: "ring-yellow-500",
    badge: "bg-yellow-50 border-yellow-300 text-yellow-700 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-400",
  },
  {
    value: "JAIN",
    label: "Jain",
    icon: <span className="w-3 h-3 rounded-sm border-2 border-emerald-600 flex items-center justify-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /></span>,
    ring: "ring-emerald-500",
    badge: "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400",
  },
];

const ALLERGENS = ["Gluten", "Dairy", "Eggs", "Nuts", "Peanuts", "Soy", "Fish", "Shellfish", "Sesame", "Mustard"];
const CHANNELS = ["DINE_IN", "PARCEL", "ZOMATO", "SWIGGY", "MAGICPIN", "ONDC"];

const labelCls = "block text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5";
const inputCls =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AddItemModal({ isOpen, onClose, categories, taxClasses, addonGroups }: Props) {
  const { createItem, fetchItems, fetchCategories } = useMenuStore();
  const [saving, setSaving] = useState(false);
  const [showChannelPrices, setShowChannelPrices] = useState(false);

  // ── Form State ──────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [vegType, setVegType] = useState<VegType>("VEG");
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [hsnSacCode, setHsnSacCode] = useState("");
  const [kotStationId, setKotStationId] = useState("");
  const [selectedTaxClassIds, setSelectedTaxClassIds] = useState<string[]>([]);
  const [selectedAddonGroupIds, setSelectedAddonGroupIds] = useState<string[]>([]);
  const [variants, setVariants] = useState([{ name: "Regular", price: "" }]);
  const [channelPrices, setChannelPrices] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-select first category when categories load
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const reset = () => {
    setName(""); setShortCode(""); setDescription(""); setImageUrl("");
    setCategoryId(categories[0]?.id ?? ""); setVegType("VEG");
    setSelectedAllergens([]); setHsnSacCode(""); setKotStationId("");
    setSelectedTaxClassIds([]); setSelectedAddonGroupIds([]);
    setVariants([{ name: "Regular", price: "" }]);
    setChannelPrices({}); setErrors({}); setShowChannelPrices(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Item name is required";
    if (!categoryId) e.categoryId = "Please select a category";
    variants.forEach((v, i) => {
      if (!v.name.trim()) e[`variant_name_${i}`] = "Variant name required";
      if (!v.price || isNaN(parseFloat(v.price)) || parseFloat(v.price) < 0)
        e[`variant_price_${i}`] = "Valid price required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggleAllergen = (a: string) =>
    setSelectedAllergens((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const addVariant = () => setVariants((p) => [...p, { name: "", price: "" }]);
  const removeVariant = (i: number) => setVariants((p) => p.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, f: "name" | "price", v: string) =>
    setVariants((p) => p.map((x, idx) => (idx === i ? { ...x, [f]: v } : x)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await createItem({
        categoryId,
        name: name.trim(),
        shortCode: shortCode.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        vegType,
        allergens: selectedAllergens.length ? selectedAllergens.join(",") : undefined,
        hsnSacCode: hsnSacCode.trim() || undefined,
        kotStationId: kotStationId.trim() || undefined,
        isActive: true,
        taxClassIds: selectedTaxClassIds,
        addonGroupIds: selectedAddonGroupIds,
        variants: variants.map((v) => ({ name: v.name.trim(), price: parseFloat(v.price) })),
      });
      // Refresh both items and categories (for item count update)
      await Promise.all([fetchItems(), fetchCategories()]);
      toast.success(`"${name}" added to menu ✓`);
      handleClose();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to create item");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const selectedVeg = VEG_OPTIONS.find((o) => o.value === vegType)!;

  return (
    // <div
    //   className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 w-23 h-23"

    //   onClick={handleClose}
    // >
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6"
      onClick={handleClose}
    >
      <div className="min-h-screen flex items-start justify-center py-8">

        <div
          className="relative w-full max-w-2xl max-h-[95vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
          style={{
            boxShadow:
              "0 25px 60px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
          onClick={(e) => e.stopPropagation()}
        >


          {/* ── Header ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-gradient-to-r from-muted/30 to-transparent shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Plus className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground leading-tight">Add Menu Item</h2>
                <p className="text-xs text-muted-foreground">Fill in details and pricing below</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Scrollable Body ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <div className="p-6 space-y-5">

              {/* ── Section 1: Core Identity ─────────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 sm:gap-3">
                <Field label="Item Name *" hint={errors.name}>
                  <input
                    className={`${inputCls} ${errors.name ? "border-red-500 focus:ring-red-400/40" : ""}`}
                    placeholder="e.g. Paneer Tikka"
                    maxLength={80}
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })); }}
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                </Field>
                <Field label="Short Code">
                  <input
                    placeholder="PT"
                    maxLength={20}
                    className={`${inputCls} w-full sm:w-[100px]`}
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                  />
                </Field>
              </div>

              {/* Category */}
              <Field label="Category *">
                <select
                  className={`${inputCls} ${errors.categoryId ? "border-red-500" : ""}`}
                  value={categoryId}
                  onChange={(e) => { setCategoryId(e.target.value); setErrors((p) => ({ ...p, categoryId: "" })); }}
                >
                  {categories.length === 0 && <option value="">No categories — create one first</option>}
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-[11px] text-red-500">{errors.categoryId}</p>}
              </Field>

              {/* Veg Type */}
              <div>
                <label className={labelCls}>Food Type *</label>
                <div className="flex gap-2">
                  {VEG_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setVegType(opt.value)}
                      className={`flex items-center gap-2 px-3 h-9 rounded-lg border text-sm font-medium transition-all ${vegType === opt.value
                        ? `${opt.badge} ring-1 ${opt.ring}`
                        : "border-border text-muted-foreground hover:border-primary/40 bg-background"
                        }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Section 2: Variants (always visible) ─────────────────── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls}>Variants & Pricing *</label>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add variant
                  </button>
                </div>

                <div className="rounded-xl border border-border overflow-hidden divide-y divide-border bg-muted/20">
                  {/* Header row */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted/40">
                    <span className="flex-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Variant Name</span>
                    <span className="w-32 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price (₹)</span>
                    <span className="w-9" />
                  </div>

                  {variants.map((v, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-3 py-3 sm:py-2.5">
                      <div className="w-full sm:flex-1">
                        <input
                          className={`h-9 w-full rounded-lg border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${errors[`variant_name_${i}`] ? "border-red-500" : "border-input"
                            }`}
                          placeholder={i === 0 ? "Regular" : "e.g. Half / Full / Large"}
                          value={v.name}
                          onChange={(e) => { updateVariant(i, "name", e.target.value); setErrors((p) => ({ ...p, [`variant_name_${i}`]: "" })); }}
                        />
                      </div>
                      <div className="flex w-full sm:w-auto items-center gap-2">
                        <div className="w-full sm:w-32 relative">
                          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`h-9 w-full rounded-lg border bg-background pl-7 pr-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${errors[`variant_price_${i}`] ? "border-red-500" : "border-input"
                            }`}
                          placeholder="0.00"
                          value={v.price}
                          onChange={(e) => { updateVariant(i, "price", e.target.value); setErrors((p) => ({ ...p, [`variant_price_${i}`]: "" })); }}
                        /> */}
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={v.price}
                            onChange={(e) => {
                              updateVariant(i, "price", e.target.value);
                              setErrors((p) => ({
                                ...p,
                                [`variant_price_${i}`]: "",
                              }));
                            }}
                            className="h-9 w-full rounded-lg border bg-background px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            placeholder="0.00"
                          />
                        </div>
                        {variants.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="w-9 h-9 flex items-center justify-center shrink-0 rounded-lg text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : <div className="w-9 shrink-0 hidden sm:block" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Section 3: Additional Details ────────────────────────────── */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground">Item Details & Attributes</h3>

                <Field label="Description">
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
                    rows={2}
                    maxLength={500}
                    placeholder="Describe the item... (shown on Digital Menu)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground text-right mt-0.5">{description.length}/500</p>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                  <Field label="KOT Station">
                    <input className={inputCls} placeholder="Kitchen / Bar" value={kotStationId} onChange={(e) => setKotStationId(e.target.value)} />
                  </Field>
                  <Field label="HSN / SAC Code">
                    <input className={inputCls} placeholder="8-digit HSN" maxLength={20} value={hsnSacCode} onChange={(e) => setHsnSacCode(e.target.value)} />
                  </Field>
                </div>

                <Field label="Image URL">
                  <input className={inputCls} placeholder="https://... (JPG/PNG, 1:1 ratio)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </Field>

                <div>
                  <label className={labelCls}>Allergens</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALLERGENS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAllergen(a)}
                        className={`h-7 px-2.5 rounded-full text-[11px] font-medium border transition-all ${selectedAllergens.includes(a)
                          ? "bg-amber-500/15 border-amber-500/50 text-amber-700 dark:text-amber-400"
                          : "border-border text-muted-foreground hover:border-primary/40"
                          }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Tax Classes ───────────────────────────────────────────── */}
              {taxClasses.length > 0 && (
                <div>
                  <label className={labelCls}>Tax Classes</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {taxClasses.map((t) => (
                      <label
                        key={t.id}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${selectedTaxClassIds.includes(t.id)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-primary/30 bg-background"
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${selectedTaxClassIds.includes(t.id) ? "bg-primary border-primary" : "border-border"
                          }`} onClick={() => setSelectedTaxClassIds((p) => p.includes(t.id) ? p.filter((x) => x !== t.id) : [...p, t.id])}>
                          {selectedTaxClassIds.includes(t.id) && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground leading-tight">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground">{t.percent}% {t.inclusive ? "incl." : "excl."}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Addon Groups ──────────────────────────────────────────── */}
              {addonGroups.length > 0 && (
                <div>
                  <label className={labelCls}>Addon Groups</label>
                  <div className="space-y-1.5">
                    {addonGroups.map((g) => (
                      <label
                        key={g.id}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${selectedAddonGroupIds.includes(g.id)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-primary/30 bg-background"
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${selectedAddonGroupIds.includes(g.id) ? "bg-primary border-primary" : "border-border"
                          }`} onClick={() => setSelectedAddonGroupIds((p) => p.includes(g.id) ? p.filter((x) => x !== g.id) : [...p, g.id])}>
                          {selectedAddonGroupIds.includes(g.id) && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{g.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Choose {g.minSelect}–{g.maxSelect} · {g.addons.slice(0, 3).map((a) => a.name).join(", ")}{g.addons.length > 3 ? "..." : ""}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Channel Price Overrides ───────────────────────────────── */}
              <div className="rounded-xl border border-border overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowChannelPrices(!showChannelPrices)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
                >
                  <span>Channel Price Overrides</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-normal text-muted-foreground">Optional</span>
                    {showChannelPrices ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>
                {showChannelPrices && (
                  <div className="border-t border-border bg-muted/10 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CHANNELS.map((ch) => (
                      <div key={ch} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-20 shrink-0">{ch.replace("_", " ")}</span>
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                          <input
                            type="number"
                            min="0"
                            className="h-9 w-full rounded-lg border bg-background px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all "
                            placeholder="Override"
                            value={channelPrices[ch] ?? ""}
                            onChange={(e) => setChannelPrices((p) => ({ ...p, [ch]: e.target.value }))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 px-6 py-4 border-t border-border bg-muted/10 sticky bottom-0">
              <p className="text-[11px] text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                Fields marked <span className="text-red-500 font-bold">*</span> are required
              </p>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 sm:flex-none h-10 sm:h-9 px-4 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || categories.length === 0}
                  className="flex-1 sm:flex-none h-10 sm:h-9 px-5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
