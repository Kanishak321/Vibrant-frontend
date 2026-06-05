"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function CaptainDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Captain Dashboard</h1>
        <p className="text-muted-foreground">Manage table orders and kitchen status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Active Tables Placeholder
        </Card>
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Kitchen Queue Placeholder
        </Card>
      </div>
    </div>
  );
}
