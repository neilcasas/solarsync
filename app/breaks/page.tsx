"use client";

import { useState, useEffect } from "react";
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
import { Coffee, Play, Pause, Clock } from "lucide-react";

// Mock data for break types
const breakTypes = [
  { id: 1, name: "Morning Break", duration: 15, color: "bg-orange-500" },
  { id: 2, name: "Lunch Break", duration: 30, color: "bg-green-500" },
  { id: 3, name: "Afternoon Break", duration: 15, color: "bg-blue-500" },
];

// Mock break history
const breakHistory = [
  {
    id: 1,
    type: "Coffee Break",
    startTime: "10:30 AM",
    endTime: "10:45 AM",
    duration: "15 min",
    date: "Nov 14, 2025",
  },
  {
    id: 2,
    type: "Lunch Break",
    startTime: "12:00 PM",
    endTime: "01:00 PM",
    duration: "60 min",
    date: "Nov 14, 2025",
  },
  {
    id: 3,
    type: "Coffee Break",
    startTime: "03:15 PM",
    endTime: "03:30 PM",
    duration: "15 min",
    date: "Nov 13, 2025",
  },
  {
    id: 4,
    type: "Lunch Break",
    startTime: "12:30 PM",
    endTime: "01:30 PM",
    duration: "60 min",
    date: "Nov 13, 2025",
  },
];

export default function BreaksPage() {
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [currentBreakType, setCurrentBreakType] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnBreak && breakStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor(
          (now.getTime() - breakStartTime.getTime()) / 1000
        );
        setBreakTimer(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);

  const handleStartBreak = (breakName: string) => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
    setCurrentBreakType(breakName);
  };

  const handleEndBreak = () => {
    setIsOnBreak(false);
    setBreakTimer(0);
    setBreakStartTime(null);
    setCurrentBreakType("");
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const breaksToday = 2;
  const totalBreakTime = 75; // in minutes

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#c4d600]">
            Breaks
          </h1>
          <p className="text-muted-foreground">
            Manage and track your break time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Breaks Today
              </CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-orange-600">
                {breaksToday}
              </div>
              <p className="text-sm text-muted-foreground">
                Total breaks taken
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Break Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{totalBreakTime} min</div>
              <p className="text-sm text-muted-foreground">
                Time on break today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Badge variant={isOnBreak ? "default" : "secondary"}>
                {isOnBreak ? "On Break" : "Working"}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">
                {isOnBreak ? formatTime(breakTimer) : "--:--"}
              </div>
              <p className="text-sm text-muted-foreground">
                {isOnBreak ? currentBreakType : "Not on break"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Break Timer */}
        {isOnBreak && (
          <Card className="border-orange-500">
            <CardHeader>
              <CardTitle>Current Break - {currentBreakType}</CardTitle>
              <CardDescription>
                Break started at {breakStartTime?.toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-orange-600">
                  {formatTime(breakTimer)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Break duration
                </p>
              </div>
              <Button
                onClick={handleEndBreak}
                size="lg"
                className="w-full"
                variant="destructive"
              >
                <Pause className="mr-2 h-5 w-5" />
                End Break
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Break Types */}
        {!isOnBreak && (
          <Card>
            <CardHeader>
              <CardTitle>Start a Break</CardTitle>
              <CardDescription>
                Choose a break type to begin your timer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {breakTypes.map((breakType) => (
                  <Card
                    key={breakType.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg ${breakType.color} flex items-center justify-center mb-2`}
                      >
                        <Coffee className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {breakType.name}
                      </CardTitle>
                      <CardDescription>
                        {breakType.duration} minutes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => handleStartBreak(breakType.name)}
                        className="w-full"
                        variant="outline"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Break
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Break History */}
        <Card>
          <CardHeader>
            <CardTitle>Break History</CardTitle>
            <CardDescription>Your recent break records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {breakHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.type}</Badge>
                    </TableCell>
                    <TableCell>{record.startTime}</TableCell>
                    <TableCell>{record.endTime}</TableCell>
                    <TableCell>{record.duration}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
}
