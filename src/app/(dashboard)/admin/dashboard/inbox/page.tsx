"use client";

import { useEffect, useState } from "react";
import { Inbox, CheckCircle2, XCircle, Clock, UtensilsCrossed, ChefHat, PackageCheck, Loader2 } from "lucide-react";
import { useInboxStore, InboxOrder } from "@/store/inbox-store";

export default function AggregatorInboxPage() {
  const { orders, isLoading, fetchOrders, updateOrderStatus } = useInboxStore();
  const [activeTab, setActiveTab] = useState<"New" | "Preparing" | "Ready">("New");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const newOrders = orders.filter(o => o.status === "New");
  const preparingOrders = orders.filter(o => o.status === "Preparing");
  const readyOrders = orders.filter(o => o.status === "Ready");

  let filteredOrders: InboxOrder[] = [];
  if (activeTab === "New") filteredOrders = newOrders;
  if (activeTab === "Preparing") filteredOrders = preparingOrders;
  if (activeTab === "Ready") filteredOrders = readyOrders;

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || filteredOrders[0];

  const handleAction = async (id: string, newStatus: InboxOrder['status']) => {
    await updateOrderStatus(id, newStatus);
    
    // Auto-select the next available order
    const remaining = filteredOrders.filter(o => o.id !== id);
    if (remaining.length > 0) {
      setSelectedOrderId(remaining[0].id);
    } else {
      setSelectedOrderId(null);
    }
  };

  const handleAcceptAndPrint = async (id: string) => {
    // 1. Move to Preparing
    await handleAction(id, "Preparing");
    // 2. Simulate Print (browsers will open a print dialog)
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Aggregator Inbox</h2>
          <p className="text-muted-foreground text-sm">Unified order management for Swiggy, Zomato, and Magicpin.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></span>
          <span className="text-sm font-medium text-muted-foreground">Accepting Orders</span>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        {/* Orders List */}
        <div className="w-1/3 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border flex gap-2 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab("New")}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === "New" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              New ({newOrders.length})
            </button>
            <button 
              onClick={() => setActiveTab("Preparing")}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === "Preparing" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              Preparing ({preparingOrders.length})
            </button>
            <button 
              onClick={() => setActiveTab("Ready")}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${activeTab === "Ready" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              Ready ({readyOrders.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {isLoading ? (
               <div className="flex justify-center items-center h-full text-muted-foreground">
                 <Loader2 className="w-6 h-6 animate-spin" />
               </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-muted-foreground opacity-50 p-6 text-center">
                <Inbox className="w-10 h-10 mb-2" />
                <p>No {activeTab.toLowerCase()} orders right now.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedOrder?.id === order.id ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20" : "bg-card border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] uppercase font-bold text-white rounded ${
                        order.platform === "Swiggy" ? "bg-[#f97316]" : 
                        order.platform === "Zomato" ? "bg-[#ef4444]" : "bg-[#a855f7]"
                      }`}>
                        {order.platform}
                      </span>
                      <span className="font-semibold text-sm text-foreground">{order.id}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {order.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-sm text-muted-foreground">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)} Items
                    </span>
                    <span className="font-bold text-foreground">₹{order.amount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-card overflow-hidden">
          {selectedOrder ? (
            <>
              <div className="p-6 border-b border-border flex justify-between items-start bg-primary/5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 text-xs uppercase font-bold text-white rounded ${
                        selectedOrder.platform === "Swiggy" ? "bg-[#f97316]" : 
                        selectedOrder.platform === "Zomato" ? "bg-[#ef4444]" : "bg-[#a855f7]"
                      }`}>
                        {selectedOrder.platform}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">{selectedOrder.id}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Placed {selectedOrder.time} • {selectedOrder.items.reduce((sum, item) => sum + item.qty, 0)} Items • Delivery</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Order Value</p>
                  <p className="text-3xl font-bold text-primary">₹{selectedOrder.amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 printable-area">
                <h4 className="font-medium mb-4 flex items-center text-muted-foreground uppercase text-xs tracking-wider">
                  <UtensilsCrossed className="w-4 h-4 mr-2" /> Order Contents
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-border/50 border-dashed">
                      <div className="flex items-start gap-4">
                        <span className="flex items-center justify-center w-6 h-6 bg-muted rounded font-medium text-sm text-foreground shrink-0">{item.qty}</span>
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.name}</p>
                          {item.notes && <p className="text-xs text-red-500/80 mt-0.5 font-medium">Note: {item.notes}</p>}
                        </div>
                      </div>
                      <span className="font-medium text-sm text-foreground">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {selectedOrder.instructions && (
                  <div className="mt-8 bg-muted/30 p-4 rounded-lg border border-border/50">
                    <h4 className="font-medium text-sm text-foreground mb-2">Customer Instructions</h4>
                    <p className="text-sm text-muted-foreground italic">{selectedOrder.instructions}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons based on Status */}
              <div className="p-4 border-t border-border bg-muted/10 grid grid-cols-2 gap-4">
                {selectedOrder.status === "New" && (
                  <>
                    <button onClick={() => handleAction(selectedOrder.id, "Rejected")} className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20">
                      <XCircle className="w-5 h-5" /> Reject Order
                    </button>
                    <button onClick={() => handleAcceptAndPrint(selectedOrder.id)} className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-emerald-600 bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" /> Accept & Print KOT
                    </button>
                  </>
                )}

                {selectedOrder.status === "Preparing" && (
                  <>
                    <div className="flex items-center justify-center text-sm font-medium text-muted-foreground border border-border/50 rounded-lg bg-background/50">
                      Food is being prepared
                    </div>
                    <button onClick={() => handleAction(selectedOrder.id, "Ready")} className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-amber-600 bg-amber-500/20 hover:bg-amber-500/30 transition-colors border border-amber-500/30 dark:text-amber-400">
                      <ChefHat className="w-5 h-5" /> Mark as Ready
                    </button>
                  </>
                )}

                {selectedOrder.status === "Ready" && (
                  <>
                    <div className="flex items-center justify-center text-sm font-medium text-muted-foreground border border-border/50 rounded-lg bg-background/50">
                      Waiting for delivery partner
                    </div>
                    <button onClick={() => handleAction(selectedOrder.id, "Dispatched")} className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-blue-600 bg-blue-500/20 hover:bg-blue-500/30 transition-colors border border-blue-500/30 dark:text-blue-400">
                      <PackageCheck className="w-5 h-5" /> Dispatch Order
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-muted-foreground opacity-50">
              <Inbox className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}