import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { usePurchasesStore } from "@/store/purchases-store";
import { Check, Plus, Trash2, Building2 } from "lucide-react";

export function VendorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { vendors, addVendor } = usePurchasesStore();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: "", contactPerson: "", phone: "", email: "", status: "Active" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVendor(formData);
    setFormData({ name: "", contactPerson: "", phone: "", email: "", status: "Active" });
    setIsAdding(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Vendors">
      {isAdding ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Vendor Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm" placeholder="e.g. Metro Cash & Carry" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contact Person</label>
              <input type="text" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center">
              <Check className="w-4 h-4 mr-2" /> Save Vendor
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-muted-foreground">All registered vendors</p>
            <button onClick={() => setIsAdding(true)} className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Vendor
            </button>
          </div>
          <div className="border border-border rounded-lg max-h-80 overflow-y-auto">
            {vendors.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">No vendors found.</div>
            ) : (
              <ul className="divide-y divide-border">
                {vendors.map(vendor => (
                  <li key={vendor.id} className="p-4 flex items-start justify-between hover:bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-md mt-0.5">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{vendor.name}</h4>
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                          <p>{vendor.contactPerson} • {vendor.phone}</p>
                          {vendor.email && <p>{vendor.email}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${vendor.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{vendor.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="pt-2 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Done</button>
          </div>
        </div>
      )}
    </Modal>
  );
}