import { db } from "@/src/db";
import { attendanceLogTable, usersTable } from "@/src/db/schema";
import { eq, desc, and, isNull, sql } from "drizzle-orm";

export type AttendanceInsert = typeof attendanceLogTable.$inferInsert;
export type AttendanceSelect = typeof attendanceLogTable.$inferSelect;

export async function getAttendanceByUserId(userId: string) {
  return db
    .select()
    .from(attendanceLogTable)
    .where(eq(attendanceLogTable.user_id, userId))
    .orderBy(desc(attendanceLogTable.time_in));
}

export async function getTodayAttendanceByUserId(userId: string) {
  return db
    .select()
    .from(attendanceLogTable)
    .where(
      and(
        eq(attendanceLogTable.user_id, userId),
        sql`DATE(${attendanceLogTable.time_in}) = CURRENT_DATE`
      )
    )
    .orderBy(desc(attendanceLogTable.time_in));
}

export async function getActiveAttendance(userId: string) {
  const result = await db
    .select()
    .from(attendanceLogTable)
    .where(
      and(
        eq(attendanceLogTable.user_id, userId),
        isNull(attendanceLogTable.time_out)
      )
    )
    .limit(1);

  return result[0] ?? null;
}

export async function clockIn(userId: string) {
  const result = await db
    .insert(attendanceLogTable)
    .values({
      user_id: userId,
      time_in: new Date(),
    })
    .returning();

  return result[0];
}

export async function clockOut(attendanceId: string) {
  const attendance = await getAttendanceById(attendanceId);
  if (!attendance || !attendance.time_in) {
    return null;
  }

  const now = new Date();
  const start = new Date(attendance.time_in);
  const durationSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);

  const result = await db
    .update(attendanceLogTable)
    .set({
      time_out: now,
      total_hours: `${durationSeconds} seconds`,
    })
    .where(eq(attendanceLogTable.attendance_id, attendanceId))
    .returning();

  return result[0] ?? null;
}

export async function getAttendanceById(attendanceId: string) {
  const result = await db
    .select()
    .from(attendanceLogTable)
    .where(eq(attendanceLogTable.attendance_id, attendanceId))
    .limit(1);

  return result[0] ?? null;
}

export async function deleteAttendance(attendanceId: string) {
  const result = await db
    .delete(attendanceLogTable)
    .where(eq(attendanceLogTable.attendance_id, attendanceId))
    .returning();

  return result[0] ?? null;
}

export async function getAllEmployeeAttendanceToday() {
  return db
    .select({
      user_id: usersTable.user_id,
      first_name: usersTable.first_name,
      last_name: usersTable.last_name,
      attendance_id: attendanceLogTable.attendance_id,
      time_in: attendanceLogTable.time_in,
      time_out: attendanceLogTable.time_out,
      total_hours: attendanceLogTable.total_hours,
    })
    .from(usersTable)
    .leftJoin(attendanceLogTable, eq(usersTable.user_id, attendanceLogTable.user_id))
    .where(eq(usersTable.role, "employee"))
    .orderBy(desc(attendanceLogTable.time_in));
}
