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
import { Coffee, Play, Pause, Clock } from "lucide-react";

type BreakRecord = {
  break_id: string;
  user_id: string;
  break_type: string;
  break_start: string | null;
  break_end: string | null;
  break_duration: string | null;
  remaining_break: string | null;
};

const breakTypes = [
  { id: 1, name: "Morning Break", duration: 15, color: "bg-orange-500" },
  { id: 2, name: "Lunch Break", duration: 30, color: "bg-green-500" },
  { id: 3, name: "Afternoon Break", duration: 15, color: "bg-blue-500" },
];

function parseDurationToMinutes(duration: string | null): number {
  if (!duration) return 0;
  // Postgres interval can be like "900 seconds" or "00:15:00"
  const secMatch = duration.match(/^(\d+)\s*seconds?$/i);
  if (secMatch) return Math.floor(parseInt(secMatch[1]) / 60);
  const hmsMatch = duration.match(/^(\d+):(\d+):(\d+)$/);
  if (hmsMatch) return parseInt(hmsMatch[1]) * 60 + parseInt(hmsMatch[2]);
  return 0;
}

function formatDuration(duration: string | null): string {
  const mins = parseDurationToMinutes(duration);
  if (mins < 1) {
    // Show seconds for very short breaks
    if (!duration) return "0 min";
    const secMatch = duration.match(/^(\d+)\s*seconds?$/i);
    if (secMatch) return `${secMatch[1]} sec`;
    return "0 min";
  }
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  if (hours > 0) return `${hours}h ${remainMins}m`;
  return `${remainMins} min`;
}

export default function BreaksPage() {
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [currentBreakType, setCurrentBreakType] = useState("");
  const [activeBreakId, setActiveBreakId] = useState<string | null>(null);
  const [todayBreaks, setTodayBreaks] = useState<BreakRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBreaks = useCallback(async () => {
    try {
      const res = await fetch("/api/breaks");
      if (!res.ok) return;
      const data = await res.json();
      setTodayBreaks(data.todayBreaks);

      if (data.activeBreak) {
        setIsOnBreak(true);
        setActiveBreakId(data.activeBreak.break_id);
        setCurrentBreakType(data.activeBreak.break_type);
        const start = new Date(data.activeBreak.break_start);
        setBreakStartTime(start);
        setBreakTimer(Math.floor((Date.now() - start.getTime()) / 1000));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBreaks();
  }, [fetchBreaks]);

  // Timer tick
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

  const handleStartBreak = async (breakName: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/breaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ break_type: breakName }),
      });
      if (!res.ok) return;
      const data = await res.json();

      setIsOnBreak(true);
      setActiveBreakId(data.break_id);
      setBreakStartTime(new Date(data.break_start));
      setCurrentBreakType(data.break_type);
      setBreakTimer(0);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndBreak = async () => {
    if (!activeBreakId) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/breaks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ break_id: activeBreakId }),
      });
      if (!res.ok) return;

      setIsOnBreak(false);
      setBreakTimer(0);
      setBreakStartTime(null);
      setCurrentBreakType("");
      setActiveBreakId(null);
      fetchBreaks();
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const completedBreaks = todayBreaks.filter((b) => b.break_end !== null);
  const breaksToday = completedBreaks.length;
  const totalBreakTime = completedBreaks.reduce(
    (sum, b) => sum + parseDurationToMinutes(b.break_duration),
    0
  );

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </EmployeeLayout>
    );
  }

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
                disabled={actionLoading}
              >
                <Pause className="mr-2 h-5 w-5" />
                {actionLoading ? "Ending..." : "End Break"}
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
                        disabled={actionLoading}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {actionLoading ? "Starting..." : "Start Break"}
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
            <CardTitle>Today&apos;s Break History</CardTitle>
            <CardDescription>Your break records for today</CardDescription>
          </CardHeader>
          <CardContent>
            {completedBreaks.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                No breaks taken today
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedBreaks.map((record) => (
                    <TableRow key={record.break_id}>
                      <TableCell>
                        <Badge variant="outline">{record.break_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {record.break_start
                          ? new Date(record.break_start).toLocaleTimeString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {record.break_end
                          ? new Date(record.break_end).toLocaleTimeString()
                          : "-"}
                      </TableCell>
                      <TableCell>{formatDuration(record.break_duration)}</TableCell>
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
