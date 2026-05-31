-- ============================================================
-- SCHÉMA COMPLET SUPABASE - ERP AMSAN TRAVAUX PUBLICS SARL
-- ============================================================

-- 1. ENTREPRISE & PARAMÈTRES
CREATE TABLE entreprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL DEFAULT 'AMSAN TRAVAUX PUBLICS SARL',
  ice VARCHAR(20),
  rc VARCHAR(50),
  patente VARCHAR(50),
  cnss VARCHAR(50),
  adresse TEXT,
  ville VARCHAR(100),
  telephone VARCHAR(20),
  email VARCHAR(255),
  devise VARCHAR(5) DEFAULT 'MAD',
  tva_default NUMERIC(5,2) DEFAULT 20.00,
  tva_reduit NUMERIC(5,2) DEFAULT 14.00,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CHANTIERS
CREATE TABLE chantiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  client VARCHAR(255),
  adresse TEXT,
  ville VARCHAR(100),
  budget_total NUMERIC(12,2) DEFAULT 0,
  budget_main_oeuvre NUMERIC(12,2) DEFAULT 0,
  budget_materiaux NUMERIC(12,2) DEFAULT 0,
  budget_transport NUMERIC(12,2) DEFAULT 0,
  budget_sous_traitance NUMERIC(12,2) DEFAULT 0,
  budget_autres NUMERIC(12,2) DEFAULT 0,
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  statut VARCHAR(20) DEFAULT 'demarrage' CHECK (statut IN ('demarrage','en_cours','termine','suspendu')),
  avancement NUMERIC(5,2) DEFAULT 0 CHECK (avancement >= 0 AND avancement <= 100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. EMPLOYÉS (RH)
CREATE TABLE employes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule VARCHAR(20) UNIQUE,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  poste VARCHAR(100),
  categorie VARCHAR(50) CHECK (categorie IN ('ouvrier','chef_equipe','conducteur','ingenieur','technicien','comptable','administratif','directeur')),
  salaire_brut_mensuel NUMERIC(10,2) DEFAULT 0,
  cout_journalier NUMERIC(10,2) GENERATED ALWAYS AS (salaire_brut_mensuel / 26.0) STORED,
  cnss_numero VARCHAR(20),
  habilitations TEXT[],
  disponible BOOLEAN DEFAULT true,
  date_embauche DATE,
  date_naissance DATE,
  telephone VARCHAR(20),
  email VARCHAR(255),
  adresse TEXT,
  piece_identite VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. POINTAGE
CREATE TABLE pointage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  employe_id UUID NOT NULL REFERENCES employes(id) ON DELETE CASCADE,
  chantier_id UUID REFERENCES chantiers(id) ON DELETE SET NULL,
  present BOOLEAN DEFAULT true,
  type_journee VARCHAR(20) DEFAULT 'normale' CHECK (type_journee IN ('normale','heure_sup','jour_ferie','conges','absence_justifiee','absence_injustifiee')),
  heures_travaillees NUMERIC(4,1) DEFAULT 8.0 CHECK (heures_travaillees >= 0 AND heures_travaillees <= 24),
  heures_supplementaires NUMERIC(4,1) DEFAULT 0 CHECK (heures_supplementaires >= 0),
  cout_journalier_calcule NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE
      WHEN present = false THEN 0
      WHEN type_journee = 'conges' THEN 0
      WHEN type_journee = 'absence_injustifiee' THEN 0
      ELSE (SELECT cout_journalier FROM employes WHERE id = employe_id) + ((SELECT cout_journalier FROM employes WHERE id = employe_id) * 0.5 * heures_supplementaires / 8.0)
    END
  ) STORED,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(date, employe_id)
);

-- 5. CATÉGORIES DE DÉPENSES
CREATE TABLE categories_depenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);
INSERT INTO categories_depenses (nom) VALUES
  ('Matériaux'), ('Transport'), ('Main d''œuvre'),
  ('Sous-traitance'), ('Équipement'), ('Administratif'),
  ('Assurance'), ('Fournitures'), ('Autres');

-- 6. FOURNISSEURS
CREATE TABLE fournisseurs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  ice VARCHAR(20),
  telephone VARCHAR(20),
  email VARCHAR(255),
  adresse TEXT,
  ville VARCHAR(100),
  categorie_principale UUID REFERENCES categories_depenses(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. DÉPENSES
CREATE TABLE depenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chantier_id UUID NOT NULL REFERENCES chantiers(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  categorie_id UUID NOT NULL REFERENCES categories_depenses(id),
  fournisseur_id UUID REFERENCES fournisseurs(id) ON DELETE SET NULL,
  description TEXT,
  montant_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
  taux_tva NUMERIC(5,2) DEFAULT 20.00,
  montant_tva NUMERIC(12,2) GENERATED ALWAYS AS (montant_ht * taux_tva / 100.0) STORED,
  montant_ttc NUMERIC(12,2) GENERATED ALWAYS AS (montant_ht + (montant_ht * taux_tva / 100.0)) STORED,
  reference_facture VARCHAR(100),
  payee BOOLEAN DEFAULT false,
  date_paiement DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. FACTURATION
CREATE TABLE factures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_facture VARCHAR(50) NOT NULL UNIQUE,
  chantier_id UUID NOT NULL REFERENCES chantiers(id) ON DELETE CASCADE,
  client VARCHAR(255) NOT NULL,
  client_ice VARCHAR(20),
  date_emission DATE NOT NULL DEFAULT CURRENT_DATE,
  echeance DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  montant_ht NUMERIC(12,2) NOT NULL DEFAULT 0,
  taux_tva NUMERIC(5,2) DEFAULT 20.00,
  montant_tva NUMERIC(12,2) GENERATED ALWAYS AS (montant_ht * taux_tva / 100.0) STORED,
  montant_ttc NUMERIC(12,2) GENERATED ALWAYS AS (montant_ht + (montant_ht * taux_tva / 100.0)) STORED,
  statut_paiement VARCHAR(20) DEFAULT 'en_attente' CHECK (statut_paiement IN ('payee','en_attente','en_retard','annulee')),
  date_paiement DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. STOCKS & MATÉRIAUX
CREATE TABLE materiaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  unite VARCHAR(20) NOT NULL DEFAULT 'U' CHECK (unite IN ('U','kg','t','m','m2','m3','L','sac','barre','palette','rouleau')),
  quantite_entree NUMERIC(12,2) DEFAULT 0,
  quantite_utilisee NUMERIC(12,2) DEFAULT 0,
  stock_restant NUMERIC(12,2) GENERATED ALWAYS AS (quantite_entree - quantite_utilisee) STORED,
  seuil_alerte NUMERIC(12,2) DEFAULT 0,
  prix_unitaire NUMERIC(10,2) DEFAULT 0,
  fournisseur_principal VARCHAR(255),
  emplacement VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. CONSOMMATION MATÉRIAUX SUR CHANTIERS
CREATE TABLE consommation_materiaux (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  materiau_id UUID NOT NULL REFERENCES materiaux(id) ON DELETE CASCADE,
  chantier_id UUID NOT NULL REFERENCES chantiers(id) ON DELETE CASCADE,
  quantite NUMERIC(12,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. MATÉRIEL & ENGINS
CREATE TABLE materiel_engins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('engin_lourd','vehicule_leger','outillage','equipement_special','bureau')),
  marque VARCHAR(100),
  modele VARCHAR(100),
  annee INTEGER,
  immatriculation VARCHAR(20),
  valeur_achat NUMERIC(12,2) DEFAULT 0,
  cout_journalier NUMERIC(10,2) DEFAULT 0,
  cout_horaire NUMERIC(10,2) DEFAULT 0,
  etat VARCHAR(20) DEFAULT 'disponible' CHECK (etat IN ('disponible','affecte','en_panne','maintenance','hors_service')),
  chantier_actuel_id UUID REFERENCES chantiers(id) ON DELETE SET NULL,
  date_derniere_maintenance DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. UTILISATION ENGINS SUR CHANTIERS
CREATE TABLE utilisation_engins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  engin_id UUID NOT NULL REFERENCES materiel_engins(id) ON DELETE CASCADE,
  chantier_id UUID NOT NULL REFERENCES chantiers(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  heures_utilisation NUMERIC(5,1) DEFAULT 0,
  cout_calcule NUMERIC(10,2) GENERATED ALWAYS AS (
    heures_utilisation * (SELECT cout_horaire FROM materiel_engins WHERE id = engin_id)
  ) STORED,
  conducteur_id UUID REFERENCES employes(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- VUES CALCULÉES (MATÉRIALISÉES)
-- ============================================================

-- VUE 1: KPIs du tableau de bord
CREATE VIEW vue_kpi_dashboard AS
SELECT
  (SELECT COALESCE(SUM(montant_ttc), 0) FROM factures) AS revenu_total,
  (SELECT COALESCE(SUM(montant_ttc), 0) FROM factures WHERE statut_paiement = 'payee') AS revenu_encaissé,
  (SELECT COALESCE(SUM(montant_ttc), 0) FROM factures WHERE statut_paiement IN ('en_attente','en_retard')) AS revenu_a_encaisser,
  (SELECT COALESCE(SUM(montant_ttc), 0) FROM depenses) AS depenses_total,
  (SELECT COALESCE(SUM(montant_ttc), 0) FROM depenses WHERE payee = true) AS depenses_payees,
  (SELECT COALESCE(SUM(cout_journalier_calcule), 0) FROM pointage) AS masse_salariale_totale;

-- VUE 2: Budget vs Réel par chantier
CREATE VIEW vue_budget_chantier AS
SELECT
  c.id,
  c.nom AS chantier_nom,
  c.budget_total,
  c.statut,
  c.avancement,
  COALESCE(SUM(d.montant_ttc), 0) AS depenses_reelles,
  COALESCE(SUM(f.montant_ttc), 0) AS recettes_facturees,
  COALESCE(SUM(f2.montant_ttc), 0) AS recettes_encaissees,
  CASE WHEN c.budget_total > 0
    THEN ROUND((COALESCE(SUM(d.montant_ttc), 0) / c.budget_total) * 100, 2)
    ELSE 0
  END AS pourcentage_depense,
  c.budget_total - COALESCE(SUM(d.montant_ttc), 0) AS reliquat_budget,
  COALESCE(SUM(f.montant_ttc), 0) - COALESCE(SUM(d.montant_ttc), 0) AS marge_nette
FROM chantiers c
LEFT JOIN depenses d ON d.chantier_id = c.id
LEFT JOIN factures f ON f.chantier_id = c.id
LEFT JOIN factures f2 ON f2.chantier_id = c.id AND f2.statut_paiement = 'payee'
GROUP BY c.id, c.nom, c.budget_total, c.statut, c.avancement;

-- VUE 3: Récapitulatif pointage par mois
CREATE VIEW vue_pointage_mensuel AS
SELECT
  e.id AS employe_id,
  e.nom || ' ' || e.prenom AS employe_nom,
  e.poste,
  DATE_TRUNC('month', p.date) AS mois,
  COUNT(*) FILTER (WHERE p.present = true) AS jours_presents,
  COUNT(*) FILTER (WHERE p.type_journee = 'absence_injustifiee') AS absences_injustifiees,
  SUM(p.heures_supplementaires) AS total_heures_sup,
  SUM(p.cout_journalier_calcule) AS cout_total,
  COUNT(DISTINCT p.chantier_id) AS chantiers_affectes
FROM employes e
JOIN pointage p ON p.employe_id = e.id
GROUP BY e.id, e.nom, e.prenom, e.poste, DATE_TRUNC('month', p.date);

-- VUE 4: Stock alertes
CREATE VIEW vue_stock_alertes AS
SELECT
  id,
  nom,
  unite,
  stock_restant,
  seuil_alerte,
  CASE
    WHEN stock_restant <= seuil_alerte THEN 'critique'
    WHEN stock_restant <= seuil_alerte * 2 THEN 'attention'
    ELSE 'normal'
  END AS niveau_alerte,
  prix_unitaire,
  (stock_restant * prix_unitaire) AS valeur_stock
FROM materiaux
WHERE stock_restant > 0 OR seuil_alerte > 0;

-- ============================================================
-- FONCTIONS & DÉCLENCHEURS (TRIGGERS)
-- ============================================================

-- Mise à jour automatique updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_chantiers_updated_at
  BEFORE UPDATE ON chantiers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_employes_updated_at
  BEFORE UPDATE ON employes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_factures_updated_at
  BEFORE UPDATE ON factures FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_materiaux_updated_at
  BEFORE UPDATE ON materiaux FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_materiel_updated_at
  BEFORE UPDATE ON materiel_engins FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Déduction automatique des quantités consommées du stock
CREATE OR REPLACE FUNCTION deduire_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE materiaux
  SET quantite_utilisee = quantite_utilisee + NEW.quantite
  WHERE id = NEW.materiau_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deduire_stock
  AFTER INSERT ON consommation_materiaux
  FOR EACH ROW EXECUTE FUNCTION deduire_stock();

-- Mise à jour état engin quand affecté à un chantier
CREATE OR REPLACE FUNCTION maj_etat_engin()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE materiel_engins
  SET etat = 'affecte', chantier_actuel_id = NEW.chantier_id
  WHERE id = NEW.engin_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_maj_etat_engin
  AFTER INSERT ON utilisation_engins
  FOR EACH ROW EXECUTE FUNCTION maj_etat_engin();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE entreprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE chantiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pointage ENABLE ROW LEVEL SECURITY;
ALTER TABLE depenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories_depenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fournisseurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE factures ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE consommation_materiaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiel_engins ENABLE ROW LEVEL SECURITY;
ALTER TABLE utilisation_engins ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde authentifié peut tout voir (à ajuster selon les besoins)
CREATE POLICY "Authentifiés peuvent tout lire"
  ON chantiers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authentifiés peuvent tout créer"
  ON chantiers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authentifiés peuvent tout modifier"
  ON chantiers FOR UPDATE TO authenticated USING (true);

-- Appliquer la même politique pour toutes les tables principales
DO $$
DECLARE
  tables_list TEXT[] := ARRAY['entreprises','employes','pointage','depenses',
    'categories_depenses','fournisseurs','factures','materiaux',
    'consommation_materiaux','materiel_engins','utilisation_engins'];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables_list
  LOOP
    EXECUTE format('CREATE POLICY "Authentifiés peuvent tout lire" ON %I FOR SELECT TO authenticated USING (true);', t);
    EXECUTE format('CREATE POLICY "Authentifiés peuvent tout créer" ON %I FOR INSERT TO authenticated WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "Authentifiés peuvent tout modifier" ON %I FOR UPDATE TO authenticated USING (true);', t);
  END LOOP;
END;
$$;

-- ============================================================
-- DONNÉES DE DÉMONSTRATION (OPTIONNEL)
-- ============================================================

-- Entreprise
INSERT INTO entreprises (nom, ice, rc, patente, cnss, adresse, ville, telephone, email)
VALUES ('AMSAN TRAVAUX PUBLICS SARL', '001234567890123', 'RC12345', 'PA67890', 'CNSS123456',
        '123 Avenue Mohammed V, Bureau 7', 'Casablanca', '+212 5XX-XXXXXX', 'contact@amsan-btp.ma');

-- Employés
INSERT INTO employes (matricule, nom, prenom, poste, categorie, salaire_brut_mensuel, cnss_numero, date_embauche, telephone)
VALUES
  ('EMP001', 'ALAOUI', 'Omar', 'Chef de chantier', 'chef_equipe', 15000, 'CNSS001', '2023-01-15', '+212 6XX-XXXX01'),
  ('EMP002', 'BENANI', 'Hassan', 'Maçon', 'ouvrier', 4500, 'CNSS002', '2023-02-01', '+212 6XX-XXXX02'),
  ('EMP003', 'CHRAIBI', 'Ahmed', 'Conducteur d''engins', 'conducteur', 6000, 'CNSS003', '2023-03-10', '+212 6XX-XXXX03'),
  ('EMP004', 'DAOUDI', 'Fatima', 'Comptable', 'comptable', 12000, 'CNSS004', '2023-01-20', '+212 6XX-XXXX04'),
  ('EMP005', 'EL FASSI', 'Youssef', 'Ingénieur', 'ingenieur', 25000, 'CNSS005', '2023-04-01', '+212 6XX-XXXX05'),
  ('EMP006', 'FAHMI', 'Karim', 'Chef d''équipe', 'chef_equipe', 11000, 'CNSS006', '2023-05-15', '+212 6XX-XXXX06'),
  ('EMP007', 'GHALI', 'Mohamed', 'Ouvrier polyvalent', 'ouvrier', 4000, 'CNSS007', '2023-06-01', '+212 6XX-XXXX07'),
  ('EMP008', 'HARIRI', 'Saida', 'Technicienne', 'technicien', 8000, 'CNSS008', '2023-07-10', '+212 6XX-XXXX08'),
  ('EMP009', 'IDRISSI', 'Khalid', 'Maçon', 'ouvrier', 5000, 'CNSS009', '2024-01-15', '+212 6XX-XXXX09'),
  ('EMP010', 'JAZOULI', 'Nadia', 'Directrice administrative', 'directeur', 35000, 'CNSS010', '2022-09-01', '+212 6XX-XXXX10');

-- Fournisseurs
INSERT INTO fournisseurs (nom, ice, telephone, email, ville)
VALUES
  ('MATÉRIAUX PLUS', 'ICE1111111', '+212 5XX-XXXX11', 'contact@materiauxplus.ma', 'Casablanca'),
  ('TRANSPORT RAPIDE', 'ICE2222222', '+212 5XX-XXXX12', 'info@transportrapide.ma', 'Rabat'),
  ('LOCATION ENGINS SARL', 'ICE3333333', '+212 5XX-XXXX13', 'location@engins.ma', 'Casablanca'),
  ('QUINCAILLERIE CENTRALE', 'ICE4444444', '+212 5XX-XXXX14', 'cmd@quincaillerie.ma', 'Marrakech'),
  ('SOUS-TRAITANCE BTP', 'ICE5555555', '+212 5XX-XXXX15', 'devis@soustraitance.ma', 'Tanger');

-- Chantiers
INSERT INTO chantiers (nom, client, description, ville, budget_total, budget_main_oeuvre, budget_materiaux, budget_transport, date_debut, date_fin_prevue, statut, avancement)
VALUES
  ('Résidence AL NOUR', 'Promoteur ABC', 'Construction R+3', 'Casablanca', 2500000, 800000, 1200000, 200000, '2024-01-15', '2024-09-30', 'en_cours', 65.00),
  ('Immeuble AL AMAL', 'Groupe XYZ', 'Fondations et gros œuvre', 'Rabat', 1800000, 600000, 900000, 150000, '2024-03-01', '2024-12-31', 'en_cours', 40.00),
  ('Villa AL FAYDA', 'M. Bennani', 'Villa individuelle', 'Marrakech', 950000, 300000, 500000, 80000, '2024-02-01', '2024-08-31', 'termine', 100.00),
  ('École AL MANAR', 'Ministère Éducation', 'Réhabilitation', 'Fès', 3200000, 1200000, 1500000, 300000, '2024-05-01', '2025-03-31', 'demarrage', 10.00),
  ('Siège BANQUE ATLAS', 'Banque Atlas', 'Bureaux R+5', 'Casablanca', 5000000, 1800000, 2500000, 400000, '2024-04-01', '2025-06-30', 'en_cours', 25.00);

-- Factures
INSERT INTO factures (numero_facture, chantier_id, client, montant_ht, taux_tva, date_emission, echeance, statut_paiement, date_paiement)
SELECT
  'FAC-2024-00' || i,
  c.id,
  c.client,
  ROUND(c.budget_total * (0.1 + random() * 0.4))::numeric(12,2),
  20.00,
  '2024-0' || (3 + i)::text || '-15',
  '2024-0' || (4 + i)::text || '-15',
  CASE WHEN random() < 0.5 THEN 'payee' WHEN random() < 0.8 THEN 'en_attente' ELSE 'en_retard' END,
  CASE WHEN random() < 0.5 THEN '2024-0' || (4 + i)::text || '-10' ELSE NULL END
FROM chantiers c
CROSS JOIN generate_series(1, 3) i;

-- Matériaux
INSERT INTO materiaux (nom, unite, quantite_entree, quantite_utilisee, seuil_alerte, prix_unitaire)
VALUES
  ('Ciment CPJ45', 'sac', 10000, 3200, 500, 65.00),
  ('Sable fin', 'm3', 500, 180, 50, 80.00),
  ('Gravier 15/25', 'm3', 400, 150, 40, 95.00),
  ('Fer à béton 12mm', 'barre', 8000, 2500, 200, 35.00),
  ('Fer à béton 8mm', 'barre', 6000, 1800, 200, 22.00),
  ('Parpaing 20x20x40', 'U', 15000, 5000, 1000, 7.50),
  ('Carreau ciment', 'm2', 2000, 450, 100, 120.00),
  ('Peinture mate (blanche)', 'L', 500, 120, 50, 45.00),
  ('Tuyau PVC 110mm', 'U', 300, 80, 30, 85.00),
  ('Câble électrique 6mm2', 'm', 2000, 600, 200, 8.50),
  ('Brique rouge', 'U', 20000, 8000, 1000, 4.00),
  ('Carreau céramique 40x40', 'm2', 1500, 300, 100, 85.00);

-- Engins
INSERT INTO materiel_engins (nom, type, marque, modele, immatriculation, valeur_achat, cout_journalier, cout_horaire, etat)
VALUES
  ('Pelle hydraulique', 'engin_lourd', 'Caterpillar', '320D', 'AA-100-1', 850000, 2500, 350, 'disponible'),
  ('Chargeuse', 'engin_lourd', 'Volvo', 'L120H', 'AA-100-2', 650000, 2000, 300, 'en_panne'),
  ('Camion benne 20T', 'engin_lourd', 'Mercedes', 'Actros 3335', 'BB-200-1', 550000, 1800, 250, 'disponible'),
  ('Camion benne 10T', 'engin_lourd', 'Renault', 'C-Series', 'BB-200-2', 380000, 1400, 200, 'affecte'),
  ('Compacteur', 'engin_lourd', 'Bomag', 'BW213', 'CC-300-1', 320000, 1200, 180, 'disponible'),
  ('Véhicule utilitaire', 'vehicule_leger', 'Peugeot', 'Partner', 'DD-400-1', 180000, 0, 0, 'disponible'),
  ('Bétonnière', 'outillage', 'Altrad', '350L', NULL, 25000, 150, 25, 'disponible'),
  ('Groupe électrogène', 'equipement_special', 'SDMO', 'T15K', NULL, 45000, 300, 45, 'disponible'),
  ('Marteau-piqueur', 'outillage', 'Atlas Copco', 'TEX 220PE', NULL, 18000, 100, 15, 'disponible'),
  ('Niveau laser', 'equipement_special', 'Leica', 'LNA10', NULL, 12000, 80, 12, 'disponible');
