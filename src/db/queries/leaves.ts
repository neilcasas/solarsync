import { db } from "@/src/db";
import { leaveRequestTable, usersTable } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export type LeaveInsert = typeof leaveRequestTable.$inferInsert;
export type LeaveSelect = typeof leaveRequestTable.$inferSelect;

// Get all leave requests (for HR)
export async function getAllLeaveRequests() {
  return db
    .select({
      leave_id: leaveRequestTable.leave_id,
      user_id: leaveRequestTable.user_id,
      employeeName: usersTable.first_name,
      employeeLastName: usersTable.last_name,
      leave_type: leaveRequestTable.leave_type,
      leave_date_from: leaveRequestTable.leave_date_from,
      leave_date_to: leaveRequestTable.leave_date_to,
      reason_employee: leaveRequestTable.reason_employee,
      reason_hr: leaveRequestTable.reason_hr,
      status: leaveRequestTable.status,
      remaining_leaves: leaveRequestTable.remaining_leaves,
      decision_timestamp: leaveRequestTable.decision_timestamp,
    })
    .from(leaveRequestTable)
    .leftJoin(usersTable, eq(leaveRequestTable.user_id, usersTable.user_id))
    .orderBy(desc(leaveRequestTable.leave_date_from));
}

// Get leave requests by user ID
export async function getLeavesByUserId(userId: string) {
  return db
    .select()
    .from(leaveRequestTable)
    .where(eq(leaveRequestTable.user_id, userId))
    .orderBy(desc(leaveRequestTable.leave_date_from));
}

// Get a single leave request by ID
export async function getLeaveById(leaveId: string) {
  const result = await db
    .select()
    .from(leaveRequestTable)
    .where(eq(leaveRequestTable.leave_id, leaveId))
    .limit(1);
  return result[0] ?? null;
}

// Create a new leave request
export async function createLeave(data: LeaveInsert) {
  const result = await db.insert(leaveRequestTable).values(data).returning();
  return result[0];
}

// Update leave request (for HR approval/rejection)
export async function updateLeave(
  leaveId: string,
  data: Partial<LeaveInsert>
) {
  const result = await db
    .update(leaveRequestTable)
    .set(data)
    .where(eq(leaveRequestTable.leave_id, leaveId))
    .returning();
  return result[0];
}

// Delete leave request
export async function deleteLeave(leaveId: string) {
  const result = await db
    .delete(leaveRequestTable)
    .where(eq(leaveRequestTable.leave_id, leaveId))
    .returning();
  return result[0];
}

// Cancel leave request (employee action)
export async function cancelLeave(leaveId: string) {
  return updateLeave(leaveId, { status: "Cancelled" });
}

// Approve leave request (HR action)
export async function approveLeave(leaveId: string, decidedBy: string, reasonHr?: string) {
  return updateLeave(leaveId, {
    status: "Approved",
    decided_by: decidedBy,
    reason_hr: reasonHr,
    decision_timestamp: new Date(),
  });
}

// Reject leave request (HR action)
export async function rejectLeave(leaveId: string, decidedBy: string, reasonHr?: string) {
  return updateLeave(leaveId, {
    status: "Rejected",
    decided_by: decidedBy,
    reason_hr: reasonHr,
    decision_timestamp: new Date(),
  });
}
