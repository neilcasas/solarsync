import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { employeeTable, hrPersonnelTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check HR personnel first
    const [hrUser] = await db
      .select()
      .from(hrPersonnelTable)
      .where(eq(hrPersonnelTable.email, email))
      .limit(1);

    if (hrUser) {
      const passwordMatch = await bcrypt.compare(password, hrUser.password);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (hrUser.status === "Locked") {
        return NextResponse.json(
          { error: "Your account has been locked. Contact an administrator." },
          { status: 403 }
        );
      }

      await createSession({
        userId: hrUser.hr_id,
        email: hrUser.email,
        firstName: hrUser.first_name,
        lastName: hrUser.last_name,
        role: "hr",
      });

      return NextResponse.json({
        message: "Login successful",
        user: {
          id: hrUser.hr_id,
          email: hrUser.email,
          firstName: hrUser.first_name,
          lastName: hrUser.last_name,
          role: "hr",
        },
      });
    }

    // Check employee
    const [employee] = await db
      .select()
      .from(employeeTable)
      .where(eq(employeeTable.email, email))
      .limit(1);

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (employee.status === "Locked") {
      return NextResponse.json(
        { error: "Your account has been locked. Contact an administrator." },
        { status: 403 }
      );
    }

    await createSession({
      userId: employee.employee_id,
      email: employee.email,
      firstName: employee.first_name,
      lastName: employee.last_name,
      role: "employee",
    });

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: employee.employee_id,
        email: employee.email,
        firstName: employee.first_name,
        lastName: employee.last_name,
        role: "employee",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
