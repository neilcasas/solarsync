import { NextRequest, NextResponse } from "next/server";
import {
  getAllLeaveRequests,
  approveLeave,
  rejectLeave,
  deleteLeave,
} from "@/src/db/queries/leaves";

// GET /api/hr/leaves - Get all leave requests
export async function GET() {
  const leaves = await getAllLeaveRequests();
  return NextResponse.json(leaves);
}

// PATCH /api/hr/leaves - Approve/Reject leave
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { leave_id, action, hr_id, reason_hr } = body;

  if (!leave_id || !action || !hr_id) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let leave;
  if (action === "approve") {
    leave = await approveLeave(leave_id, hr_id, reason_hr);
  } else if (action === "reject") {
    leave = await rejectLeave(leave_id, hr_id, reason_hr);
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json(leave);
}

// DELETE /api/hr/leaves - Delete leave request
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { leave_id } = body;

  if (!leave_id) {
    return NextResponse.json({ error: "leave_id required" }, { status: 400 });
  }

  const leave = await deleteLeave(leave_id);
  return NextResponse.json(leave);
}
