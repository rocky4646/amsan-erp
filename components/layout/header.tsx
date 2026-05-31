"use client";

import { Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_NAME } from "@/lib/constants";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/chantiers": "Chantiers",
  "/pointage": "Pointage & RH",
  "/employes": "Employés",
  "/depenses": "Achats & Dépenses",
  "/facturation": "Facturation",
  "/stock": "Gestion des stocks",
  "/materiel": "Matériel & Engins",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "AMSAN ERP";

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">Admin</span>
        </Button>
      </div>
    </header>
  );
}
