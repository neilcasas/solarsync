"use client";

import { useState } from "react";
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
} from "lucide-react";

// Mock leave requests
const pendingRequests = [
  {
    id: 1,
    employeeName: "Alice Johnson",
    type: "Vacation",
    startDate: "Dec 20, 2025",
    endDate: "Dec 31, 2025",
    days: 12,
    reason: "Year-end holiday",
    status: "Pending",
  },
  {
    id: 2,
    employeeName: "Carol Martinez",
    type: "Personal",
    startDate: "Nov 15, 2025",
    endDate: "Nov 16, 2025",
    days: 2,
    reason: "Family matter",
    status: "Pending",
  },
  {
    id: 3,
    employeeName: "Frank Brown",
    type: "Sick Leave",
    startDate: "Nov 18, 2025",
    endDate: "Nov 18, 2025",
    days: 1,
    reason: "Medical appointment",
    status: "Pending",
  },
  {
    id: 4,
    employeeName: "Grace Chen",
    type: "Vacation",
    startDate: "Dec 1, 2025",
    endDate: "Dec 5, 2025",
    days: 5,
    reason: "Travel",
    status: "Pending",
  },
];

const approvedRequests = [
  {
    id: 5,
    employeeName: "Bob Smith",
    type: "Sick Leave",
    startDate: "Nov 8, 2025",
    endDate: "Nov 8, 2025",
    days: 1,
    reason: "Medical appointment",
    status: "Approved",
    approvedBy: "HR Admin",
    approvedDate: "Nov 7, 2025",
  },
  {
    id: 6,
    employeeName: "David Lee",
    type: "Vacation",
    startDate: "Oct 10, 2025",
    endDate: "Oct 14, 2025",
    days: 5,
    reason: "Vacation",
    status: "Approved",
    approvedBy: "HR Admin",
    approvedDate: "Oct 5, 2025",
  },
  {
    id: 7,
    employeeName: "Emma Wilson",
    type: "Personal",
    startDate: "Nov 1, 2025",
    endDate: "Nov 1, 2025",
    days: 1,
    reason: "Personal errand",
    status: "Approved",
    approvedBy: "HR Admin",
    approvedDate: "Oct 30, 2025",
  },
];

const rejectedRequests = [
  {
    id: 8,
    employeeName: "Henry Davis",
    type: "Vacation",
    startDate: "Dec 23, 2025",
    endDate: "Dec 26, 2025",
    days: 4,
    reason: "Holiday",
    status: "Rejected",
    rejectedBy: "HR Admin",
    rejectedDate: "Nov 10, 2025",
    rejectionReason: "Insufficient coverage",
  },
];

export default function HRLeavesPage() {
  const [pending, setPending] = useState(pendingRequests);
  const [approved, setApproved] = useState(approvedRequests);
  const [rejected, setRejected] = useState(rejectedRequests);

  const handleApprove = (requestId: number) => {
    const request = pending.find((r) => r.id === requestId);
    if (request) {
      setPending(pending.filter((r) => r.id !== requestId));
      setApproved([
        ...approved,
        {
          ...request,
          status: "Approved",
          approvedBy: "HR Admin",
          approvedDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        },
      ]);
    }
  };

  const handleReject = (requestId: number) => {
    const request = pending.find((r) => r.id === requestId);
    if (request) {
      setPending(pending.filter((r) => r.id !== requestId));
      setRejected([
        ...rejected,
        {
          ...request,
          status: "Rejected",
          rejectedBy: "HR Admin",
          rejectedDate: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          rejectionReason: "Manual rejection",
        },
      ]);
    }
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

  const totalRequests = pending.length + approved.length + rejected.length;
  const totalPending = pending.length;
  const totalApproved = approved.length;
  const totalRejected = rejected.length;

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Leave Management
          </h1>
          <p className="text-muted-foreground">
            Review and manage employee leave requests
          </p>
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
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {totalPending}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalApproved}
              </div>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {totalRejected}
              </div>
              <p className="text-xs text-muted-foreground">Declined</p>
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
                {pending.length === 0 ? (
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
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.employeeName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.type}</Badge>
                          </TableCell>
                          <TableCell>{request.startDate}</TableCell>
                          <TableCell>{request.endDate}</TableCell>
                          <TableCell className="font-medium">
                            {request.days}
                          </TableCell>
                          <TableCell>{request.reason}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request.id)}
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
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.employeeName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.type}</Badge>
                        </TableCell>
                        <TableCell>{request.startDate}</TableCell>
                        <TableCell>{request.endDate}</TableCell>
                        <TableCell className="font-medium">
                          {request.days}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
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
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.employeeName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.type}</Badge>
                        </TableCell>
                        <TableCell>{request.startDate}</TableCell>
                        <TableCell>{request.endDate}</TableCell>
                        <TableCell className="font-medium">
                          {request.days}
                        </TableCell>
                        <TableCell>{request.reason}</TableCell>
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
