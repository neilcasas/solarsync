import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { employeeTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(employeeTable)
      .where(eq(employeeTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert employee
    const [newEmployee] = await db
      .insert(employeeTable)
      .values({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
      })
      .returning();

    // Create session
    await createSession({
      userId: newEmployee.employee_id,
      email: newEmployee.email,
      firstName: newEmployee.first_name,
      lastName: newEmployee.last_name,
      role: "employee",
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newEmployee.employee_id,
          email: newEmployee.email,
          firstName: newEmployee.first_name,
          lastName: newEmployee.last_name,
          role: "employee",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
