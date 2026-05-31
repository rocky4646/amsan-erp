"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createDepense } from "@/app/actions/depenses";
import { formatMontant } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";
import type { Chantier, Fournisseur, CategorieDepense } from "@/types";

interface DepenseFormProps {
  chantiers: Chantier[];
  categories: CategorieDepense[];
  fournisseurs: Fournisseur[];
}

export function DepenseForm({ chantiers, categories, fournisseurs }: DepenseFormProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [montantHT, setMontantHT] = useState(0);
  const [tauxTVA, setTauxTVA] = useState(20);
  const montantTTC = montantHT * (1 + tauxTVA / 100);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    try {
      await createDepense({
        chantier_id: formData.get("chantier_id") as string,
        date: formData.get("date") as string,
        categorie_id: formData.get("categorie_id") as string,
        fournisseur_id: (formData.get("fournisseur_id") as string) || null,
        description: formData.get("description") as string,
        montant_ht: parseFloat(formData.get("montant_ht") as string) || 0,
        taux_tva: parseFloat(formData.get("taux_tva") as string) || 20,
        reference_facture: formData.get("reference_facture") as string,
        payee: formData.get("payee") === "on",
        date_paiement: formData.get("date_paiement") as string || null,
      });
      setOpen(false);
    } catch (err) {
      alert("Erreur lors de l'enregistrement");
    }
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouvelle dépense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enregistrer une dépense</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chantier_id">Chantier</Label>
              <Select name="chantier_id" required>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {chantiers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie_id">Catégorie</Label>
              <Select name="categorie_id" required>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fournisseur_id">Fournisseur</Label>
              <Select name="fournisseur_id">
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {fournisseurs.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" placeholder="Description de la dépense" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant_ht">Montant HT (MAD)</Label>
              <Input
                id="montant_ht"
                name="montant_ht"
                type="number"
                step="0.01"
                min="0"
                required
                onChange={(e) => setMontantHT(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taux_tva">TVA (%)</Label>
              <Select
                name="taux_tva"
                defaultValue="20"
                onValueChange={(v) => setTauxTVA(parseFloat(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="14">14%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="0">0% (Exonéré)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Montant TTC</Label>
              <div className="h-9 rounded-md border bg-muted/50 px-3 flex items-center text-sm font-medium">
                {formatMontant(montantTTC)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference_facture">Référence facture</Label>
              <Input id="reference_facture" name="reference_facture" placeholder=" FAC-2024-..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payee" className="flex items-center gap-2 pt-6">
                <input type="checkbox" name="payee" id="payee" className="rounded border-gray-300" />
                Déjà payée
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
