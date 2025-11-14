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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { LogIn, LogOut, AlertTriangle, Coffee, Plane } from "lucide-react";

// Mock data
const attendanceHistory = [
  {
    date: "2025-11-13",
    clockIn: "09:00 AM",
    clockOut: "05:30 PM",
    totalHours: "8.5",
  },
  {
    date: "2025-11-12",
    clockIn: "08:45 AM",
    clockOut: "05:15 PM",
    totalHours: "8.5",
  },
  {
    date: "2025-11-11",
    clockIn: "09:15 AM",
    clockOut: "05:45 PM",
    totalHours: "8.5",
  },
  {
    date: "2025-11-08",
    clockIn: "09:00 AM",
    clockOut: "05:00 PM",
    totalHours: "8.0",
  },
];

const requestHistory = [
  { date: "2025-11-10", type: "Break", reason: "Lunch", status: "Approved" },
  { date: "2025-11-05", type: "Leave", reason: "Personal", status: "Approved" },
  { date: "2025-11-01", type: "Break", reason: "Coffee", status: "Pending" },
  { date: "2025-10-25", type: "Leave", reason: "Vacation", status: "Rejected" },
];

export function EmployeeDashboard() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [breakDialogOpen, setBreakDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState<Date | undefined>(new Date());
  const [leaveReason, setLeaveReason] = useState("");
  const [breakReason, setBreakReason] = useState("");

  const handleClockToggle = () => {
    setIsClockedIn(!isClockedIn);
  };

  const handleBreakRequest = () => {
    console.log("Break request submitted:", breakReason);
    setBreakDialogOpen(false);
    setBreakReason("");
  };

  const handleLeaveRequest = () => {
    console.log("Leave request submitted:", {
      date: leaveDate,
      reason: leaveReason,
    });
    setLeaveDialogOpen(false);
    setLeaveReason("");
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

  return (
    <div className="space-y-6">
      {/* Attendance Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Attendance</CardTitle>
          <CardDescription>Track your work hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <Badge
                variant={isClockedIn ? "default" : "secondary"}
                className="mt-1"
              >
                {isClockedIn ? "Clocked In" : "Clocked Out"}
              </Badge>
            </div>
            <Button onClick={handleClockToggle} size="lg">
              {isClockedIn ? (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Clock Out
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Clock In
                </>
              )}
            </Button>
          </div>

          {/* Inactivity Prompt Trigger */}
          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Trigger Inactivity Prompt
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you still active?</AlertDialogTitle>
                  <AlertDialogDescription>
                    We haven&apos;t detected any activity for a while. Please
                    confirm you&apos;re still working.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Confirm Activity</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Requests Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>Submit break and leave requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Dialog open={breakDialogOpen} onOpenChange={setBreakDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Coffee className="mr-2 h-4 w-4" />
                Request Break
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Break</DialogTitle>
                <DialogDescription>Submit a break request</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="break-reason" className="text-sm font-medium">
                    Reason
                  </label>
                  <Input
                    id="break-reason"
                    placeholder="e.g., Lunch, Coffee"
                    value={breakReason}
                    onChange={(e) => setBreakReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleBreakRequest}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Plane className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
                <DialogDescription>Submit a leave request</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={leaveDate}
                    onSelect={setLeaveDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="leave-reason" className="text-sm font-medium">
                    Reason
                  </label>
                  <Input
                    id="leave-reason"
                    placeholder="e.g., Personal, Vacation, Medical"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleLeaveRequest}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* History Tables */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>
            View your attendance and request history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="attendance">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="attendance">Attendance History</TabsTrigger>
              <TabsTrigger value="requests">Request History</TabsTrigger>
            </TabsList>
            <TabsContent value="attendance">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.clockIn}</TableCell>
                      <TableCell>{record.clockOut}</TableCell>
                      <TableCell>{record.totalHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="requests">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestHistory.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{request.date}</TableCell>
                      <TableCell>{request.type}</TableCell>
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
  );
}
