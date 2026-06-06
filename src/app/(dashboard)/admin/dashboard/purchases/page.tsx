// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { FileText, Plus, Search, Filter, MoreHorizontal, ArrowRight, Check, X, Printer, Copy, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
// import { usePurchasesStore, PurchaseOrder } from "@/store/purchases-store";
// import { VendorModal } from "@/components/purchases/vendor-modal";
// import { POModal } from "@/components/purchases/po-modal";
// import { ApprovalModal } from "@/components/purchases/approval-modal";

// export default function PurchasesPage() {
//   const { purchaseOrders, vendors, fetchData, isLoading } = usePurchasesStore();
  
//   // Modals state
//   const [isVendorModalOpen, setVendorModalOpen] = useState(false);
//   const [isPOModalOpen, setPOModalOpen] = useState(false);
//   const [approvalPOId, setApprovalPOId] = useState<string | null>(null);

//   // Search & Filter state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [vendorFilter, setVendorFilter] = useState("All");
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Actions Dropdown
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Derived dashboard metrics
//   const totalPurchases = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);
//   const pendingCount = purchaseOrders.filter(po => po.status === "Pending Approval" || po.status === "Draft").length;
//   const activeVendorsCount = vendors.filter(v => v.status === "Active").length;

//   // Filter & Search Logic
//   const filteredOrders = useMemo(() => {
//     return purchaseOrders.filter(po => {
//       const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                             po.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
//       const matchesStatus = statusFilter === "All" || po.status === statusFilter;
//       const matchesVendor = vendorFilter === "All" || po.vendorId === vendorFilter;
//       return matchesSearch && matchesStatus && matchesVendor;
//     });
//   }, [purchaseOrders, searchQuery, statusFilter, vendorFilter]);

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
//   const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const handleAction = (action: string, po: PurchaseOrder) => {
//     setActiveDropdown(null);
//     if (action === "approve") setApprovalPOId(po.id);
//     if (action === "print") alert(`Printing PO PDF for ${po.poNumber}...`);
//     if (action === "view") alert(`Opening details for ${po.poNumber}...`);
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "Received": return "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20";
//       case "Approved": return "bg-blue-500/10 text-blue-500 ring-blue-500/20";
//       case "Rejected": return "bg-red-500/10 text-red-500 ring-red-500/20";
//       case "Draft": return "bg-gray-500/10 text-gray-500 ring-gray-500/20";
//       default: return "bg-amber-500/10 text-amber-500 ring-amber-500/20"; // Pending
//     }
//   };

//   return (
//     <div className="space-y-6 pb-20">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold tracking-tight text-foreground">Purchases & Approvals</h2>
//           <p className="text-muted-foreground text-sm">Manage vendors, purchase orders, and multi-level approvals.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <button onClick={() => setVendorModalOpen(true)} className="h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors">
//             Vendors
//           </button>
//           <button onClick={() => setPOModalOpen(true)} className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center">
//             <Plus className="mr-2 h-4 w-4" /> Create PO
//           </button>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-4 mb-6">
//         <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setStatusFilter("All")}>
//           <p className="text-sm font-medium text-muted-foreground">Total Purchases (Mtd)</p>
//           <h3 className="text-2xl font-bold text-foreground">₹{totalPurchases.toLocaleString()}</h3>
//         </div>
//         <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setStatusFilter("Pending Approval")}>
//           <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
//           <h3 className="text-2xl font-bold text-amber-500">{pendingCount}</h3>
//         </div>
//         <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setVendorModalOpen(true)}>
//           <p className="text-sm font-medium text-muted-foreground">Active Vendors</p>
//           <h3 className="text-2xl font-bold text-foreground">{activeVendorsCount}</h3>
//         </div>
//         <div className="rounded-xl border border-border bg-card p-4 space-y-2 bg-primary/5 border-primary/20 cursor-pointer">
//           <p className="text-sm font-medium text-primary">Price Variance Alerts</p>
//           <div className="flex items-center justify-between">
//             <h3 className="text-2xl font-bold text-primary">2 Items</h3>
//             <ArrowRight className="w-5 h-5 text-primary hover:opacity-80 transition-opacity" />
//           </div>
//         </div>
//       </div>

//       <div className="rounded-xl border border-border bg-card shadow-sm">
//         <div className="p-4 border-b border-border flex items-center justify-between gap-4">
//           <div className="flex w-full max-w-sm items-center relative">
//             <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search by PO Number or Vendor..."
//               className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <select 
//               value={statusFilter} 
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="h-9 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none"
//             >
//               <option value="All">All Statuses</option>
//               <option value="Draft">Draft</option>
//               <option value="Pending Approval">Pending Approval</option>
//               <option value="Approved">Approved</option>
//               <option value="Rejected">Rejected</option>
//             </select>
//             <select 
//               value={vendorFilter} 
//               onChange={(e) => setVendorFilter(e.target.value)}
//               className="h-9 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none max-w-[150px] truncate"
//             >
//               <option value="All">All Vendors</option>
//               {vendors.map(v => (
//                 <option key={v.id} value={v.id}>{v.name}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="relative w-full overflow-auto min-h-[300px]">
//           {isLoading ? (
//             <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
//               <Loader2 className="w-8 h-8 animate-spin mb-4" />
//               <p>Loading purchases...</p>
//             </div>
//           ) : paginatedOrders.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
//               <FileText className="w-12 h-12 mb-4 opacity-20" />
//               <p>No purchase orders found.</p>
//             </div>
//           ) : (
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border bg-muted/50">
//                   <th className="h-10 px-4 text-left font-medium text-muted-foreground">PO Number</th>
//                   <th className="h-10 px-4 text-left font-medium text-muted-foreground">Vendor</th>
//                   <th className="h-10 px-4 text-left font-medium text-muted-foreground">Date</th>
//                   <th className="h-10 px-4 text-left font-medium text-muted-foreground">Amount</th>
//                   <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
//                   <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedOrders.map((po) => (
//                   <tr key={po.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
//                     <td className="p-4 font-medium text-foreground flex items-center gap-2 cursor-pointer hover:underline text-primary" onClick={() => handleAction('view', po)}>
//                       <FileText className="w-4 h-4 text-muted-foreground" /> {po.poNumber}
//                     </td>
//                     <td className="p-4 text-foreground">{po.vendorName}</td>
//                     <td className="p-4 text-muted-foreground">{po.date}</td>
//                     <td className="p-4 font-semibold text-foreground">₹{po.amount.toLocaleString()}</td>
//                     <td className="p-4">
//                       <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(po.status)}`}>
//                         {po.status}
//                       </span>
//                     </td>
//                     <td className="p-4 text-right relative">
//                       <button 
//                         onClick={() => setActiveDropdown(activeDropdown === po.id ? null : po.id)}
//                         className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center"
//                       >
//                         <MoreHorizontal className="h-4 w-4" />
//                       </button>
                      
//                       {activeDropdown === po.id && (
//                         <div className="absolute right-8 top-10 w-48 bg-card border border-border rounded-md shadow-lg z-50 py-1 flex flex-col text-left">
//                           <button onClick={() => handleAction('view', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center"><Eye className="w-4 h-4 mr-2"/> View Details</button>
//                           {(po.status === "Pending Approval" || po.status === "Draft") && (
//                             <button onClick={() => handleAction('approve', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center text-blue-500"><Check className="w-4 h-4 mr-2"/> Approve / Reject</button>
//                           )}
//                           <button onClick={() => handleAction('print', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center"><Printer className="w-4 h-4 mr-2"/> Download PDF</button>
//                           <button onClick={() => handleAction('duplicate', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center"><Copy className="w-4 h-4 mr-2"/> Duplicate</button>
//                           <button className="px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 flex items-center"><X className="w-4 h-4 mr-2"/> Delete</button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         {!isLoading && filteredOrders.length > 0 && (
//           <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
//             <div>
//               Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} Orders
//             </div>
//             <div className="flex items-center gap-2">
//               <button 
//                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                 disabled={currentPage === 1}
//                 className="p-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
//               <span className="px-2 font-medium text-foreground">Page {currentPage} of {totalPages}</span>
//               <button 
//                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                 disabled={currentPage === totalPages}
//                 className="p-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <VendorModal isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} />
//       <POModal isOpen={isPOModalOpen} onClose={() => setPOModalOpen(false)} />
//       <ApprovalModal isOpen={!!approvalPOId} onClose={() => setApprovalPOId(null)} poId={approvalPOId} />
      
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useMemo } from "react";
import { FileText, Plus, Search, Filter, MoreHorizontal, ArrowRight, Check, X, Printer, Copy, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { usePurchasesStore, PurchaseOrder } from "@/store/purchases-store";
import { VendorModal } from "@/components/purchases/vendor-modal";
import { POModal } from "@/components/purchases/po-modal";
import { ApprovalModal } from "@/components/purchases/approval-modal";

export default function PurchasesPage() {
  const { purchaseOrders, vendors, fetchData, isLoading } = usePurchasesStore();
  
  // Modals state
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isPOModalOpen, setPOModalOpen] = useState(false);
  const [approvalPOId, setApprovalPOId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [vendorFilter, setVendorFilter] = useState("All");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Actions Dropdown
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived dashboard metrics
  const totalPurchases = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);
  const pendingCount = purchaseOrders.filter(po => po.status === "Pending Approval" || po.status === "Draft").length;
  const activeVendorsCount = vendors.filter(v => v.status === "Active").length;

  // Filter & Search Logic
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter(po => {
      const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            po.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || po.status === statusFilter;
      const matchesVendor = vendorFilter === "All" || po.vendorId === vendorFilter;
      return matchesSearch && matchesStatus && matchesVendor;
    });
  }, [purchaseOrders, searchQuery, statusFilter, vendorFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (action: string, po: PurchaseOrder) => {
    setActiveDropdown(null);
    if (action === "approve") setApprovalPOId(po.id);
    if (action === "print") alert(`Printing PO PDF for ${po.poNumber}...`);
    if (action === "view") alert(`Opening details for ${po.poNumber}...`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Received": return "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20";
      case "Approved": return "bg-blue-500/10 text-blue-500 ring-blue-500/20";
      case "Rejected": return "bg-red-500/10 text-red-500 ring-red-500/20";
      case "Draft": return "bg-gray-500/10 text-gray-500 ring-gray-500/20";
      default: return "bg-amber-500/10 text-amber-500 ring-amber-500/20"; // Pending
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Purchases & Approvals</h2>
          <p className="text-muted-foreground text-sm">Manage vendors, purchase orders, and multi-level approvals.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setVendorModalOpen(true)} className="h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors">
            Vendors
          </button>
          <button onClick={() => setPOModalOpen(true)} className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Create PO
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setStatusFilter("All")}>
          <p className="text-sm font-medium text-muted-foreground">Total Purchases (Mtd)</p>
          <h3 className="text-2xl font-bold text-foreground">₹{totalPurchases.toLocaleString()}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setStatusFilter("Pending Approval")}>
          <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
          <h3 className="text-2xl font-bold text-amber-500">{pendingCount}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setVendorModalOpen(true)}>
          <p className="text-sm font-medium text-muted-foreground">Active Vendors</p>
          <h3 className="text-2xl font-bold text-foreground">{activeVendorsCount}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 bg-primary/5 border-primary/20 cursor-pointer">
          <p className="text-sm font-medium text-primary">Price Variance Alerts</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-primary">2 Items</h3>
            <ArrowRight className="w-5 h-5 text-primary hover:opacity-80 transition-opacity" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex w-full max-w-sm items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by PO Number or Vendor..."
              className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select 
              value={vendorFilter} 
              onChange={(e) => setVendorFilter(e.target.value)}
              className="h-9 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none max-w-[150px] truncate"
            >
              <option value="All">All Vendors</option>
              {vendors.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full overflow-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Loading purchases...</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>No purchase orders found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">PO Number</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Vendor</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((po) => (
                  <tr key={po.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground flex items-center gap-2 cursor-pointer hover:underline text-primary" onClick={() => handleAction('view', po)}>
                      <FileText className="w-4 h-4 text-muted-foreground" /> {po.poNumber}
                    </td>
                    <td className="p-4 text-foreground">{po.vendorName}</td>
                    <td className="p-4 text-muted-foreground">{po.date}</td>
                    <td className="p-4 font-semibold text-foreground">₹{po.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="p-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === po.id ? null : po.id)}
                        className="h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      
                      {activeDropdown === po.id && (
                        <div className="absolute right-8 top-10 w-48 bg-card border border-border rounded-md shadow-lg z-50 py-1 flex flex-col text-left">
                          <button onClick={() => handleAction('view', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center"><Eye className="w-4 h-4 mr-2"/> View Details</button>
                          {(po.status === "Pending Approval" || po.status === "Draft") && (
                            <button onClick={() => handleAction('approve', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center text-blue-500"><Check className="w-4 h-4 mr-2"/> Approve / Reject</button>
                          )}
                          <button onClick={() => handleAction('print', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center"><Printer className="w-4 h-4 mr-2"/> Download PDF</button>
                          <button onClick={() => handleAction('duplicate', po)} className="px-4 py-2 text-sm hover:bg-muted flex items-center"><Copy className="w-4 h-4 mr-2"/> Duplicate</button>
                          <button className="px-4 py-2 text-sm hover:bg-red-500/10 text-red-500 flex items-center"><X className="w-4 h-4 mr-2"/> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} Orders
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-medium text-foreground">Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 border border-border rounded-md hover:bg-muted disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <VendorModal isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} />
      <POModal isOpen={isPOModalOpen} onClose={() => setPOModalOpen(false)} />
      <ApprovalModal isOpen={!!approvalPOId} onClose={() => setApprovalPOId(null)} poId={approvalPOId} />
      
    </div>
  );
}
