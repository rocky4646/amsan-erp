import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { DepenseForm } from "@/components/depenses/depense-form";
import { DepenseTable } from "@/components/depenses/depense-table";
import {
  getDepenses,
  getChantiers,
  getCategoriesDepenses,
  getFournisseurs,
} from "@/lib/supabase/queries";

export default async function DepensesPage() {
  const [depenses, chantiers, categories, fournisseurs] = await Promise.all([
    getDepenses(),
    getChantiers(),
    getCategoriesDepenses(),
    getFournisseurs(),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Achats & Dépenses"
        description="Gestion des dépenses par chantier avec calcul automatique du TTC"
      >
        <DepenseForm
          chantiers={chantiers}
          categories={categories}
          fournisseurs={fournisseurs}
        />
      </PageHeader>
      <DepenseTable data={depenses} />
    </AppShell>
  );
}
