import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { FactureList } from "@/components/facturation/facture-list";
import { getFactures } from "@/lib/supabase/queries";

export default async function FacturationPage() {
  const factures = await getFactures();

  return (
    <AppShell>
      <PageHeader
        title="Facturation"
        description="Suivi des factures clients et encaissements"
      />
      <FactureList data={factures} />
    </AppShell>
  );
}
