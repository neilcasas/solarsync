import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getTodayAttendanceByUserId,
  getActiveAttendance,
  getAttendanceById,
  clockIn,
  clockOut,
} from "@/src/db/queries/attendance";

function parseIntervalToSeconds(interval: string | null): number {
  if (!interval) return 0;

  const secondsMatch = interval.match(/^(\d+)\s*seconds?$/i);
  if (secondsMatch) return parseInt(secondsMatch[1], 10);

  const hmsMatch = interval.match(/^(\d+):(\d+):(\d+)$/);
  if (hmsMatch) {
    return (
      parseInt(hmsMatch[1], 10) * 3600 +
      parseInt(hmsMatch[2], 10) * 60 +
      parseInt(hmsMatch[3], 10)
    );
  }

  return 0;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [todayLogs, activeLog] = await Promise.all([
    getTodayAttendanceByUserId(session.userId),
    getActiveAttendance(session.userId),
  ]);

  const completedLogs = todayLogs.filter((log) => log.time_out !== null);
  const totalWorkedSeconds = completedLogs.reduce(
    (sum, log) => sum + parseIntervalToSeconds(log.total_hours),
    0
  );

  return NextResponse.json({
    todayLogs,
    activeLog,
    totalWorkedSeconds,
  });
}

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const activeLog = await getActiveAttendance(session.userId);
  if (activeLog) {
    return NextResponse.json(
      { error: "You are already clocked in" },
      { status: 400 }
    );
  }

  const log = await clockIn(session.userId);
  return NextResponse.json(log, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { attendance_id } = body;

  if (!attendance_id) {
    return NextResponse.json(
      { error: "attendance_id is required" },
      { status: 400 }
    );
  }

  const attendance = await getAttendanceById(attendance_id);
  if (!attendance || attendance.user_id !== session.userId) {
    return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
  }

  const updated = await clockOut(attendance_id);
  if (!updated) {
    return NextResponse.json({ error: "Attendance not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}
