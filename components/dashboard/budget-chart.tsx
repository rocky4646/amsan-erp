"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMontant } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BudgetChartProps {
  data: Array<{
    id: string;
    chantier_nom: string;
    budget_total: number;
    depenses_reelles: number;
    pourcentage_depense: number;
    recettes_facturees: number;
    marge_nette: number;
    statut: string;
  }>;
}

export function BudgetChart({ data }: BudgetChartProps) {
  const totalBudget = data.reduce((s, d) => s + d.budget_total, 0);
  const totalDepenses = data.reduce((s, d) => s + d.depenses_reelles, 0);
  const totalRecettes = data.reduce((s, d) => s + d.recettes_facturees, 0);
  const budgetConsomme = totalBudget > 0 ? ((totalDepenses / totalBudget) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Réel par chantier</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget global consommé</span>
            <span className="font-medium">{budgetConsomme.toFixed(1)}%</span>
          </div>
          <Progress value={budgetConsomme} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Budget: {formatMontant(totalBudget)}</span>
            <span>Dépensé: {formatMontant(totalDepenses)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((chantier) => {
            const ratio = chantier.budget_total > 0
              ? (chantier.depenses_reelles / chantier.budget_total) * 100
              : 0;
            const isOverBudget = ratio > 100;

            return (
              <div key={chantier.id} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {chantier.chantier_nom}
                    </span>
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      isOverBudget ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {isOverBudget ? "Dépassement" : `${ratio.toFixed(0)}%`}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{formatMontant(chantier.depenses_reelles)}</div>
                    <div className="text-blue-600">{formatMontant(chantier.budget_total)}</div>
                  </div>
                </div>
                <Progress
                  value={Math.min(ratio, 100)}
                  className={cn("h-1.5", isOverBudget && "[&>div]:bg-destructive")}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
