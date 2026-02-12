import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getTodayBreaksByUserId,
  getActiveBreak,
  startBreak,
  endBreak,
} from "@/src/db/queries/breaks";

// GET /api/breaks - Get today's breaks and active break for the current user
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [todayBreaks, activeBreak] = await Promise.all([
    getTodayBreaksByUserId(session.userId),
    getActiveBreak(session.userId),
  ]);

  return NextResponse.json({ todayBreaks, activeBreak });
}

// POST /api/breaks - Start a new break
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user already has an active break
  const activeBreak = await getActiveBreak(session.userId);
  if (activeBreak) {
    return NextResponse.json(
      { error: "You already have an active break" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { break_type } = body;

  if (!break_type) {
    return NextResponse.json(
      { error: "break_type is required" },
      { status: 400 }
    );
  }

  const breakRecord = await startBreak(session.userId, break_type);
  return NextResponse.json(breakRecord, { status: 201 });
}

// PATCH /api/breaks - End the active break
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { break_id } = body;

  if (!break_id) {
    return NextResponse.json(
      { error: "break_id is required" },
      { status: 400 }
    );
  }

  const breakRecord = await endBreak(break_id);
  if (!breakRecord) {
    return NextResponse.json(
      { error: "Break not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(breakRecord);
}
