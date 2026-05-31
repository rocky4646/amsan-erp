import { AppShell } from "@/components/layout/app-shell";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { MargeChart } from "@/components/dashboard/marge-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import {
  getKpiDashboard,
  getBudgetChantiers,
  getDepenses,
  getFactures,
} from "@/lib/supabase/queries";

export default async function DashboardPage() {
  const [kpis, budgetData, depenses, factures] = await Promise.all([
    getKpiDashboard(),
    getBudgetChantiers(),
    getDepenses(),
    getFactures(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <KpiCards kpis={kpis} />

        <div className="grid gap-6 lg:grid-cols-2">
          <BudgetChart data={budgetData} />
          <MargeChart data={budgetData} />
        </div>

<RecentTransactions depenses={depenses as any} factures={factures as any} />

      </div>
    </AppShell>
  );
}
