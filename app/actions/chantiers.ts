"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ChantierInput {
  nom: string;
  description?: string;
  client?: string;
  adresse?: string;
  ville?: string;
  budget_total?: number;
  budget_main_oeuvre?: number;
  budget_materiaux?: number;
  budget_transport?: number;
  budget_sous_traitance?: number;
  budget_autres?: number;
  date_debut?: string;
  date_fin_prevue?: string;
  statut?: string;
  avancement?: number;
}

export async function createChantier(input: ChantierInput) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("chantiers").insert(input);
  if (error) throw new Error(`Erreur lors de la création du chantier: ${error.message}`);
  revalidatePath("/chantiers");
  return { success: true };
}

export async function updateChantier(id: string, input: Partial<ChantierInput>) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("chantiers").update(input).eq("id", id);
  if (error) throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
  revalidatePath("/chantiers");
  revalidatePath(`/chantiers/${id}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteChantier(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("chantiers").delete().eq("id", id);
  if (error) throw new Error(`Erreur lors de la suppression: ${error.message}`);
  revalidatePath("/chantiers");
  return { success: true };
}
