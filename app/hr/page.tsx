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
import { Input } from "@/components/ui/input";
import { Search, Users, Clock, Coffee, Filter, Send } from "lucide-react";

// Mock employee data
const employeesData = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "Working",
    client: "Acme Corp",
    clockIn: "09:00 AM",
    workingTime: "3h 45m",
  },
  {
    id: 2,
    name: "Bob Smith",
    status: "On Break",
    client: "TechStart Inc",
    clockIn: "08:45 AM",
    workingTime: "4h 0m",
  },
  {
    id: 3,
    name: "Carol Martinez",
    status: "Working",
    client: "Global Systems",
    clockIn: "08:30 AM",
    workingTime: "4h 15m",
  },
  {
    id: 4,
    name: "David Lee",
    status: "Clocked Out",
    client: "N/A",
    clockIn: "N/A",
    workingTime: "0h 0m",
  },
  {
    id: 5,
    name: "Emma Wilson",
    status: "Working",
    client: "InnovateCo",
    clockIn: "09:00 AM",
    workingTime: "3h 45m",
  },
  {
    id: 6,
    name: "Frank Brown",
    status: "Working",
    client: "Digital Solutions",
    clockIn: "08:15 AM",
    workingTime: "4h 30m",
  },
  {
    id: 7,
    name: "Grace Chen",
    status: "On Break",
    client: "Acme Corp",
    clockIn: "09:15 AM",
    workingTime: "3h 30m",
  },
  {
    id: 8,
    name: "Henry Davis",
    status: "Working",
    client: "TechStart Inc",
    clockIn: "08:45 AM",
    workingTime: "4h 0m",
  },
];

export default function HRPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees] = useState(employeesData);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Working":
        return "default";
      case "On Break":
        return "secondary";
      case "Clocked Out":
        return "destructive";
      default:
        return "default";
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEmployees = employees.length;
  const workingEmployees = employees.filter(
    (e) => e.status === "Working"
  ).length;
  const onBreakEmployees = employees.filter(
    (e) => e.status === "On Break"
  ).length;
  const clockedOutEmployees = employees.filter(
    (e) => e.status === "Clocked Out"
  ).length;

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Time Logs & Attendance
          </h1>
          <p className="text-muted-foreground">
            Monitor employee work hours and attendance in real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">All employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Currently Working
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {workingEmployees}
              </div>
              <p className="text-xs text-muted-foreground">Active now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Break</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {onBreakEmployees}
              </div>
              <p className="text-xs text-muted-foreground">Taking a break</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clocked Out</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {clockedOutEmployees}
              </div>
              <p className="text-xs text-muted-foreground">Not working</p>
            </CardContent>
          </Card>
        </div>

        {/* Employee Records Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Employee Records ({filteredEmployees.length})
                </CardTitle>
                <CardDescription>
                  Track all employee attendance and work hours
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Spot Check
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name, client, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Working Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.client}</TableCell>
                    <TableCell>{employee.clockIn}</TableCell>
                    <TableCell className="font-medium">
                      {employee.workingTime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
}
