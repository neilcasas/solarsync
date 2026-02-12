import { NextRequest, NextResponse } from "next/server";
import {
  getLeavesByUserId,
  createLeave,
  cancelLeave,
} from "@/src/db/queries/leaves";
import { getSession } from "@/lib/auth";

// GET /api/leaves - Get current user's leaves
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leaves = await getLeavesByUserId(session.userId);
  return NextResponse.json(leaves);
}

// POST /api/leaves - Create leave request
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { leave_type, leave_date_from, leave_date_to, reason_employee, remaining_leaves } = body;

  if (!leave_type || !leave_date_from || !leave_date_to) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const leave = await createLeave({
    user_id: session.userId,
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
