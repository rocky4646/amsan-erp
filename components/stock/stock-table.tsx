"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatMontant, getStatutColor } from "@/lib/utils";
import type { Materiau, StockAlerte } from "@/types";
import { Search, AlertTriangle, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockTableProps {
  materiaux: Materiau[];
  alertes: StockAlerte[];
}

export function StockTable({ materiaux, alertes }: StockTableProps) {
  const [search, setSearch] = useState("");

  const filtered = materiaux.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase())
  );

  const alertesCritiques = alertes.filter((a) => a.niveau_alerte === "critique");
  const alertesAttention = alertes.filter((a) => a.niveau_alerte === "attention");
  const valeurTotaleStock = materiaux.reduce((s, m) => s + m.stock_restant * m.prix_unitaire, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Valeur totale du stock</p>
          <p className="text-xl font-bold">{formatMontant(valeurTotaleStock)}</p>
        </Card>
        <Card className="p-4 border-red-200">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
            Alertes critiques
          </p>
          <p className="text-xl font-bold text-red-600">{alertesCritiques.length}</p>
        </Card>
        <Card className="p-4 border-amber-200">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <CircleAlert className="h-3.5 w-3.5 text-amber-500" />
            Attention
          </p>
          <p className="text-xl font-bold text-amber-600">{alertesAttention.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Références totales</p>
          <p className="text-xl font-bold">{materiaux.length}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un matériau..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matériau</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead className="text-right">Entrée</TableHead>
              <TableHead className="text-right">Utilisé</TableHead>
              <TableHead className="text-right">Stock restant</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead className="text-right">Seuil alerte</TableHead>
              <TableHead className="text-right">Prix unitaire</TableHead>
              <TableHead className="text-right">Valeur</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => {
              const stockRatio = m.quantite_entree > 0
                ? ((m.quantite_entree - m.stock_restant) / m.quantite_entree) * 100
                : 0;
              const isLow = m.seuil_alerte > 0 && m.stock_restant <= m.seuil_alerte;
              const isWarning = m.seuil_alerte > 0 && m.stock_restant <= m.seuil_alerte * 2 && m.stock_restant > m.seuil_alerte;

              return (
                <TableRow key={m.id} className={cn(isLow && "bg-red-50/50")}>
                  <TableCell className="font-medium">{m.nom}</TableCell>
                  <TableCell>{m.unite}</TableCell>
                  <TableCell className="text-right">{m.quantite_entree}</TableCell>
                  <TableCell className="text-right">{m.quantite_utilisee}</TableCell>
                  <TableCell className={cn("text-right font-medium", isLow && "text-red-600", isWarning && "text-amber-600")}>
                    {m.stock_restant}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={Math.min(stockRatio, 100)}
                        className={cn("w-16 h-1.5", isLow && "[&>div]:bg-destructive", isWarning && "[&>div]:bg-amber-500")}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{m.seuil_alerte}</TableCell>
                  <TableCell className="text-right">{formatMontant(m.prix_unitaire)}</TableCell>
                  <TableCell className="text-right font-medium">{formatMontant(m.stock_restant * m.prix_unitaire)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
