"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMontant, getStatutColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { BudgetChantier } from "@/types";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MargeChartProps {
  data: BudgetChantier[];
}

export function MargeChart({ data }: MargeChartProps) {
  const sorted = [...data].sort((a, b) => b.marge_nette - a.marge_nette);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement rentabilité par chantier</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sorted.slice(0, 6).map((chantier, idx) => {
            const isProfitable = chantier.marge_nette >= 0;
            return (
              <div key={chantier.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground w-5">{idx + 1}.</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate max-w-[180px]">{chantier.chantier_nom}</p>
                    <Badge variant="outline" className={getStatutColor(chantier.statut)}>
                      {chantier.statut}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className={isProfitable ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                    {formatMontant(chantier.marge_nette)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recettes: {formatMontant(chantier.recettes_facturees)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
