import { NextRequest, NextResponse } from "next/server";
import {
  getLeavesByEmployeeId,
  createLeave,
  cancelLeave,
} from "@/src/db/queries/leaves";

// GET /api/leaves?employeeId=xxx - Get employee's leaves
export async function GET(req: NextRequest) {
  const employeeId = req.nextUrl.searchParams.get("employeeId");
  if (!employeeId) {
    return NextResponse.json({ error: "employeeId required" }, { status: 400 });
  }
  const leaves = await getLeavesByEmployeeId(employeeId);
  return NextResponse.json(leaves);
}

// POST /api/leaves - Create leave request
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { employee_id, leave_type, leave_date_from, leave_date_to, reason_employee, remaining_leaves } = body;

  if (!employee_id || !leave_type || !leave_date_from || !leave_date_to) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const leave = await createLeave({
    employee_id,
    leave_type,
    leave_date_from,
    leave_date_to,
    reason_employee,
    remaining_leaves: remaining_leaves ?? 15,
    status: "Pending",
  });
  return NextResponse.json(leave, { status: 201 });
}

// PATCH /api/leaves - Cancel leave request
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { leave_id, action } = body;

  if (!leave_id || action !== "cancel") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const leave = await cancelLeave(leave_id);
  return NextResponse.json(leave);
}
