"use client";

import { useState, useEffect, useCallback } from "react";
import { HRLayout } from "@/components/HRLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Plane,
  Calendar,
  FileText,
} from "lucide-react";

type LeaveRequest = {
  leave_id: string;
  user_id: string;
  employeeName: string | null;
  employeeLastName: string | null;
  leave_type: string;
  leave_date_from: string;
  leave_date_to: string;
  reason_employee: string | null;
  reason_hr: string | null;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  remaining_leaves: number;
  decision_timestamp: string | null;
};

const calculateDays = (from: string, to: string) => {
  const start = new Date(from);
  const end = new Date(to);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

// Function to generate Leave Report
const generateLeaveReport = (leaves: LeaveRequest[]) => {
  const pending = leaves.filter((l) => l.status === "Pending");
  const approved = leaves.filter((l) => l.status === "Approved");
  const rejected = leaves.filter((l) => l.status === "Rejected");

  const formatRequest = (req: LeaveRequest) => `
Employee: ${req.employeeName} ${req.employeeLastName}
Type: ${req.leave_type}
Dates: ${req.leave_date_from} - ${req.leave_date_to} (${calculateDays(req.leave_date_from, req.leave_date_to)} days)
Reason: ${req.reason_employee || "N/A"}
${"─".repeat(40)}`;

  const reportContent = `
LEAVE MANAGEMENT REPORT
Generated: ${new Date().toLocaleString()}
${"=".repeat(60)}

SUMMARY
-------
Total Requests: ${leaves.length}
Pending: ${pending.length}
Approved: ${approved.length}
Rejected: ${rejected.length}

PENDING REQUESTS
----------------
${pending.map(formatRequest).join("")}

APPROVED REQUESTS
-----------------
${approved.map(formatRequest).join("")}

REJECTED REQUESTS
-----------------
${rejected.map(formatRequest).join("")}

${"=".repeat(60)}
End of Report
  `;

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leave-report-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function HRLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = useCallback(async () => {
    const res = await fetch("/api/hr/leaves");
    const data = await res.json();
    setLeaves(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleApprove = async (leaveId: string) => {
    await fetch("/api/hr/leaves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leave_id: leaveId, action: "approve" }),
    });
    fetchLeaves();
  };

  const handleReject = async (leaveId: string) => {
    await fetch("/api/hr/leaves", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leave_id: leaveId, action: "reject" }),
    });
    fetchLeaves();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  const pending = leaves.filter((l) => l.status === "Pending");
  const approved = leaves.filter((l) => l.status === "Approved");
  const rejected = leaves.filter((l) => l.status === "Rejected");

  const totalRequests = leaves.length;
  const totalPending = pending.length;
  const totalApproved = approved.length;
  const totalRejected = rejected.length;

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Leave Management
            </h1>
            <p className="text-muted-foreground">
              Review and manage employee leave requests
            </p>
          </div>
          <Button
            onClick={() => generateLeaveReport(leaves)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Requests
              </CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{totalRequests}</div>
              <p className="text-sm text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-orange-600">
                {totalPending}
              </div>
              <p className="text-sm text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-green-600">
                {totalApproved}
              </div>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-red-600">
                {totalRejected}
              </div>
              <p className="text-sm text-muted-foreground">Declined</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              Manage all employee leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({totalPending})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({totalApproved})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({totalRejected})
                </TabsTrigger>
              </TabsList>

              {/* Pending Requests */}
              <TabsContent value="pending">
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading...</p>
                ) : pending.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pending leave requests</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pending.map((request) => (
                        <TableRow key={request.leave_id}>
                          <TableCell className="font-medium">
                            {request.employeeName} {request.employeeLastName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.leave_type}</Badge>
                          </TableCell>
                          <TableCell>{request.leave_date_from}</TableCell>
                          <TableCell>{request.leave_date_to}</TableCell>
                          <TableCell className="font-medium">
                            {calculateDays(request.leave_date_from, request.leave_date_to)}
                          </TableCell>
                          <TableCell>{request.reason_employee || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(request.leave_id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request.leave_id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* Approved Requests */}
              <TabsContent value="approved">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approved.map((request) => (
                      <TableRow key={request.leave_id}>
                        <TableCell className="font-medium">
                          {request.employeeName} {request.employeeLastName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.leave_type}</Badge>
                        </TableCell>
                        <TableCell>{request.leave_date_from}</TableCell>
                        <TableCell>{request.leave_date_to}</TableCell>
                        <TableCell className="font-medium">
                          {calculateDays(request.leave_date_from, request.leave_date_to)}
                        </TableCell>
                        <TableCell>{request.reason_employee || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Rejected Requests */}
              <TabsContent value="rejected">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejected.map((request) => (
                      <TableRow key={request.leave_id}>
                        <TableCell className="font-medium">
                          {request.employeeName} {request.employeeLastName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.leave_type}</Badge>
                        </TableCell>
                        <TableCell>{request.leave_date_from}</TableCell>
                        <TableCell>{request.leave_date_to}</TableCell>
                        <TableCell className="font-medium">
                          {calculateDays(request.leave_date_from, request.leave_date_to)}
                        </TableCell>
                        <TableCell>{request.reason_employee || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
}
