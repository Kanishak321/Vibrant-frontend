"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function InventoryDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Dashboard</h1>
        <p className="text-muted-foreground">Manage stock levels and vendors.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Low Stock Alerts Placeholder
        </Card>
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Current Inventory Placeholder
        </Card>
      </div>
    </div>
  );
}
