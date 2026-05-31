"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface PointageInput {
  date: string;
  employe_id: string;
  chantier_id: string | null;
  present: boolean;
  type_journee: string;
  heures_travaillees: number;
  heures_supplementaires: number;
  notes?: string;
}

export async function createPointage(input: PointageInput) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("pointage").upsert(
    {
      date: input.date,
      employe_id: input.employe_id,
      chantier_id: input.chantier_id,
      present: input.present,
      type_journee: input.type_journee,
      heures_travaillees: input.heures_travaillees,
      heures_supplementaires: input.heures_supplementaires,
      notes: input.notes || null,
    },
    { onConflict: "date,employe_id" }
  );

  if (error) throw new Error(`Erreur lors de l'enregistrement du pointage: ${error.message}`);
  revalidatePath("/pointage");
  return { success: true };
}

export async function getPointageDuJour(date: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("pointage")
    .select("*, employe:employes(*), chantier:chantiers(*)")
    .eq("date", date)
    .order("employe_id");
  return data || [];
}

export async function getEmployesDisponibles() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employes")
    .select("*")
    .eq("disponible", true)
    .order("nom");
  return data || [];
}
