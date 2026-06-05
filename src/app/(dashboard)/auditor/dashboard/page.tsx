"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function AuditorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditor Dashboard</h1>
        <p className="text-muted-foreground">Monitor audits and activity tracking.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Recent Audit Logs Placeholder
        </Card>
        <Card className="h-64 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          Variance Reports Placeholder
        </Card>
      </div>
    </div>
  );
}
