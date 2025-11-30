"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TwoFourteenLogo } from "./TwoFourteenLogo";
import { cn } from "@/lib/utils";
import { LucideIcon, Settings } from "lucide-react";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: SidebarNavItem[];
}

export function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();

  // Determine if we're in HR route
  const isHRRoute = pathname.startsWith("/hr");
  const profileName = isHRRoute ? "Sara Macalintal" : "John Serrano";
  const profilePosition = isHRRoute ? "HR Officer" : "Software Engineer";
  const profileInitials = isHRRoute ? "SJ" : "JD";

  // Mock status - you can replace this with actual state management
  const status = isHRRoute ? "Working" : "Working"; // or "On Break"
  const statusColor = status === "Working" ? "bg-green-500" : "bg-orange-500";

  return (
    <div className="flex flex-col h-screen w-64 bg-[#333333] border-r border-[#444444]">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#444444]">
        <TwoFourteenLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-[#C4D600] text-[#1a1a1a]"
                      : "text-gray-300 hover:bg-[#444444] hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="p-4 border-t border-[#444444]">
        {/* Settings Link */}
        <button className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-gray-300 hover:bg-[#444444] hover:text-white transition-colors mb-3">
          <Settings className="h-5 w-5" />
          <span className="font-medium">Settings</span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#444444] rounded-lg">
          <div className="w-10 h-10 rounded-full bg-[#C4D600] flex items-center justify-center text-[#1a1a1a] font-bold text-lg">
            {profileInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profileName}
            </p>
            <p className="text-xs text-gray-400 truncate">{profilePosition}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
