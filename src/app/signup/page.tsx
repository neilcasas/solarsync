"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TwoFourteenLogo } from "@/components/TwoFourteenLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      if (data.user.role === "hr" || data.user.role === "admin") {
        router.push("/hr");
      } else {
        router.push("/breaks");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            <TwoFourteenLogo />
            <p className="text-muted-foreground text-sm text-center">
              SolarSync - Time-Tracking and Employee Management Platform
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-500/10 rounded-lg py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-neutral-900 text-white placeholder:text-neutral-500 border-neutral-700"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-neutral-900 text-white placeholder:text-neutral-500 border-neutral-700"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-900 text-white placeholder:text-neutral-500 border-neutral-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="role" className="text-sm font-medium text-foreground">
                Role (Testing)
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-neutral-900 text-white border-neutral-700">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-neutral-900 text-white placeholder:text-neutral-500 border-neutral-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-neutral-900 text-white placeholder:text-neutral-500 border-neutral-700"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C4D600] hover:underline font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
