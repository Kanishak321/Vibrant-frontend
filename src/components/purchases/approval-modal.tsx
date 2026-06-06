import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { usePurchasesStore, PurchaseOrder } from "@/store/purchases-store";
import { Check, Info } from "lucide-react";

export function ApprovalModal({ isOpen, onClose, poId }: { isOpen: boolean; onClose: () => void; poId: string | null }) {
  const { purchaseOrders, approvePurchaseOrder, rejectPurchaseOrder } = usePurchasesStore();
  const [remarks, setRemarks] = useState("");

  const po = purchaseOrders.find(p => p.id === poId);

  const handleApprove = async () => {
    if (!poId) return;
    await approvePurchaseOrder(poId, remarks);
    onClose();
  };

  const handleReject = async () => {
    if (!poId) return;
    await rejectPurchaseOrder(poId, remarks);
    onClose();
  };

  if (!po) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Order Approval">
      <div className="space-y-4">
        <div className="bg-muted/30 p-4 rounded-lg border border-border flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">PO Number</p>
            <p className="font-semibold text-foreground">{po.poNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold text-foreground text-lg">₹{po.amount}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Review Remarks (Optional)</label>
          <textarea 
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            className="w-full h-20 p-3 rounded-md border border-border bg-background text-sm resize-none" 
            placeholder="Add any notes regarding your decision..." 
          />
        </div>

        <div className="pt-4 flex justify-between items-center">
          <p className="text-xs text-muted-foreground flex items-center">
            <Info className="w-3 h-3 mr-1" /> This action will be logged.
          </p>
          <div className="flex gap-2">
            <button onClick={handleReject} className="px-4 py-2 text-sm bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20">Reject</button>
            <button onClick={handleApprove} className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
              <Check className="w-4 h-4 mr-2" /> Approve
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}