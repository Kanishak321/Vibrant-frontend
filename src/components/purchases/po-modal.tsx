import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { usePurchasesStore, PurchaseItem } from "@/store/purchases-store";
import { Plus, Trash, Check } from "lucide-react";

export function POModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { vendors, addPurchaseOrder } = usePurchasesStore();
  const [vendorId, setVendorId] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [notes, setNotes] = useState("");
  
  const [newItem, setNewItem] = useState({ name: "", quantity: 1, price: 0 });

  const handleAddItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.price < 0) return;
    setItems([...items, { ...newItem, id: crypto.randomUUID() }]);
    setNewItem({ name: "", quantity: 1, price: 0 });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const taxAmount = subtotal * 0.05; // 5% GST
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = async (status: "Draft" | "Pending Approval") => {
    let finalItems = [...items];
    if (newItem.name && newItem.quantity > 0 && newItem.price >= 0) {
      finalItems.push({ ...newItem, id: crypto.randomUUID() });
      setItems(finalItems);
      setNewItem({ name: "", quantity: 1, price: 0 });
    }

    if (!vendorId || finalItems.length === 0) return alert("Select vendor and add items");
    
    const vendor = vendors.find(v => v.id === vendorId);
    
    const finalSubtotal = finalItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const finalTaxAmount = finalSubtotal * 0.05;
    const finalTotalAmount = finalSubtotal + finalTaxAmount;

    await addPurchaseOrder({
      vendorId,
      vendorName: vendor?.name || "Unknown Vendor",
      amount: finalTotalAmount,
      items: finalItems,
      remarks: notes,
      status
    });
    
    onClose();
    setVendorId("");
    setItems([]);
    setNotes("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Purchase Order">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Select Vendor</label>
          <select required value={vendorId} onChange={e => setVendorId(e.target.value)} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm">
            <option value="">-- Choose a vendor --</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        <div className="border border-border rounded-lg p-4 space-y-4 bg-muted/20">
          <p className="text-sm font-medium">Add Items</p>
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs text-muted-foreground">Item Name</label>
              <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full h-9 px-2 text-sm rounded-md border border-border bg-background" placeholder="Tomato" />
            </div>
            <div className="w-20 space-y-1">
              <label className="text-xs text-muted-foreground">Qty</label>
              <input type="number" min="1" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} className="w-full h-9 px-2 text-sm rounded-md border border-border bg-background" />
            </div>
            <div className="w-24 space-y-1">
              <label className="text-xs text-muted-foreground">Price</label>
              <input type="number" min="0" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} className="w-full h-9 px-2 text-sm rounded-md border border-border bg-background" />
            </div>
            <button type="button" onClick={handleAddItem} className="h-9 px-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {items.length > 0 && (
            <div className="mt-4 border-t border-border pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">₹{item.price}</td>
                      <td className="py-2 text-right font-medium">₹{item.quantity * item.price}</td>
                      <td className="py-2 text-right">
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-600">
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Tax (5% GST)</span>
                  <span>₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-medium text-foreground border-t border-border/50">
                  <span>Total Order Amount</span>
                  <span className="text-lg font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Notes / Remarks</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm resize-none" placeholder="Add any special instructions..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Attachments</label>
          <input type="file" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
          <button type="button" onClick={() => handleSubmit("Draft")} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted bg-background flex items-center">
             Save as Draft
          </button>
          <button type="button" onClick={() => handleSubmit("Pending Approval")} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center">
            <Check className="w-4 h-4 mr-2" /> Submit for Approval
          </button>
        </div>
      </div>
    </Modal>
  );
}