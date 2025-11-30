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
import { LogIn, LogOut, Clock, Coffee, Plane } from "lucide-react";

export default function Home() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [workingTime, setWorkingTime] = useState(0);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);

  // Update working time every second when clocked in
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isClockedIn && clockInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - clockInTime.getTime()) / 1000);
        setWorkingTime(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date());
    } else {
      setIsClockedIn(false);
      setWorkingTime(0);
      setClockInTime(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Mock data
  const breaksToday = 2;
  const breaksRemaining = 1;
  const leavesTaken = 5;
  const leavesRemaining = 10;

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Track your work hours and manage your time.
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Visits / Working Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <h1
                className={`text-3xl font-bold ${
                  isClockedIn ? "text-[#C4D600]" : "text-red-600"
                }`}
              >
                {isClockedIn ? "Working" : "Clocked Out"}
              </h1>
            </CardContent>
          </Card>

          {/* Currently Working Time */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Working Time Today
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">
                {formatTime(workingTime)}
              </div>
              <p className="text-sm text-muted-foreground">
                {isClockedIn ? "Currently active" : "Not clocked in"}
              </p>
            </CardContent>
          </Card>

          {/* Breaks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Breaks</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-orange-600">
                {breaksToday}
              </div>
              <p className="text-sm text-muted-foreground">
                {breaksRemaining} remaining today
              </p>
            </CardContent>
          </Card>

          {/* Leaves */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Leave Balance
              </CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-green-600">
                {leavesRemaining}
              </div>
              <p className="text-sm text-muted-foreground">
                {leavesTaken} days used this year
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Clock In/Out Card */}
        <Card>
          <CardHeader>
            <CardTitle>Time Clock</CardTitle>
            <CardDescription>Track your work hours for the day</CardDescription>
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
                {isClockedIn && clockInTime && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Clocked in at {clockInTime.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Working Time</p>
                <p className="text-3xl font-bold mt-1">
                  {formatTime(workingTime)}
                </p>
              </div>
            </div>

            <Button
              onClick={handleClockToggle}
              size="lg"
              className="w-full"
              variant={isClockedIn ? "destructive" : "default"}
            >
              {isClockedIn ? (
                <>
                  <LogOut className="mr-2 h-5 w-5" />
                  Clock Out
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Clock In
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Break</CardTitle>
              <CardDescription>Start your break timer</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                variant="outline"
                disabled={!isClockedIn}
              >
                <Coffee className="mr-2 h-4 w-4" />
                Start Break
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {isClockedIn
                  ? "Click to start your break"
                  : "Clock in first to take a break"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave Request</CardTitle>
              <CardDescription>Request time off</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                <Plane className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Submit a new leave request
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployeeLayout>
  );
}
