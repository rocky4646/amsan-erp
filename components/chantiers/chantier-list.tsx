"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { formatMontant, formatDate, getStatutLabel, getStatutColor } from "@/lib/utils";
import type { BudgetChantier } from "@/types";
import { Plus, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChantierListProps {
  data: BudgetChantier[];
}

export function ChantierList({ data }: ChantierListProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((c) =>
    c.chantier_nom.toLowerCase().includes(search.toLowerCase())
  );

  const totalBudget = data.reduce((s, c) => s + c.budget_total, 0);
  const totalDepenses = data.reduce((s, c) => s + c.depenses_reelles, 0);
  const totalRecettes = data.reduce((s, c) => s + c.recettes_facturees, 0);
  const totalMarge = data.reduce((s, c) => s + c.marge_nette, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Budget total</p>
          <p className="text-xl font-bold">{formatMontant(totalBudget)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Dépenses totales</p>
          <p className="text-xl font-bold text-amber-600">{formatMontant(totalDepenses)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Recettes totales</p>
          <p className="text-xl font-bold text-emerald-600">{formatMontant(totalRecettes)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Marge nette</p>
          <p className={`text-xl font-bold ${totalMarge >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {formatMontant(totalMarge)}
          </p>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un chantier..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouveau chantier
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chantier</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Avancement</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Dépenses</TableHead>
              <TableHead className="text-right">Recettes</TableHead>
              <TableHead className="text-right">Marge</TableHead>
              <TableHead>Consommation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((chantier) => {
              const ratio = chantier.budget_total > 0
                ? (chantier.depenses_reelles / chantier.budget_total) * 100
                : 0;
              const isOverBudget = ratio > 100;

              return (
                <TableRow key={chantier.id}>
                  <TableCell className="font-medium">{chantier.chantier_nom}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatutColor(chantier.statut)}>
                      {getStatutLabel(chantier.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={chantier.avancement} className="w-16 h-1.5" />
                      <span className="text-xs text-muted-foreground">{chantier.avancement}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatMontant(chantier.budget_total)}</TableCell>
                  <TableCell className="text-right">{formatMontant(chantier.depenses_reelles)}</TableCell>
                  <TableCell className="text-right">{formatMontant(chantier.recettes_facturees)}</TableCell>
                  <TableCell className={`text-right font-medium ${chantier.marge_nette >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {formatMontant(chantier.marge_nette)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.min(ratio, 100)}
                        className={`w-16 h-1.5 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                      />
                      <span className={`text-xs ${isOverBudget ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                        {ratio.toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
