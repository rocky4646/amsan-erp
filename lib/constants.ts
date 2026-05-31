export const APP_NAME = "AMSAN ERP";
export const COMPANY_NAME = "AMSAN TRAVAUX PUBLICS SARL";
export const DEVISE = "MAD";
export const TVA_DEFAULT = 20;
export const TVA_REDUIT = 14;

export const STATUT_CHANTIER_OPTIONS = [
  { value: "demarrage", label: "Démarrage" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminé" },
  { value: "suspendu", label: "Suspendu" },
] as const;

export const STATUT_PAIEMENT_OPTIONS = [
  { value: "payee", label: "Payée" },
  { value: "en_attente", label: "En attente" },
  { value: "en_retard", label: "En retard" },
  { value: "annulee", label: "Annulée" },
] as const;

export const CATEGORIES_EMPLOYE = [
  { value: "ouvrier", label: "Ouvrier" },
  { value: "chef_equipe", label: "Chef d'équipe" },
  { value: "conducteur", label: "Conducteur" },
  { value: "ingenieur", label: "Ingénieur" },
  { value: "technicien", label: "Technicien" },
  { value: "comptable", label: "Comptable" },
  { value: "administratif", label: "Administratif" },
  { value: "directeur", label: "Directeur" },
] as const;

export const TYPE_JOURNEE_OPTIONS = [
  { value: "normale", label: "Journée normale" },
  { value: "heure_sup", label: "Avec heures sup" },
  { value: "jour_ferie", label: "Jour férié" },
  { value: "conges", label: "Congés" },
  { value: "absence_justifiee", label: "Absence justifiée" },
  { value: "absence_injustifiee", label: "Absence injustifiée" },
] as const;

export const UNITES_MATERIAU = [
  { value: "U", label: "Unité" },
  { value: "kg", label: "Kilogramme" },
  { value: "t", label: "Tonne" },
  { value: "m", label: "Mètre" },
  { value: "m2", label: "Mètre carré" },
  { value: "m3", label: "Mètre cube" },
  { value: "L", label: "Litre" },
  { value: "sac", label: "Sac" },
  { value: "barre", label: "Barre" },
  { value: "palette", label: "Palette" },
  { value: "rouleau", label: "Rouleau" },
] as const;

export const TYPE_ENGIN_OPTIONS = [
  { value: "engin_lourd", label: "Engin lourd" },
  { value: "vehicule_leger", label: "Véhicule léger" },
  { value: "outillage", label: "Outillage" },
  { value: "equipement_special", label: "Équipement spécial" },
  { value: "bureau", label: "Bureau" },
] as const;

export const ETAT_ENGIN_OPTIONS = [
  { value: "disponible", label: "Disponible" },
  { value: "affecte", label: "Affecté" },
  { value: "en_panne", label: "En panne" },
  { value: "maintenance", label: "Maintenance" },
  { value: "hors_service", label: "Hors service" },
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de bord", icon: "LayoutDashboard" },
  { href: "/chantiers", label: "Chantiers", icon: "HardHat" },
  { href: "/pointage", label: "Pointage & RH", icon: "ClipboardCheck" },
  { href: "/employes", label: "Employés", icon: "Users" },
  { href: "/depenses", label: "Achats & Dépenses", icon: "ShoppingCart" },
  { href: "/facturation", label: "Facturation", icon: "FileInvoice" },
  { href: "/stock", label: "Stock", icon: "Warehouse" },
  { href: "/materiel", label: "Matériel & Engins", icon: "Tractor" },
] as const;

export const SIDEBAR_WIDTH = 260;
export const HEADER_HEIGHT = 64;
