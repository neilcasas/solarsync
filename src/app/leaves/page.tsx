"use client";

import { useState, useEffect, useCallback } from "react";
import { EmployeeLayout } from "@/components/EmployeeLayout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plane, Plus, Calendar as CalendarIcon } from "lucide-react";

type LeaveRecord = {
  leave_id: string;
  leave_type: string;
  leave_date_from: string;
  leave_date_to: string;
  reason_employee: string | null;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
};

// TODO: Replace with actual employee ID from auth
const EMPLOYEE_ID = "00000000-0000-0000-0000-000000000001";

export default function LeavesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = useCallback(async () => {
    const res = await fetch(`/api/leaves?employeeId=${EMPLOYEE_ID}`);
    const data = await res.json();
    setLeaves(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleSubmitLeave = async () => {
    if (!leaveType || !startDate || !endDate) return;
    
    await fetch("/api/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: EMPLOYEE_ID,
        leave_type: leaveType,
        leave_date_from: startDate.toISOString().split("T")[0],
        leave_date_to: endDate.toISOString().split("T")[0],
        reason_employee: leaveReason,
        remaining_leaves: 15,
      }),
    });
    
    setDialogOpen(false);
    setLeaveType("");
    setLeaveReason("");
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

  const calculateDays = (start: Date | undefined, end: Date | undefined) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const calculateLeaveDays = (from: string, to: string) => {
    const start = new Date(from);
    const end = new Date(to);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalLeaveDays = 15;
  const usedLeaveDays = leaves
    .filter((l) => l.status === "Approved")
    .reduce((sum, l) => sum + calculateLeaveDays(l.leave_date_from, l.leave_date_to), 0);
  const remainingLeaveDays = totalLeaveDays - usedLeaveDays;
  const pendingRequests = leaves.filter((l) => l.status === "Pending").length;

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaves</h1>
            <p className="text-muted-foreground">
              Manage your leave requests and balance
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>
                  Submit a new leave request for approval
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="leave-type" className="text-sm font-medium">
                    Leave Type
                  </label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vacation Leave">
                        Vacation Leave
                      </SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Parental Leave">
                        Parental Leave
                      </SelectItem>
                      <SelectItem value="Bereavement Leave">
                        Bereavement Leave
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      className="rounded-md border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Total Days:{" "}
                    <span className="text-lg font-bold">
                      {calculateDays(startDate, endDate)}
                    </span>
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="leave-reason" className="text-sm font-medium">
                    Reason
                  </label>
                  <Input
                    id="leave-reason"
                    placeholder="Explain the reason for your leave"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitLeave}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Leave Days
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{totalLeaveDays}</div>
              <p className="text-sm text-muted-foreground">Annual allocation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Used Days</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-orange-600">
                {usedLeaveDays}
              </div>
              <p className="text-sm text-muted-foreground">Days taken</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Remaining Days
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-green-600">
                {remainingLeaveDays}
              </div>
              <p className="text-sm text-muted-foreground">Available balance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <Badge variant="secondary">{pendingRequests}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{pendingRequests}</div>
              <p className="text-sm text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave History */}
        <Card>
          <CardHeader>
            <CardTitle>Leave History</CardTitle>
            <CardDescription>Your leave request records</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4 text-muted-foreground">Loading...</p>
            ) : leaves.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No leave records found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((record) => (
                    <TableRow key={record.leave_id}>
                      <TableCell>
                        <Badge variant="outline">{record.leave_type}</Badge>
                      </TableCell>
                      <TableCell>{record.leave_date_from}</TableCell>
                      <TableCell>{record.leave_date_to}</TableCell>
                      <TableCell className="font-medium">
                        {calculateLeaveDays(record.leave_date_from, record.leave_date_to)}
                      </TableCell>
                      <TableCell>{record.reason_employee || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
}
