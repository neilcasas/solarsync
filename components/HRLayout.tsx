"use client";

import { Sidebar } from "@/components/Sidebar";
import { LayoutDashboard, Coffee, Plane } from "lucide-react";

const hrNavItems = [
  {
    title: "Dashboard",
    href: "/hr",
    icon: LayoutDashboard,
  },
  {
    title: "Breaks",
    href: "/hr/breaks",
    icon: Coffee,
  },
  {
    title: "Leaves",
    href: "/hr/leaves",
    icon: Plane,
  },
];

export function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#1a1a1a]">
      <Sidebar navItems={hrNavItems} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
