// export default function AdminDashboard() {
//   return <div>Dashboard Home</div>;
// }

import {
  DollarSign,
  ShoppingCart,
  Store,
  AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Revenue",
      value: "₹1,24,500",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: "428",
      icon: ShoppingCart,
    },
    {
      title: "Outlets",
      value: "12",
      icon: Store,
    },
    {
      title: "Food Cost",
      value: "28.4%",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          Monitor your restaurant operations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {item.title}
                </p>
                <h2 className="text-2xl font-bold mt-2">
                  {item.value}
                </h2>
              </div>

              <item.icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border p-6">
          <h3 className="font-semibold mb-4">
            Revenue Trend
          </h3>
          <div className="h-[300px] flex items-center justify-center">
            Revenue Chart Here
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold mb-4">
            Outlet Performance
          </h3>

          <div className="space-y-4">
            <div>HSR Layout - ₹42,000</div>
            <div>Indiranagar - ₹31,000</div>
            <div>Koramangala - ₹28,000</div>
            <div>Whitefield - ₹23,000</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h3 className="font-semibold mb-4">
            Inventory Alerts
          </h3>

          <div className="space-y-3">
            <div>Tomato - Low Stock</div>
            <div>Paneer - Low Stock</div>
            <div>Cooking Oil - Low Stock</div>
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold mb-4">
            Staff Approvals
          </h3>

          <div className="space-y-3">
            <div>Rahul Kumar</div>
            <div>Priya Singh</div>
            <div>Rohit Sharma</div>
          </div>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="font-semibold mb-4">
            Top Selling Items
          </h3>

          <div className="space-y-3">
            <div>Butter Paneer</div>
            <div>Veg Burger</div>
            <div>White Sauce Pasta</div>
            <div>Cold Coffee</div>
          </div>
        </div>
      </div>
    </div>
  );
}