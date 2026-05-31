"use client";

import { DollarSign, TrendingUp, TrendingDown, PiggyBank, CreditCard, Wallet } from "lucide-react";
import { StatCard } from "./stat-card";
import { formatMontant } from "@/lib/utils";
import type { KpiDashboard } from "@/types";

interface KpiCardsProps {
  kpis: KpiDashboard | null;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  if (!kpis) return null;

  const beneficeNet = kpis.revenu_total - kpis.depenses_total - kpis.masse_salariale_totale;
  const margeNet = kpis.revenu_total > 0 ? ((beneficeNet / kpis.revenu_total) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Revenu total"
        value={formatMontant(kpis.revenu_total)}
        icon={DollarSign}
        description="Toutes factures confondues"
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        title="Revenu encaissé"
        value={formatMontant(kpis.revenu_encaissé)}
        icon={Wallet}
        description="Factures payées"
      />
      <StatCard
        title="Dépenses totales"
        value={formatMontant(kpis.depenses_total)}
        icon={CreditCard}
        description="TTC"
        trend={{ value: 5, positive: false }}
      />
      <StatCard
        title="Bénéfice net"
        value={formatMontant(Math.max(beneficeNet, 0))}
        icon={PiggyBank}
        description={`Marge nette: ${margeNet.toFixed(1)}%`}
        trend={{ value: Math.abs(margeNet), positive: margeNet > 0 }}
      />
    </div>
  );
}
