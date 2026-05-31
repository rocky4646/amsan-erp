export interface Entreprise {
  id: string;
  nom: string;
  ice: string | null;
  rc: string | null;
  patente: string | null;
  cnss: string | null;
  adresse: string | null;
  ville: string | null;
  telephone: string | null;
  email: string | null;
  devise: string;
  tva_default: number;
  tva_reduit: number;
  logo_url: string | null;
}

export interface Chantier {
  id: string;
  nom: string;
  description: string | null;
  client: string | null;
  adresse: string | null;
  ville: string | null;
  budget_total: number;
  budget_main_oeuvre: number;
  budget_materiaux: number;
  budget_transport: number;
  budget_sous_traitance: number;
  budget_autres: number;
  date_debut: string | null;
  date_fin_prevue: string | null;
  date_fin_reelle: string | null;
  statut: StatutChantier;
  avancement: number;
  notes: string | null;
  created_at: string;
}

export type StatutChantier = 'demarrage' | 'en_cours' | 'termine' | 'suspendu';

export interface Employe {
  id: string;
  matricule: string | null;
  nom: string;
  prenom: string;
  poste: string | null;
  categorie: CategorieEmploye | null;
  salaire_brut_mensuel: number;
  cout_journalier: number;
  cnss_numero: string | null;
  habilitations: string[] | null;
  disponible: boolean;
  date_embauche: string | null;
  date_naissance: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  piece_identite: string | null;
}

export type CategorieEmploye =
  | 'ouvrier' | 'chef_equipe' | 'conducteur' | 'ingenieur'
  | 'technicien' | 'comptable' | 'administratif' | 'directeur';

export interface Pointage {
  id: string;
  date: string;
  employe_id: string;
  chantier_id: string | null;
  present: boolean;
  type_journee: TypeJournee;
  heures_travaillees: number;
  heures_supplementaires: number;
  cout_journalier_calcule: number;
  notes: string | null;
  employe?: Employe;
  chantier?: Chantier;
}

export type TypeJournee =
  | 'normale' | 'heure_sup' | 'jour_ferie' | 'conges'
  | 'absence_justifiee' | 'absence_injustifiee';

export interface Depense {
  id: string;
  chantier_id: string;
  date: string;
  categorie_id: string;
  fournisseur_id: string | null;
  description: string | null;
  montant_ht: number;
  taux_tva: number;
  montant_tva: number;
  montant_ttc: number;
  reference_facture: string | null;
  payee: boolean;
  date_paiement: string | null;
  categorie?: CategorieDepense;
  fournisseur?: Fournisseur;
  chantier?: Chantier;
}

export interface CategorieDepense {
  id: string;
  nom: string;
  description: string | null;
}

export interface Fournisseur {
  id: string;
  nom: string;
  ice: string | null;
  telephone: string | null;
  email: string | null;
  adresse: string | null;
  ville: string | null;
  categorie_principale: string | null;
}

export interface Facture {
  id: string;
  numero_facture: string;
  chantier_id: string;
  client: string;
  client_ice: string | null;
  date_emission: string;
  echeance: string;
  montant_ht: number;
  taux_tva: number;
  montant_tva: number;
  montant_ttc: number;
  statut_paiement: StatutPaiement;
  date_paiement: string | null;
  notes: string | null;
  chantier?: Chantier;
}

export type StatutPaiement = 'payee' | 'en_attente' | 'en_retard' | 'annulee';

export interface Materiau {
  id: string;
  nom: string;
  unite: string;
  quantite_entree: number;
  quantite_utilisee: number;
  stock_restant: number;
  seuil_alerte: number;
  prix_unitaire: number;
  fournisseur_principal: string | null;
  emplacement: string | null;
}

export interface ConsommationMateriau {
  id: string;
  materiau_id: string;
  chantier_id: string;
  quantite: number;
  date: string;
}

export interface MaterielEngin {
  id: string;
  nom: string;
  type: string | null;
  marque: string | null;
  modele: string | null;
  annee: number | null;
  immatriculation: string | null;
  valeur_achat: number;
  cout_journalier: number;
  cout_horaire: number;
  etat: EtatEngin;
  chantier_actuel_id: string | null;
  date_derniere_maintenance: string | null;
}

export type EtatEngin = 'disponible' | 'affecte' | 'en_panne' | 'maintenance' | 'hors_service';

export interface KpiDashboard {
  revenu_total: number;
  revenu_encaissé: number;
  revenu_a_encaisser: number;
  depenses_total: number;
  depenses_payees: number;
  masse_salariale_totale: number;
}

export interface BudgetChantier {
  id: string;
  chantier_nom: string;
  budget_total: number;
  statut: string;
  avancement: number;
  depenses_reelles: number;
  recettes_facturees: number;
  recettes_encaissees: number;
  pourcentage_depense: number;
  reliquat_budget: number;
  marge_nette: number;
}

export interface StockAlerte {
  id: string;
  nom: string;
  unite: string;
  stock_restant: number;
  seuil_alerte: number;
  niveau_alerte: 'normal' | 'attention' | 'critique';
  prix_unitaire: number;
  valeur_stock: number;
}

export interface PointageMensuel {
  employe_id: string;
  employe_nom: string;
  poste: string;
  mois: string;
  jours_presents: number;
  absences_injustifiees: number;
  total_heures_sup: number;
  cout_total: number;
  chantiers_affectes: number;
}
