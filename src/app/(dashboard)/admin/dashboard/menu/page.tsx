"use client";

import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Check, Trash2, Tag } from "lucide-react";
import { useMenuStore } from "@/store/menu-store";
import { Modal } from "@/components/ui/modal";

export default function MenuManagementPage() {
  const { items, categories: storeCategories, addItem, addCategory, removeCategory } = useMenuStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [newCategoryName, setNewCategoryName] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "", category: "Starters", price: "", status: "Available", variants: "1"
  });

  const categories = ["All", ...storeCategories];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === "All" || item.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    
    addItem({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      status: formData.status,
      variants: formData.variants,
    });
    
    setIsModalOpen(false);
    setFormData({ name: "", category: "Starters", price: "", status: "Available", variants: "1" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h1>
          <p className="text-muted-foreground text-sm">Manage your categories, items, pricing, and variants.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors"
          >
            Categories
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex w-full max-w-sm items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search menu items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Item Name</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Category</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Base Price</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Variants</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No menu items found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{item.name}</td>
                    <td className="p-4"><span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">{item.category}</span></td>
                    <td className="p-4 text-foreground">₹{item.price}</td>
                    <td className="p-4 text-foreground">{item.variants}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.status === "Available" ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20" : "bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Menu Item">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Item Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              placeholder="e.g. Mutton Biryani" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price (₹)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {storeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Variants</label>
              <input 
                type="number" 
                min="1"
                value={formData.variants}
                onChange={(e) => setFormData({...formData, variants: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors text-foreground"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
            >
              <Check className="w-4 h-4 mr-2" /> Save Item
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Manage Categories">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              placeholder="New category name" 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCategoryName.trim()) {
                  addCategory(newCategoryName.trim());
                  setNewCategoryName("");
                }
              }}
            />
            <button 
              onClick={() => {
                if (newCategoryName.trim()) {
                  addCategory(newCategoryName.trim());
                  setNewCategoryName("");
                }
              }}
              className="h-10 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
            {storeCategories.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No categories found.</div>
            ) : (
              <ul className="divide-y divide-border">
                {storeCategories.map((cat) => (
                  <li key={cat} className="p-3 flex items-center justify-between hover:bg-muted/30">
                    <span className="flex items-center gap-2 text-sm text-foreground font-medium">
                      <Tag className="w-4 h-4 text-muted-foreground" /> {cat}
                    </span>
                    <button 
                      onClick={() => removeCategory(cat)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="pt-2 flex justify-end">
            <button 
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors text-foreground"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}