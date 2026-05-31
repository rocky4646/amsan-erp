"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMontant, formatDate, getStatutColor } from "@/lib/utils";

interface RecentTransactionsProps {
  depenses: Array<{
    id: string;
    date: string;
    montant_ttc: number;
    description: string | null;
    categorie: { nom: string } | null;
    chantier: { nom: string } | null;
  }>;
  factures: Array<{
    id: string;
    numero_facture: string;
    montant_ttc: number;
    statut_paiement: string;
    client: string;
    chantier: { nom: string } | null;
  }>;
}

export function RecentTransactions({ depenses, factures }: RecentTransactionsProps) {
  const combined = [
    ...depenses.slice(0, 3).map((d) => ({
      id: d.id,
      label: d.description || d.categorie?.nom || "Dépense",
      montant: -d.montant_ttc,
      date: d.date,
      chantier: d.chantier?.nom,
      type: "dépense" as const,
    })),
    ...factures.slice(0, 3).map((f) => ({
      id: f.id,
      label: `Facture ${f.numero_facture} - ${f.client}`,
      montant: f.montant_ttc,
      date: "",
      chantier: f.chantier?.nom,
      type: "facture" as const,
      statut: f.statut_paiement,
    })),
  ].sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {combined.map((t) => (
            <div key={t.id} className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[200px]">{t.label}</p>
                {t.chantier && (
                  <p className="text-xs text-muted-foreground truncate">{t.chantier}</p>
                )}
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${t.type === "dépense" ? "text-red-600" : "text-emerald-600"}`}>
                  {t.type === "dépense" ? "-" : "+"}{formatMontant(Math.abs(t.montant))}
                </p>
                {t.type === "facture" && t.statut && (
                  <Badge variant="outline" className={getStatutColor(t.statut) + " mt-0.5"}>
                    {t.statut}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
