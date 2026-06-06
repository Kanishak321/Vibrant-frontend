import { create } from 'zustand';

export type Employee = {
  id: string;
  name: string;
  role: string;
  outlet: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
};

export type AuditLog = {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
};

interface RolesState {
  employees: Employee[];
  auditLogs: AuditLog[];
  addEmployee: (employee: Omit<Employee, 'id' | 'status' | 'lastActive'>) => void;
  updateEmployeeStatus: (id: string, status: 'Active' | 'Inactive') => void;
  removeEmployee: (id: string) => void;
}

const initialEmployees: Employee[] = [
  { id: "EMP-001", name: "Rahul Sharma", role: "Owner / Super Admin", outlet: "All Outlets", status: "Active", lastActive: "Just now" },
  { id: "EMP-042", name: "Priya Desai", role: "Store Manager", outlet: "HSR Layout", status: "Active", lastActive: "15 mins ago" },
  { id: "EMP-089", name: "Vikram Singh", role: "Head Chef", outlet: "HSR Layout", status: "Active", lastActive: "1 hour ago" },
  { id: "EMP-105", name: "Anita Kumar", role: "Cashier", outlet: "Koramangala", status: "Inactive", lastActive: "Yesterday" },
  { id: "EMP-112", name: "Suresh Reddy", role: "Inventory Admin", outlet: "All Outlets", status: "Active", lastActive: "2 hours ago" },
];

const initialLogs: AuditLog[] = [
  { id: "LOG-991", action: "Deleted Order", user: "Rahul Sharma", timestamp: "10 mins ago", details: "Order #ZOM-8832 voided due to customer cancellation." },
  { id: "LOG-992", action: "Changed Price", user: "Priya Desai", timestamp: "1 hour ago", details: "Updated price of 'Butter Chicken' from ₹250 to ₹260." },
  { id: "LOG-993", action: "Approved PO", user: "Rahul Sharma", timestamp: "3 hours ago", details: "Approved Purchase Order PO-2024-409." },
  { id: "LOG-994", action: "Added Inventory", user: "Suresh Reddy", timestamp: "Yesterday", details: "Received 50kg Tomatoes from Metro Cash & Carry." },
  { id: "LOG-995", action: "System Login", user: "Vikram Singh", timestamp: "Yesterday", details: "Successful login from HSR Layout IP." },
];

export const useRolesStore = create<RolesState>((set) => ({
  employees: initialEmployees,
  auditLogs: initialLogs,
  
  addEmployee: (employeeData) => set((state) => ({
    employees: [
      {
        ...employeeData,
        id: `EMP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'Active',
        lastActive: 'Never',
      },
      ...state.employees,
    ]
  })),

  updateEmployeeStatus: (id, status) => set((state) => ({
    employees: state.employees.map(emp => emp.id === id ? { ...emp, status } : emp)
  })),

  removeEmployee: (id) => set((state) => ({
    employees: state.employees.filter(emp => emp.id !== id)
  }))
}));