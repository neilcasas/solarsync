import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllEmployeeAttendanceToday } from "@/src/db/queries/attendance";
import { getActiveBreak } from "@/src/db/queries/breaks";

function formatWorkingTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== "hr" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getAllEmployeeAttendanceToday();

  const employeeMap = new Map<
    string,
    {
      user_id: string;
      name: string;
      status: "Working" | "On Break" | "Clocked Out";
      clockIn: string;
      workingTime: string;
    }
  >();

  for (const row of rows) {
    if (!employeeMap.has(row.user_id)) {
      const hasActiveAttendance = row.time_in && !row.time_out;
      let status: "Working" | "On Break" | "Clocked Out" = hasActiveAttendance
        ? "Working"
        : "Clocked Out";

      if (hasActiveAttendance) {
        const activeBreak = await getActiveBreak(row.user_id);
        if (activeBreak) status = "On Break";
      }

      const workingSeconds = row.time_in
        ? Math.max(
            0,
            Math.floor((Date.now() - new Date(row.time_in).getTime()) / 1000)
          )
        : 0;

      employeeMap.set(row.user_id, {
        user_id: row.user_id,
        name: `${row.first_name} ${row.last_name}`,
        status,
        clockIn: row.time_in ? new Date(row.time_in).toLocaleTimeString() : "N/A",
        workingTime: row.time_in ? formatWorkingTime(workingSeconds) : "0h 0m",
      });
    }
  }

  const employees = Array.from(employeeMap.values());

  return NextResponse.json({
    employees,
    summary: {
      totalEmployees: employees.length,
      workingEmployees: employees.filter((e) => e.status === "Working").length,
      onBreakEmployees: employees.filter((e) => e.status === "On Break").length,
      clockedOutEmployees: employees.filter((e) => e.status === "Clocked Out").length,
    },
  });
}
