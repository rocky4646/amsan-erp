"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, COMPANY_NAME, SIDEBAR_WIDTH } from "@/lib/constants";
import {
  LayoutDashboard, HardHat, ClipboardCheck, Users, ShoppingCart,
  Receipt, Warehouse, Tractor, ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, HardHat, ClipboardCheck, Users, ShoppingCart,
  Receipt, Warehouse, Tractor,
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col"
      style={{ width: collapsed ? 64 : SIDEBAR_WIDTH }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-hover">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold shrink-0">
              A
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold truncate">AMSAN</p>
              <p className="text-[10px] text-muted-foreground truncate">ERP BTP</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold mx-auto">
            A
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-active text-white font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-hover hover:text-sidebar-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-hover">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-hover transition-colors"
        >
          <ChevronLeft className={cn("h-5 w-5 shrink-0 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Réduire</span>}
        </button>
      </div>
    </aside>
  );
}
