import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { EmployeTable } from "@/components/employes/employe-table";
import { getEmployes } from "@/lib/supabase/queries";

export default async function EmployesPage() {
  const data = await getEmployes();

  return (
    <AppShell>
      <PageHeader
        title="Employés"
        description="Gestion des ressources humaines et habilitations"
      />
      <EmployeTable data={data} />
    </AppShell>
  );
}
