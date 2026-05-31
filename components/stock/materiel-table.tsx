"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMontant, getStatutLabel, getStatutColor } from "@/lib/utils";
import type { MaterielEngin } from "@/types";
import { Search, Wrench, Truck } from "lucide-react";

interface MaterielTableProps {
  data: MaterielEngin[];
}

export function MaterielTable({ data }: MaterielTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((m) =>
    m.nom.toLowerCase().includes(search.toLowerCase()) ||
    m.marque?.toLowerCase().includes(search.toLowerCase()) ||
    m.immatriculation?.toLowerCase().includes(search.toLowerCase())
  );

  const enPanne = data.filter((m) => m.etat === "en_panne").length;
  const disponible = data.filter((m) => m.etat === "disponible").length;
  const valeurTotale = data.reduce((s, m) => s + m.valeur_achat, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total engins</p>
          <p className="text-xl font-bold">{data.length}</p>
        </Card>
        <Card className="p-4 border-emerald-200">
          <p className="text-sm text-muted-foreground">Disponibles</p>
          <p className="text-xl font-bold text-emerald-600">{disponible}</p>
        </Card>
        <Card className="p-4 border-red-200">
          <p className="text-sm text-muted-foreground">En panne</p>
          <p className="text-xl font-bold text-red-600">{enPanne}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Valeur totale du parc</p>
          <p className="text-xl font-bold">{formatMontant(valeurTotale)}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un équipement..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Équipement</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Marque / Modèle</TableHead>
              <TableHead>Immatriculation</TableHead>
              <TableHead className="text-right">Valeur achat</TableHead>
              <TableHead className="text-right">Coût / jour</TableHead>
              <TableHead>État</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((engin) => (
              <TableRow key={engin.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {engin.type === "engin_lourd" || engin.type === "vehicule_leger"
                      ? <Truck className="h-4 w-4 text-muted-foreground" />
                      : <Wrench className="h-4 w-4 text-muted-foreground" />}
                    {engin.nom}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{engin.type || "-"}</TableCell>
                <TableCell>
                  {engin.marque && engin.modele
                    ? `${engin.marque} ${engin.modele}`
                    : engin.marque || "-"}
                </TableCell>
                <TableCell className="font-mono text-xs">{engin.immatriculation || "-"}</TableCell>
                <TableCell className="text-right">{formatMontant(engin.valeur_achat)}</TableCell>
                <TableCell className="text-right">{formatMontant(engin.cout_journalier)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatutColor(engin.etat)}>
                    {getStatutLabel(engin.etat)}
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
