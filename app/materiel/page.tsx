import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { MaterielTable } from "@/components/stock/materiel-table";
import { getMateriel } from "@/lib/supabase/queries";

export default async function MaterielPage() {
  const data = await getMateriel();

  return (
    <AppShell>
      <PageHeader
        title="Matériel & Engins"
        description="Gestion du parc d'équipements et engins de chantier"
      />
      <MaterielTable data={data} />
    </AppShell>
  );
}
