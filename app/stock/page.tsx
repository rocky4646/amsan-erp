import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { StockTable } from "@/components/stock/stock-table";
import { getMateriaux, getStockAlertes } from "@/lib/supabase/queries";

export default async function StockPage() {
  const [materiaux, alertes] = await Promise.all([
    getMateriaux(),
    getStockAlertes(),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Gestion des stocks"
        description="Inventaire des matériaux avec alertes de seuil critique"
      />
      <StockTable materiaux={materiaux} alertes={alertes} />
    </AppShell>
  );
}
