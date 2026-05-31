import { createSupabaseServerClient } from "./server";
import type {
  Chantier, Employe, Pointage, Depense, Facture,
  Materiau, MaterielEngin, KpiDashboard, BudgetChantier,
  StockAlerte, PointageMensuel, Fournisseur, CategorieDepense,
} from "@/types";

// ===== CHANTIERS =====
export async function getChantiers(): Promise<Chantier[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("chantiers")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getChantier(id: string): Promise<Chantier | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("chantiers")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// ===== EMPLOYÉS =====
export async function getEmployes(): Promise<Employe[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employes")
    .select("*")
    .order("nom", { ascending: true });
  return data || [];
}

export async function getEmploye(id: string): Promise<Employe | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("employes")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// ===== POINTAGE =====
export async function getPointages(options?: {
  date?: string;
  chantier_id?: string;
  employe_id?: string;
}): Promise<Pointage[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("pointage")
    .select("*, employe:employes(*), chantier:chantiers(*)")
    .order("date", { ascending: false });

  if (options?.date) query = query.eq("date", options.date);
  if (options?.chantier_id) query = query.eq("chantier_id", options.chantier_id);
  if (options?.employe_id) query = query.eq("employe_id", options.employe_id);

  const { data } = await query.limit(100);
  return data || [];
}

// ===== DÉPENSES =====
export async function getDepenses(options?: {
  chantier_id?: string;
  categorie_id?: string;
}): Promise<Depense[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("depenses")
    .select("*, categorie:categories_depenses(*), fournisseur:fournisseurs(*), chantier:chantiers(*)")
    .order("date", { ascending: false });

  if (options?.chantier_id) query = query.eq("chantier_id", options.chantier_id);
  if (options?.categorie_id) query = query.eq("categorie_id", options.categorie_id);

  const { data } = await query.limit(100);
  return data || [];
}

// ===== FACTURES =====
export async function getFactures(): Promise<Facture[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("factures")
    .select("*, chantier:chantiers(*)")
    .order("date_emission", { ascending: false });
  return data || [];
}

// ===== MATÉRIAUX =====
export async function getMateriaux(): Promise<Materiau[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("materiaux")
    .select("*")
    .order("nom", { ascending: true });
  return data || [];
}

// ===== MATÉRIEL =====
export async function getMateriel(): Promise<MaterielEngin[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("materiel_engins")
    .select("*")
    .order("nom", { ascending: true });
  return data || [];
}

// ===== FOURNISSEURS =====
export async function getFournisseurs(): Promise<Fournisseur[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("fournisseurs")
    .select("*")
    .order("nom", { ascending: true });
  return data || [];
}

// ===== CATÉGORIES DÉPENSES =====
export async function getCategoriesDepenses(): Promise<CategorieDepense[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories_depenses")
    .select("*")
    .order("nom", { ascending: true });
  return data || [];
}

// ===== VUES =====
export async function getKpiDashboard(): Promise<KpiDashboard | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vue_kpi_dashboard")
    .select("*")
    .single();
  return data;
}

export async function getBudgetChantiers(): Promise<BudgetChantier[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vue_budget_chantier")
    .select("*")
    .order("chantier_nom", { ascending: true });
  return data || [];
}

export async function getStockAlertes(): Promise<StockAlerte[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vue_stock_alertes")
    .select("*")
    .order("niveau_alerte", { ascending: true });
  return data || [];
}

export async function getPointageMensuel(): Promise<PointageMensuel[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("vue_pointage_mensuel")
    .select("*")
    .order("mois", { ascending: false });
  return data || [];
}
