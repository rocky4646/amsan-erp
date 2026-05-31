import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { ChantierList } from "@/components/chantiers/chantier-list";
import { getBudgetChantiers } from "@/lib/supabase/queries";

export default async function ChantiersPage() {
  const data = await getBudgetChantiers();

  return (
    <AppShell>
      <PageHeader
        title="Chantiers"
        description="Gestion et suivi de tous les projets BTP"
      />
      <ChantierList data={data} />
    </AppShell>
  );
}
