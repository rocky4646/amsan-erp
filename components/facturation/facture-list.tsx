"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMontant, formatDate, getStatutLabel, getStatutColor } from "@/lib/utils";
import type { Facture } from "@/types";
import { Search } from "lucide-react";

interface FactureListProps {
  data: Facture[];
}

export function FactureList({ data }: FactureListProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((f) =>
    f.numero_facture.toLowerCase().includes(search.toLowerCase()) ||
    f.client.toLowerCase().includes(search.toLowerCase())
  );

  const totalHT = filtered.reduce((s, f) => s + f.montant_ht, 0);
  const totalTVA = filtered.reduce((s, f) => s + f.montant_tva, 0);
  const totalTTC = filtered.reduce((s, f) => s + f.montant_ttc, 0);
  const totalPayee = filtered.filter((f) => f.statut_paiement === "payee").reduce((s, f) => s + f.montant_ttc, 0);
  const totalEnRetard = filtered.filter((f) => f.statut_paiement === "en_retard").reduce((s, f) => s + f.montant_ttc, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total TTC</p>
          <p className="text-xl font-bold">{formatMontant(totalTTC)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">HT</p>
          <p className="text-xl font-bold">{formatMontant(totalHT)}</p>
        </Card>
        <Card className="p-4 border-emerald-200">
          <p className="text-sm text-muted-foreground">Encaissé</p>
          <p className="text-xl font-bold text-emerald-600">{formatMontant(totalPayee)}</p>
        </Card>
        <Card className="p-4 border-red-200">
          <p className="text-sm text-muted-foreground">En retard</p>
          <p className="text-xl font-bold text-red-600">{formatMontant(totalEnRetard)}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une facture..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Chantier</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Montant HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Montant TTC</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((facture) => (
              <TableRow key={facture.id}>
                <TableCell className="font-mono text-sm font-medium">{facture.numero_facture}</TableCell>
                <TableCell className="font-medium">{facture.client}</TableCell>
                <TableCell className="max-w-[150px] truncate text-muted-foreground">
                  {facture.chantier?.nom || "-"}
                </TableCell>
                <TableCell>{formatDate(facture.date_emission)}</TableCell>
                <TableCell>{formatDate(facture.echeance)}</TableCell>
                <TableCell className="text-right">{formatMontant(facture.montant_ht)}</TableCell>
                <TableCell className="text-right text-amber-600">{formatMontant(facture.montant_tva)}</TableCell>
                <TableCell className="text-right font-medium">{formatMontant(facture.montant_ttc)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatutColor(facture.statut_paiement)}>
                    {getStatutLabel(facture.statut_paiement)}
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
