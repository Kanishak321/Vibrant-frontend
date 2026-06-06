"use client";

import { useState } from "react";
import { Package, Plus, Search, Filter, AlertCircle, ArrowDownToLine, ArrowUpToLine, MoreHorizontal, Check } from "lucide-react";
import { useInventoryStore } from "@/store/inventory-store";
import { Modal } from "@/components/ui/modal";

export default function InventoryPage() {
  const { items, addItem } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];

  // Form state
  const [formData, setFormData] = useState({
    name: "", category: "Vegetables", quantity: "", minStock: ""
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === "All" || item.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = items.filter(i => i.status === "Low Stock" || i.status === "Out of Stock").length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.minStock) return;
    const qty = Number(formData.quantity);
    const min = Number(formData.minStock);
    const status = qty === 0 ? "Out of Stock" : (qty <= min ? "Low Stock" : "In Stock");

    addItem({
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      minStock: formData.minStock,
      status,
    });
    
    setIsModalOpen(false);
    setFormData({ name: "", category: "Vegetables", quantity: "", minStock: "" });
  };

  const handleExport = () => {
    const headers = ["Item Name,Category,Current Qty,Min. Stock,Status,Last Updated"];
    const rows = items.map(item => 
      `${item.name},${item.category},${item.quantity},${item.minStock},${item.status},${item.lastUpdated}`
    );
    const csvContent = headers.concat(rows).join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory & Recipes</h1>
          <p className="text-muted-foreground text-sm">Track raw materials, stock levels, and recipe consumption.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors inline-flex items-center">
            <ArrowDownToLine className="mr-2 h-4 w-4" /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Stock
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center space-x-4 hover:border-primary/30 transition-colors">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Items in Stock</p>
            <h3 className="text-2xl font-bold text-foreground">{items.length}</h3>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center space-x-4 hover:border-primary/30 transition-colors">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-foreground">{lowStockCount}</h3>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center space-x-4 hover:border-primary/30 transition-colors">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-full">
            <ArrowUpToLine className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Monthly Consumption</p>
            <h3 className="text-2xl font-bold text-foreground">₹4.2L</h3>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex w-full max-w-sm items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
            />
          </div>
          <select 
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Item Name</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Category</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Current Qty</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Min. Stock</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Last Updated</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No inventory items found.</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{item.name}</td>
                    <td className="p-4"><span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border">{item.category}</span></td>
                    <td className="p-4 font-semibold text-foreground">{item.quantity}</td>
                    <td className="p-4 text-muted-foreground">{item.minStock}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        item.status === "In Stock" ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20" : 
                        item.status === "Low Stock" ? "bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20" : 
                        "bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.lastUpdated}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Stock Item">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Item Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              placeholder="e.g. Potatoes" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Meat">Meat</option>
                <option value="Dairy">Dairy</option>
                <option value="Grains">Grains</option>
                <option value="Packaged">Packaged</option>
                <option value="Spices">Spices</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Quantity</label>
              <input 
                type="text" 
                required
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                placeholder="e.g. 10 kg" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Min. Stock Alert</label>
              <input 
                type="text" 
                required
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                placeholder="e.g. 2 kg" 
              />
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
    </div>
  );
}