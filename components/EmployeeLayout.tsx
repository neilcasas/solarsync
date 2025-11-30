"use client";

import { Sidebar } from "@/components/Sidebar";
import { LayoutDashboard, Coffee, Plane } from "lucide-react";

const employeeNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Breaks",
    href: "/breaks",
    icon: Coffee,
  },
  {
    title: "Leaves",
    href: "/leaves",
    icon: Plane,
  },
];

export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <Sidebar navItems={employeeNavItems} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
