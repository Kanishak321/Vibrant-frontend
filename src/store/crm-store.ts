import { create } from 'zustand';

export type Customer = {
  id: string;
  name: string;
  phone: string;
  visits: number;
  spent: number;
  lastVisit: string;
  segment: string;
};

interface CrmState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'visits' | 'spent' | 'lastVisit' | 'segment'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
}

const initialCustomers: Customer[] = [
  { id: "CUST-001", name: "Ravi Kumar", phone: "+91 98765 43210", visits: 12, spent: 15400, lastVisit: "2 days ago", segment: "Loyal" },
  { id: "CUST-002", name: "Sneha Reddy", phone: "+91 87654 32109", visits: 3, spent: 4200, lastVisit: "1 week ago", segment: "Regular" },
  { id: "CUST-003", name: "Amit Singh", phone: "+91 76543 21098", visits: 1, spent: 850, lastVisit: "Yesterday", segment: "New" },
  { id: "CUST-004", name: "Neha Sharma", phone: "+91 65432 10987", visits: 24, spent: 32500, lastVisit: "Today", segment: "VIP" },
  { id: "CUST-005", name: "Vikram Patel", phone: "+91 54321 09876", visits: 8, spent: 9600, lastVisit: "3 weeks ago", segment: "At Risk" },
  { id: "CUST-006", name: "Anjali Desai", phone: "+91 99887 76655", visits: 2, spent: 2100, lastVisit: "4 days ago", segment: "Regular" },
  { id: "CUST-007", name: "Rohan Gupta", phone: "+91 88776 65544", visits: 15, spent: 18500, lastVisit: "Yesterday", segment: "Loyal" },
  { id: "CUST-008", name: "Priya Singh", phone: "+91 77665 54433", visits: 1, spent: 450, lastVisit: "Today", segment: "New" },
  { id: "CUST-009", name: "Karthik Nair", phone: "+91 66554 43322", visits: 42, spent: 85000, lastVisit: "2 hours ago", segment: "VIP" },
  { id: "CUST-010", name: "Meera Reddy", phone: "+91 55443 32211", visits: 5, spent: 6200, lastVisit: "1 month ago", segment: "At Risk" },
  { id: "CUST-011", name: "Arjun Kapoor", phone: "+91 44332 21100", visits: 11, spent: 14200, lastVisit: "5 days ago", segment: "Loyal" },
  { id: "CUST-012", name: "Sunita Roy", phone: "+91 33221 10099", visits: 4, spent: 3800, lastVisit: "2 weeks ago", segment: "Regular" },
  { id: "CUST-013", name: "Aarav Sharma", phone: "+91 22110 09988", visits: 28, spent: 42500, lastVisit: "Yesterday", segment: "VIP" },
  { id: "CUST-014", name: "Isha Patel", phone: "+91 11009 98877", visits: 1, spent: 950, lastVisit: "Today", segment: "New" }
];

export const useCrmStore = create<CrmState>((set) => ({
  customers: initialCustomers,
  addCustomer: (customerData) => set((state) => ({
    customers: [
      { 
        ...customerData, 
        id: `CUST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        visits: 0,
        spent: 0,
        lastVisit: "Never",
        segment: "New"
      },
      ...state.customers, 
    ]
  })),
  updateCustomer: (id, data) => set((state) => ({
    customers: state.customers.map(customer => customer.id === id ? { ...customer, ...data } : customer)
  })),
  removeCustomer: (id) => set((state) => ({
    customers: state.customers.filter(customer => customer.id !== id)
  }))
}));