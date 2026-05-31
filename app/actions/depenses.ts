"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface DepenseInput {
  chantier_id: string;
  date: string;
  categorie_id: string;
  fournisseur_id: string | null;
  description: string;
  montant_ht: number;
  taux_tva: number;
  reference_facture?: string;
  payee: boolean;
  date_paiement?: string | null;
}

export async function createDepense(input: DepenseInput) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("depenses").insert({
    chantier_id: input.chantier_id,
    date: input.date,
    categorie_id: input.categorie_id,
    fournisseur_id: input.fournisseur_id,
    description: input.description,
    montant_ht: input.montant_ht,
    taux_tva: input.taux_tva,
    reference_facture: input.reference_facture || null,
    payee: input.payee,
    date_paiement: input.date_paiement || null,
  });

  if (error) throw new Error(`Erreur lors de l'enregistrement de la dépense: ${error.message}`);
  revalidatePath("/depenses");
  revalidatePath("/chantiers");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateDepense(id: string, input: Partial<DepenseInput>) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("depenses").update(input).eq("id", id);
  if (error) throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
  revalidatePath("/depenses");
  return { success: true };
}
