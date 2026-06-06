"use client";

import { useState } from "react";
import { ShieldCheck, Plus, Search, MoreHorizontal, UserCheck, ShieldAlert, History, Check } from "lucide-react";
import { useRolesStore } from "@/store/roles-store";
import { Modal } from "@/components/ui/modal";

export default function RolesAndAuditPage() {
  const { employees, auditLogs, addEmployee } = useRolesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [outletFilter, setOutletFilter] = useState("All Outlets");
  
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ name: "", role: "Cashier", outlet: "All Outlets" });

  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const customRolesCount = new Set(employees.map(e => e.role)).size;

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOutlet = outletFilter === "All Outlets" || emp.outlet === outletFilter || emp.outlet === "All Outlets";
    return matchesSearch && matchesOutlet;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addEmployee(formData);
    setIsEmployeeModalOpen(false);
    setFormData({ name: "", role: "Cashier", outlet: "All Outlets" });
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Roles & Audit Logs</h2>
          <p className="text-muted-foreground text-sm">Manage employee access controls and track system activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsAuditModalOpen(true)} className="h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-background text-foreground hover:bg-accent transition-colors inline-flex items-center">
            <History className="mr-2 h-4 w-4" /> View Audit Logs
          </button>
          <button onClick={() => setIsEmployeeModalOpen(true)} className="h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center space-x-4 hover:border-primary/30 transition-colors">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-full">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
            <h3 className="text-2xl font-bold text-foreground">{activeEmployees}</h3>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center space-x-4 hover:border-primary/30 transition-colors">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Custom Roles</p>
            <h3 className="text-2xl font-bold text-foreground">{customRolesCount}</h3>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center space-x-4 hover:border-primary/30 transition-colors">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Critical Actions Today</p>
            <h3 className="text-2xl font-bold text-foreground">12</h3>
          </div>
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
              placeholder="Search employees or roles..."
              className="h-9 w-full rounded-md border border-border bg-background px-9 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value)}
              className="h-9 rounded-md border border-border bg-background px-3 py-1 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="All Outlets">All Outlets</option>
              <option value="HSR Layout">HSR Layout</option>
              <option value="Koramangala">Koramangala</option>
            </select>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Employee ID</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Name</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Role</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Outlet Access</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Status</th>
                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Last Active</th>
                <th className="h-10 px-4 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">No employees found matching your criteria.</td>
                </tr>
              ) : (
                filteredEmployees.map((staff) => (
                  <tr key={staff.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-muted-foreground">{staff.id}</td>
                    <td className="p-4 font-medium text-foreground">{staff.name}</td>
                    <td className="p-4 text-foreground">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        staff.role.includes("Admin") ? "bg-purple-500/10 text-purple-500 ring-purple-500/20" : "bg-muted text-muted-foreground ring-border"
                      }`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{staff.outlet}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        staff.status === "Active" ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20" : "bg-muted text-muted-foreground ring-1 ring-inset ring-border"
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{staff.lastActive}</td>
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

      {/* Add Employee Modal */}
      <Modal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} title="Add New Employee">
        <form onSubmit={handleAddEmployee} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="e.g. Aditi Rao" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="Cashier">Cashier</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Head Chef">Head Chef</option>
              <option value="Inventory Admin">Inventory Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Outlet Access</label>
            <select value={formData.outlet} onChange={e => setFormData({...formData, outlet: e.target.value})} className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              <option value="All Outlets">All Outlets</option>
              <option value="HSR Layout">HSR Layout</option>
              <option value="Koramangala">Koramangala</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center">
              <Check className="w-4 h-4 mr-2" /> Add Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* View Audit Logs Modal */}
      <Modal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} title="System Audit Logs">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {auditLogs.map(log => (
            <div key={log.id} className="p-4 rounded-lg border border-border bg-muted/20">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-md">{log.action}</span>
                  <span className="text-sm font-medium text-foreground">{log.user}</span>
                </div>
                <span className="text-xs text-muted-foreground">{log.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{log.details}</p>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-end">
          <button onClick={() => setIsAuditModalOpen(false)} className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted">Close</button>
        </div>
      </Modal>
    </div>
  );
}