"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMontant, formatDate, getStatutLabel, getStatutColor } from "@/lib/utils";
import type { Depense } from "@/types";
import { Search } from "lucide-react";

interface DepenseTableProps {
  data: Depense[];
}

export function DepenseTable({ data }: DepenseTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((d) =>
    d.description?.toLowerCase().includes(search.toLowerCase()) ||
    d.categorie?.nom?.toLowerCase().includes(search.toLowerCase()) ||
    d.fournisseur?.nom?.toLowerCase().includes(search.toLowerCase())
  );

  const totalHT = filtered.reduce((s, d) => s + d.montant_ht, 0);
  const totalTVA = filtered.reduce((s, d) => s + d.montant_tva, 0);
  const totalTTC = filtered.reduce((s, d) => s + d.montant_ttc, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total HT</p>
          <p className="text-xl font-bold">{formatMontant(totalHT)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total TVA</p>
          <p className="text-xl font-bold text-amber-600">{formatMontant(totalTVA)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total TTC</p>
          <p className="text-xl font-bold text-blue-600">{formatMontant(totalTTC)}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Chantier</TableHead>
              <TableHead className="text-right">Montant HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Montant TTC</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((depense) => (
              <TableRow key={depense.id}>
                <TableCell>{formatDate(depense.date)}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">
                  {depense.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{depense.categorie?.nom || "-"}</Badge>
                </TableCell>
                <TableCell>{depense.fournisseur?.nom || "-"}</TableCell>
                <TableCell className="max-w-[150px] truncate">{depense.chantier?.nom || "-"}</TableCell>
                <TableCell className="text-right">{formatMontant(depense.montant_ht)}</TableCell>
                <TableCell className="text-right text-amber-600">
                  {formatMontant(depense.montant_tva)}
                </TableCell>
                <TableCell className="text-right font-medium">{formatMontant(depense.montant_ttc)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={depense.payee ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                    {depense.payee ? "Payée" : "Non payée"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
