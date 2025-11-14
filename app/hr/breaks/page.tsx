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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Coffee, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

// Mock employee break data
const employeeBreaks = [
  {
    id: 1,
    name: "Alice Johnson",
    breaksTaken: 2,
    totalBreakTime: 30,
    lastBreak: "11:30 AM",
    status: "Completed",
    hasTakenBreak: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    breaksTaken: 1,
    totalBreakTime: 15,
    lastBreak: "10:45 AM",
    status: "On Break",
    hasTakenBreak: true,
  },
  {
    id: 3,
    name: "Carol Martinez",
    breaksTaken: 3,
    totalBreakTime: 45,
    lastBreak: "02:15 PM",
    status: "Completed",
    hasTakenBreak: true,
  },
  {
    id: 4,
    name: "David Lee",
    breaksTaken: 0,
    totalBreakTime: 0,
    lastBreak: "N/A",
    status: "No Break",
    hasTakenBreak: false,
  },
  {
    id: 5,
    name: "Emma Wilson",
    breaksTaken: 2,
    totalBreakTime: 30,
    lastBreak: "01:00 PM",
    status: "Completed",
    hasTakenBreak: true,
  },
  {
    id: 6,
    name: "Frank Brown",
    breaksTaken: 1,
    totalBreakTime: 15,
    lastBreak: "11:00 AM",
    status: "Completed",
    hasTakenBreak: true,
  },
  {
    id: 7,
    name: "Grace Chen",
    breaksTaken: 0,
    totalBreakTime: 0,
    lastBreak: "N/A",
    status: "No Break",
    hasTakenBreak: false,
  },
  {
    id: 8,
    name: "Henry Davis",
    breaksTaken: 2,
    totalBreakTime: 30,
    lastBreak: "12:30 PM",
    status: "Completed",
    hasTakenBreak: true,
  },
];

// Break type distribution
const breakTypeStats = [
  { type: "Coffee Break", count: 8, totalMinutes: 120, avgDuration: 15 },
  { type: "Lunch Break", count: 6, totalMinutes: 360, avgDuration: 60 },
  { type: "Short Break", count: 3, totalMinutes: 15, avgDuration: 5 },
];

export default function HRBreaksPage() {
  const [employees] = useState(employeeBreaks);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "On Break":
        return "secondary";
      case "No Break":
        return "destructive";
      default:
        return "default";
    }
  };

  const totalEmployees = employees.length;
  const employeesWithBreaks = employees.filter((e) => e.hasTakenBreak).length;
  const employeesWithoutBreaks = employees.filter(
    (e) => !e.hasTakenBreak
  ).length;
  const totalBreaks = employees.reduce((sum, e) => sum + e.breaksTaken, 0);
  const avgBreakTime = Math.round(
    employees.reduce((sum, e) => sum + e.totalBreakTime, 0) / totalEmployees
  );

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Break Analytics</h1>
          <p className="text-muted-foreground">
            Monitor employee break patterns and compliance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Breaks
              </CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBreaks}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Break Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgBreakTime} min</div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taken Breaks
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {employeesWithBreaks}
              </div>
              <p className="text-xs text-muted-foreground">Employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Breaks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {employeesWithoutBreaks}
              </div>
              <p className="text-xs text-muted-foreground">Employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((employeesWithBreaks / totalEmployees) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Break compliance</p>
            </CardContent>
          </Card>
        </div>

        {/* Break Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Break Type Distribution</CardTitle>
            <CardDescription>
              Breakdown of break types taken today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Break Type</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Total Minutes</TableHead>
                  <TableHead>Avg Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakTypeStats.map((stat, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4 text-orange-600" />
                        {stat.type}
                      </div>
                    </TableCell>
                    <TableCell>{stat.count}</TableCell>
                    <TableCell>{stat.totalMinutes} min</TableCell>
                    <TableCell>{stat.avgDuration} min</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Employee Break Status */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Break Status</CardTitle>
            <CardDescription>
              Individual break records for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Breaks Taken</TableHead>
                  <TableHead>Total Break Time</TableHead>
                  <TableHead>Last Break</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.breaksTaken}</TableCell>
                    <TableCell>{employee.totalBreakTime} min</TableCell>
                    <TableCell>{employee.lastBreak}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alerts */}
        {employeesWithoutBreaks > 0 && (
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900 dark:text-red-100">
                  Break Compliance Alert
                </CardTitle>
              </div>
              <CardDescription className="text-red-700 dark:text-red-300">
                {employeesWithoutBreaks} employee
                {employeesWithoutBreaks > 1 ? "s have" : " has"} not taken any
                breaks today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {employees
                  .filter((e) => !e.hasTakenBreak)
                  .map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 rounded"
                    >
                      <span className="font-medium">{employee.name}</span>
                      <Badge variant="destructive">No breaks taken</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </HRLayout>
  );
}
