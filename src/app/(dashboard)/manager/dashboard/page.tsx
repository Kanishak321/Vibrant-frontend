"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagerDashboard() {
  const stats = [
    { title: "Today's Sales", value: "$4,231", icon: DollarSign },
    { title: "Staff On Duty", value: "12/15", icon: Users },
    { title: "Inventory Alerts", value: "3", icon: AlertTriangle, color: "text-red-500" },
    { title: "Weekly Revenue", value: "+14.5%", icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground">Overview of outlet operations and performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`w-4 h-4 text-muted-foreground ${stat.color || ""}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Sales Chart Placeholder
        </Card>
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Recent Activity Placeholder
        </Card>
      </div>
    </div>
  );
}
