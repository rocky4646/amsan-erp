import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMontant(montant: number, devise = "MAD"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise,
    minimumFractionDigits: 2,
  }).format(montant);
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateLong(date: string | Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function calculerMarge(revenu: number, depenses: number): number {
  if (revenu === 0) return 0;
  return ((revenu - depenses) / revenu) * 100;
}

export function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    demarrage: "Démarrage",
    en_cours: "En cours",
    termine: "Terminé",
    suspendu: "Suspendu",
    payee: "Payée",
    en_attente: "En attente",
    en_retard: "En retard",
    annulee: "Annulée",
    disponible: "Disponible",
    affecte: "Affecté",
    en_panne: "En panne",
    maintenance: "Maintenance",
    hors_service: "Hors service",
  };
  return labels[statut] || statut;
}

export function getStatutColor(statut: string): string {
  const colors: Record<string, string> = {
    demarrage: "bg-blue-100 text-blue-800",
    en_cours: "bg-amber-100 text-amber-800",
    termine: "bg-emerald-100 text-emerald-800",
    suspendu: "bg-red-100 text-red-800",
    payee: "bg-emerald-100 text-emerald-800",
    en_attente: "bg-amber-100 text-amber-800",
    en_retard: "bg-red-100 text-red-800",
    annulee: "bg-gray-100 text-gray-800",
    disponible: "bg-emerald-100 text-emerald-800",
    affecte: "bg-blue-100 text-blue-800",
    en_panne: "bg-red-100 text-red-800",
    maintenance: "bg-amber-100 text-amber-800",
    hors_service: "bg-gray-100 text-gray-800",
    normal: "bg-emerald-100 text-emerald-800",
    attention: "bg-amber-100 text-amber-800",
    critique: "bg-red-100 text-red-800",
  };
  return colors[statut] || "bg-gray-100 text-gray-800";
}

export function getCategorieIcon(categorie: string): string {
  const icons: Record<string, string> = {
    Matériaux: "Package",
    Transport: "Truck",
    "Main d'œuvre": "Users",
    "Sous-traitance": "Handshake",
    Équipement: "Wrench",
    Administratif: "FileText",
    Assurance: "Shield",
    Fournitures: "Box",
    Autres: "MoreHorizontal",
  };
  return icons[categorie] || "Circle";
}
