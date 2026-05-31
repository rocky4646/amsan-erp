"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TYPE_JOURNEE_OPTIONS } from "@/lib/constants";
import { formatMontant, formatDate } from "@/lib/utils";
import { createPointage } from "@/app/actions/pointage";
import { Check, X, Loader2, Save } from "lucide-react";
import type { Employe, Chantier, Pointage } from "@/types";

interface PointageFormProps {
  employes: Employe[];
  chantiers: Chantier[];
  pointagesDuJour: Pointage[];
}

export function PointageForm({ employes, chantiers, pointagesDuJour }: PointageFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [pointages, setPointages] = useState<Record<string, {
    employe_id: string;
    chantier_id: string;
    present: boolean;
    type_journee: string;
    heures_travaillees: number;
    heures_supplementaires: number;
  }>>({});

  useEffect(() => {
    const initial: Record<string, any> = {};
    for (const emp of employes) {
      const existing = pointagesDuJour.find((p) => p.employe_id === emp.id);
      initial[emp.id] = existing
        ? {
            employe_id: emp.id,
            chantier_id: existing.chantier_id || "",
            present: existing.present,
            type_journee: existing.type_journee,
            heures_travaillees: existing.heures_travaillees,
            heures_supplementaires: existing.heures_supplementaires,
          }
        : {
            employe_id: emp.id,
            chantier_id: "",
            present: true,
            type_journee: "normale",
            heures_travaillees: 8,
            heures_supplementaires: 0,
          };
    }
    setPointages(initial);
  }, [employes, pointagesDuJour]);

  const updatePointage = useCallback((employeId: string, field: string, value: any) => {
    setPointages((prev) => ({
      ...prev,
      [employeId]: { ...prev[employeId], [field]: value },
    }));
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const results = await Promise.allSettled(
        Object.values(pointages).map((p) =>
          createPointage({
            date,
            employe_id: p.employe_id,
            chantier_id: p.chantier_id || null,
            present: p.present,
            type_journee: p.type_journee,
            heures_travaillees: p.heures_travaillees,
            heures_supplementaires: p.heures_supplementaires,
          })
        )
      );
      const errors = results.filter((r) => r.status === "rejected");
      if (errors.length === 0) {
        setMessage({ type: "success", text: "Pointage enregistré avec succès !" });
      } else {
        setMessage({ type: "error", text: `${errors.length} erreur(s) lors de l'enregistrement.` });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement du pointage." });
    }
    setSaving(false);
  };

  const activePointages = Object.values(pointages).filter((p) => p.present);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Saisie quotidienne des présences</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button onClick={handleSaveAll} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                Enregistrer
              </Button>
            </div>
          </div>
          {message && (
            <p className={`text-sm ${message.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
              {message.text}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Présent</TableHead>
                <TableHead>Chantier</TableHead>
                <TableHead>Type de journée</TableHead>
                <TableHead>Heures travaillées</TableHead>
                <TableHead>Heures sup.</TableHead>
                <TableHead className="text-right">Coût journalier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employes.map((emp) => {
                const p = pointages[emp.id];
                if (!p) return null;

                return (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">
                      {emp.nom} {emp.prenom}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{emp.poste}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updatePointage(emp.id, "present", !p.present)}
                        className={p.present ? "text-emerald-600" : "text-red-600"}
                      >
                        {p.present ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {p.present ? (
                        <Select
                          value={p.chantier_id}
                          onValueChange={(v) => updatePointage(emp.id, "chantier_id", v)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Chantier" />
                          </SelectTrigger>
                          <SelectContent>
                            {chantiers.map((c) => (
                              <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.present ? (
                        <Select
                          value={p.type_journee}
                          onValueChange={(v) => updatePointage(emp.id, "type_journee", v)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TYPE_JOURNEE_OPTIONS.filter((o) => o.value !== "absence_justifiee" && o.value !== "absence_injustifiee" && o.value !== "conges")
                              .map((o) => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Select
                          value={p.type_journee}
                          onValueChange={(v) => updatePointage(emp.id, "type_journee", v)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TYPE_JOURNEE_OPTIONS.filter((o) => o.value === "absence_justifiee" || o.value === "absence_injustifiee" || o.value === "conges")
                              .map((o) => (
                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.present ? (
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          value={p.heures_travaillees}
                          onChange={(e) => updatePointage(emp.id, "heures_travaillees", parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.present ? (
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          value={p.heures_supplementaires}
                          onChange={(e) => updatePointage(emp.id, "heures_supplementaires", parseFloat(e.target.value) || 0)}
                          className="w-20"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {p.present
                        ? formatMontant(
                            emp.cout_journalier +
                              emp.cout_journalier * 0.5 * p.heures_supplementaires / 8
                          )
                        : formatMontant(0)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {employes.length} employés · {activePointages.length} présent(s) · {employes.length - activePointages.length} absent(s)
            </span>
            <span className="font-medium">
              Coût total jour: {formatMontant(
                activePointages.reduce((sum, p) => {
                  const emp = employes.find((e) => e.id === p.employe_id);
                  if (!emp) return sum;
                  return sum + emp.cout_journalier + emp.cout_journalier * 0.5 * p.heures_supplementaires / 8;
                }, 0)
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
