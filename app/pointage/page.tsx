import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/shared";
import { PointageForm } from "@/components/pointage/pointage-form";
import { getEmployes, getChantiers } from "@/lib/supabase/queries";
import { getPointageDuJour } from "@/app/actions/pointage";

export default async function PointagePage() {
  const [employes, chantiers] = await Promise.all([
    getEmployes(),
    getChantiers(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const pointagesDuJour = await getPointageDuJour(today);

  return (
    <AppShell>
      <PageHeader
        title="Pointage & RH"
        description="Saisie quotidienne des présences et suivi de la main-d'œuvre"
      />
      <PointageForm
        employes={employes}
        chantiers={chantiers}
        pointagesDuJour={pointagesDuJour}
      />
    </AppShell>
  );
}
