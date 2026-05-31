"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatMontant, getStatutLabel } from "@/lib/utils";
import type { Employe } from "@/types";
import { Search, User, Wrench } from "lucide-react";

interface EmployeTableProps {
  data: Employe[];
}

export function EmployeTable({ data }: EmployeTableProps) {
  const [search, setSearch] = useState("");

  const filtered = data.filter((e) =>
    `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
    e.poste?.toLowerCase().includes(search.toLowerCase()) ||
    e.categorie?.toLowerCase().includes(search.toLowerCase())
  );

  const masseSalariale = data.reduce((s, e) => s + e.salaire_brut_mensuel, 0);
  const ouvriers = data.filter((e) => e.categorie === "ouvrier").length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Effectif total</p>
          <p className="text-xl font-bold">{data.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Ouvriers</p>
          <p className="text-xl font-bold">{ouvriers}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Masse salariale/mois</p>
          <p className="text-xl font-bold">{formatMontant(masseSalariale)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Disponibles</p>
          <p className="text-xl font-bold text-emerald-600">{data.filter((e) => e.disponible).length}</p>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule</TableHead>
              <TableHead>Nom & Prénom</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Salaire brut/mois</TableHead>
              <TableHead className="text-right">Coût journalier</TableHead>
              <TableHead>Disponible</TableHead>
              <TableHead>Habilitations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-mono text-xs">{emp.matricule || "-"}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {emp.nom} {emp.prenom}
                  </div>
                </TableCell>
                <TableCell>{emp.poste || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">{emp.categorie || "-"}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatMontant(emp.salaire_brut_mensuel)}
                </TableCell>
                <TableCell className="text-right">{formatMontant(emp.cout_journalier)}</TableCell>
                <TableCell>
                  {emp.disponible ? (
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">Disponible</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-100 text-red-800">Indisponible</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {emp.habilitations && emp.habilitations.length > 0 ? (
                      emp.habilitations.map((h, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          <Wrench className="h-3 w-3 mr-1" />
                          {h}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
