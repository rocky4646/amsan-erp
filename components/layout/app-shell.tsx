"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { SIDEBAR_WIDTH, HEADER_HEIGHT } from "@/lib/constants";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div style={{ marginLeft: SIDEBAR_WIDTH }} className="transition-all duration-300">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
