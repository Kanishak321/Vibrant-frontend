"use client";

import { useState } from "react";
import { Users, Search, Filter, MoreHorizontal, MessageSquare, Gift, Star, Plus, Check } from "lucide-react";
import { useCrmStore } from "@/store/crm-store";
import { Modal } from "@/components/ui/modal";

export default function CRMPage() {
  const { customers, addCustomer } = useCrmStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(false);
  const [campaignData, setCampaignData] = useState({ segment: "All", message: "" });

  // Form state
  const [formData, setFormData] = useState({
    name: "", phone: ""
  });

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          customer.phone.includes(searchQuery);
    const matchesSegment = segmentFilter === "All" || customer.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  const activeVIPs = customers.filter(c => c.segment === "VIP").length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    addCustomer({
      name: formData.name,
      phone: formData.phone,
    });
    
    setIsModalOpen(false);
    setFormData({ name: "", phone: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Customer Relationship Management</h2>
          <p className="text-muted-foreground text-sm">Manage customer data, loyalty programs, and marketing campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCampaignModalOpen(true)}
            className="h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors inline-flex items-center"
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Campaign
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{customers.length}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-muted-foreground">Active VIPs</p>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{activeVIPs}</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors">
          <p className="text-sm font-medium text-muted-foreground">Avg Customer Lifetime Value</p>
          <h3 className="text-2xl font-bold text-foreground">₹4,850</h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 hover:border-primary/30 transition-colors">
          <p className="text-sm font-medium text-muted-foreground">Campaign ROI (This Month)</p>
          <h3 className="text-2xl font-bold text-emerald-500">+342%</h3>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex w-full max-w-sm items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers by name or phone..."
              className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="All">All Segments</option>
              <option value="VIP">VIP</option>
              <option value="Loyal">Loyal</option>
              <option value="Regular">Regular</option>
              <option value="At Risk">At Risk</option>
              <option value="New">New</option>
            </select>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Name</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Phone</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Total Visits</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Total Spent</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Segment</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Last Visit</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No customers found.</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{customer.name}</td>
                    <td className="p-4 text-muted-foreground">{customer.phone}</td>
                    <td className="p-4 text-foreground">{customer.visits}</td>
                    <td className="p-4 font-semibold text-foreground">₹{customer.spent.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        customer.segment === "VIP" ? "bg-amber-500/10 text-amber-500 ring-1 ring-inset ring-amber-500/20" :
                        customer.segment === "Loyal" ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20" :
                        customer.segment === "At Risk" ? "bg-red-500/10 text-red-500 ring-1 ring-inset ring-red-500/20" :
                        "bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
                      }`}>
                        {customer.segment}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{customer.lastVisit}</td>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Customer Name</label>
            <input 
              type="text" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              placeholder="e.g. John Doe" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <input 
              type="tel" 
              required 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
              placeholder="e.g. +91 9876543210" 
            />
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
              <Check className="w-4 h-4 mr-2" /> Add Customer
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isCampaignModalOpen} onClose={() => setIsCampaignModalOpen(false)} title="Create SMS Campaign">
        {campaignSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">Campaign Sent!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your message is being delivered to the {campaignData.segment} segment.
              </p>
            </div>
            <button 
              onClick={() => {
                setIsCampaignModalOpen(false);
                setCampaignSuccess(false);
                setCampaignData({ segment: "All", message: "" });
              }}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Target Segment</label>
              <select 
                value={campaignData.segment}
                onChange={(e) => setCampaignData({...campaignData, segment: e.target.value})}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="All">All Customers ({customers.length})</option>
                <option value="VIP">VIP Customers ({activeVIPs})</option>
                <option value="Loyal">Loyal Customers ({customers.filter(c => c.segment === 'Loyal').length})</option>
                <option value="At Risk">At Risk ({customers.filter(c => c.segment === 'At Risk').length})</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Campaign Message</label>
              <textarea 
                rows={4}
                value={campaignData.message}
                onChange={(e) => setCampaignData({...campaignData, message: e.target.value})}
                className="w-full p-3 rounded-md border border-border bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" 
                placeholder="e.g. Happy Weekend! Show this text to get 20% off on your next dine-in order." 
              />
              <p className="text-xs text-muted-foreground text-right">{campaignData.message.length}/160 characters</p>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setIsCampaignModalOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors text-foreground"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => {
                  if(!campaignData.message) return;
                  setCampaignSuccess(true);
                }}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors inline-flex items-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" /> Send SMS
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}