"use client";

import { useState } from "react";
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
import { Check, X } from "lucide-react";

// Mock data
const employees = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "Clocked In",
    lastClockIn: "09:00 AM",
  },
  { id: 2, name: "Bob Smith", status: "Clocked Out", lastClockIn: "08:45 AM" },
  {
    id: 3,
    name: "Carol Martinez",
    status: "Clocked In",
    lastClockIn: "08:30 AM",
  },
  { id: 4, name: "David Lee", status: "Idle", lastClockIn: "09:15 AM" },
  { id: 5, name: "Emma Wilson", status: "Clocked In", lastClockIn: "09:00 AM" },
];

const pendingRequests = [
  {
    id: 1,
    employeeName: "Alice Johnson",
    type: "Leave",
    date: "2025-11-20",
    reason: "Vacation",
  },
  {
    id: 2,
    employeeName: "Bob Smith",
    type: "Break",
    date: "2025-11-14",
    reason: "Lunch",
  },
  {
    id: 3,
    employeeName: "Carol Martinez",
    type: "Leave",
    date: "2025-11-22",
    reason: "Medical",
  },
  {
    id: 4,
    employeeName: "David Lee",
    type: "Break",
    date: "2025-11-14",
    reason: "Coffee",
  },
];

const inactivityLog = [
  {
    employeeName: "Bob Smith",
    date: "2025-11-13",
    time: "02:30 PM",
    details: "Missed 3-minute prompt",
  },
  {
    employeeName: "David Lee",
    date: "2025-11-13",
    time: "11:45 AM",
    details: "Missed 3-minute prompt",
  },
  {
    employeeName: "Emma Wilson",
    date: "2025-11-12",
    time: "03:15 PM",
    details: "Missed 3-minute prompt",
  },
  {
    employeeName: "Alice Johnson",
    date: "2025-11-11",
    time: "04:00 PM",
    details: "Missed 3-minute prompt",
  },
];

export function HRDashboard() {
  const [requests, setRequests] = useState(pendingRequests);

  const handleApprove = (requestId: number) => {
    setRequests(requests.filter((req) => req.id !== requestId));
    console.log(`Request ${requestId} approved`);
  };

  const handleReject = (requestId: number) => {
    setRequests(requests.filter((req) => req.id !== requestId));
    console.log(`Request ${requestId} rejected`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Clocked In":
        return "default";
      case "Clocked Out":
        return "secondary";
      case "Idle":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Overview Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Dashboard</CardTitle>
          <CardDescription>Real-time overview of all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Clock In</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.lastClockIn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Review and manage employee requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No pending requests
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.employeeName}
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Inactivity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inactivity</CardTitle>
          <CardDescription>Log of missed activity prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactivityLog.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {log.employeeName}
                  </TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.time}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
