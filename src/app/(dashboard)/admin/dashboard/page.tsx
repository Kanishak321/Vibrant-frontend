"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  Body, // not needed, wait shadcn table just uses Table, TableHeader, TableBody, TableRow, TableHead, TableCell
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { users, approveUser, rejectUser } = useAuthStore();

  const nonAdminUsers = users.filter((u) => u.role !== "Admin");
  
  const stats = [
    {
      title: "Total Users",
      value: nonAdminUsers.length,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Pending Approvals",
      value: nonAdminUsers.filter((u) => u.status === "Pending").length,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Approved Users",
      value: nonAdminUsers.filter((u) => u.status === "Approved").length,
      icon: UserCheck,
      color: "text-green-500",
    },
    {
      title: "Rejected Users",
      value: nonAdminUsers.filter((u) => u.status === "Rejected").length,
      icon: UserX,
      color: "text-red-500",
    },
  ];

  const handleApprove = (id: string) => {
    approveUser(id);
    toast.success("User approved successfully");
  };

  const handleReject = (id: string) => {
    rejectUser(id);
    toast.error("User rejected");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of user registrations and platform usage.
        </p>
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
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nonAdminUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
              {nonAdminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{user.outletName}</div>
                    <div className="text-xs text-muted-foreground">{user.outletAddress}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Approved"
                          ? "default"
                          : user.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className={user.status === "Approved" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.status === "Pending" && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => handleApprove(user.id)} className="bg-green-500 hover:bg-green-600 text-white">
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
