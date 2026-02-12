import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, role } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user
    const [newUser] = await db
      .insert(usersTable)
      .values({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        role: role || "employee",
      })
      .returning();

    // Create session
    await createSession({
      userId: newUser.user_id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      role: newUser.role,
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: newUser.user_id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
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
