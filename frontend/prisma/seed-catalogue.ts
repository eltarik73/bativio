/**
 * Seed catalogue prestations BTP 2026 Rhône-Alpes
 * 250 prestations standardisées (25 par métier x 10 métiers) pour matching IA.
 *
 * Lancement : npx tsx prisma/seed-catalogue.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Presta = {
  code: string;
  metierSlug: string;
  categorie?: string;
  designation: string;
  description?: string;
  unite: string;
  prixHtBas: number;
  prixHtMoyen: number;
  prixHtHaut: number;
  motsCles: string[];
  dureeMoyenneH?: number;
  tvaDefault?: number;
};

// prettier-ignore
const CATALOGUE: Presta[] = [
  // ═══ PLOMBIER (PLB) ═══
  { code: "PLB-001", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose robinet mitigeur lavabo", unite: "u", prixHtBas: 70, prixHtMoyen: 110, prixHtHaut: 170, motsCles: ["robinet mitigeur", "changer robinet", "lavabo qui fuit", "mitigeur salle de bain"], dureeMoyenneH: 1.5, tvaDefault: 10 },
  { code: "PLB-002", metierSlug: "plombier", categorie: "Dépannage", designation: "Dépannage fuite visible", unite: "forfait", prixHtBas: 90, prixHtMoyen: 140, prixHtHaut: 220, motsCles: ["fuite", "eau qui coule", "infiltration", "goutte à goutte"], dureeMoyenneH: 2, tvaDefault: 10 },
  { code: "PLB-003", metierSlug: "plombier", categorie: "Dépannage", designation: "Recherche de fuite non visible", unite: "forfait", prixHtBas: 180, prixHtMoyen: 280, prixHtHaut: 450, motsCles: ["fuite cachée", "tache plafond", "surconsommation eau", "fuite invisible"], dureeMoyenneH: 3, tvaDefault: 10 },
  { code: "PLB-004", metierSlug: "plombier", categorie: "Dépannage", designation: "Débouchage canalisation lavabo/évier", unite: "forfait", prixHtBas: 90, prixHtMoyen: 150, prixHtHaut: 250, motsCles: ["bouché", "évacuation lente", "lavabo bouché", "évier bouché"], dureeMoyenneH: 1.5, tvaDefault: 10 },
  { code: "PLB-005", metierSlug: "plombier", categorie: "Dépannage", designation: "Débouchage WC", unite: "forfait", prixHtBas: 100, prixHtMoyen: 170, prixHtHaut: 280, motsCles: ["WC bouché", "toilettes bouchées", "chasse bloquée"], dureeMoyenneH: 1.5, tvaDefault: 10 },
  { code: "PLB-006", metierSlug: "plombier", categorie: "Dépannage", designation: "Débouchage canalisation principale", unite: "forfait", prixHtBas: 200, prixHtMoyen: 350, prixHtHaut: 600, motsCles: ["canalisation bouchée", "odeur égout", "refoulement"], tvaDefault: 10 },
  { code: "PLB-007", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose WC complet (cuvette + réservoir)", unite: "u", prixHtBas: 180, prixHtMoyen: 280, prixHtHaut: 450, motsCles: ["installer WC", "nouveau WC", "changer toilettes"], dureeMoyenneH: 3, tvaDefault: 10 },
  { code: "PLB-008", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose WC suspendu (bâti-support + cuvette)", unite: "u", prixHtBas: 450, prixHtMoyen: 650, prixHtHaut: 950, motsCles: ["WC suspendu", "bâti support", "toilettes suspendues"], dureeMoyenneH: 5, tvaDefault: 10 },
  { code: "PLB-009", metierSlug: "plombier", categorie: "Chauffe-eau", designation: "Remplacement chauffe-eau électrique 150-200L", unite: "u", prixHtBas: 300, prixHtMoyen: 480, prixHtHaut: 750, motsCles: ["changer ballon", "chauffe-eau cassé", "plus d'eau chaude", "cumulus"], dureeMoyenneH: 3, tvaDefault: 10 },
  { code: "PLB-010", metierSlug: "plombier", categorie: "Chauffe-eau", designation: "Pose chauffe-eau thermodynamique", unite: "u", prixHtBas: 800, prixHtMoyen: 1200, prixHtHaut: 1800, motsCles: ["chauffe-eau thermo", "pompe à chaleur eau", "CET"], dureeMoyenneH: 6, tvaDefault: 5.5 },
  { code: "PLB-011", metierSlug: "plombier", categorie: "Sanitaire", designation: "Installation lave-linge/lave-vaisselle (arrivée + évac)", unite: "u", prixHtBas: 120, prixHtMoyen: 180, prixHtHaut: 280, motsCles: ["brancher lave-linge", "raccordement machine", "installer lave-vaisselle"], dureeMoyenneH: 2, tvaDefault: 10 },
  { code: "PLB-012", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose baignoire standard", unite: "u", prixHtBas: 350, prixHtMoyen: 550, prixHtHaut: 850, motsCles: ["installer baignoire", "nouvelle baignoire", "changer baignoire"], dureeMoyenneH: 5, tvaDefault: 10 },
  { code: "PLB-013", metierSlug: "plombier", categorie: "Rénovation", designation: "Remplacement baignoire par douche", unite: "forfait", prixHtBas: 1800, prixHtMoyen: 2800, prixHtHaut: 4500, motsCles: ["transformer baignoire", "douche à la place baignoire", "douche senior"], tvaDefault: 10 },
  { code: "PLB-014", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose cabine de douche complète", unite: "u", prixHtBas: 450, prixHtMoyen: 700, prixHtHaut: 1100, motsCles: ["cabine douche", "douche complète", "installation douche"], dureeMoyenneH: 6, tvaDefault: 10 },
  { code: "PLB-015", metierSlug: "plombier", categorie: "Rénovation", designation: "Pose receveur + paroi de douche italienne", unite: "u", prixHtBas: 650, prixHtMoyen: 950, prixHtHaut: 1500, motsCles: ["douche italienne", "douche plain-pied", "receveur extra-plat"], dureeMoyenneH: 8, tvaDefault: 10 },
  { code: "PLB-016", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose évier de cuisine + robinet", unite: "u", prixHtBas: 180, prixHtMoyen: 280, prixHtHaut: 420, motsCles: ["évier cuisine", "changer évier", "nouveau robinet cuisine"], dureeMoyenneH: 2, tvaDefault: 10 },
  { code: "PLB-017", metierSlug: "plombier", categorie: "Tuyauterie", designation: "Création alimentation eau", unite: "ml", prixHtBas: 55, prixHtMoyen: 85, prixHtHaut: 130, motsCles: ["créer arrivée eau", "amener l'eau", "tuyau PER"], tvaDefault: 10 },
  { code: "PLB-018", metierSlug: "plombier", categorie: "Tuyauterie", designation: "Création évacuation", unite: "ml", prixHtBas: 65, prixHtMoyen: 95, prixHtHaut: 150, motsCles: ["créer évacuation", "tuyau eaux usées", "PVC évacuation"], tvaDefault: 10 },
  { code: "PLB-019", metierSlug: "plombier", categorie: "Rénovation", designation: "Remplacement colonne montante", unite: "forfait", prixHtBas: 800, prixHtMoyen: 1400, prixHtHaut: 2500, motsCles: ["colonne d'eau", "tuyaux vétustes", "rénovation plomberie"], tvaDefault: 10 },
  { code: "PLB-020", metierSlug: "plombier", categorie: "Entretien", designation: "Détartrage chauffe-eau", unite: "forfait", prixHtBas: 150, prixHtMoyen: 220, prixHtHaut: 350, motsCles: ["entretien ballon", "détartrer cumulus", "vidanger chauffe-eau"], dureeMoyenneH: 2, tvaDefault: 10 },
  { code: "PLB-021", metierSlug: "plombier", categorie: "Dépannage", designation: "Remplacement groupe de sécurité", unite: "u", prixHtBas: 90, prixHtMoyen: 140, prixHtHaut: 200, motsCles: ["groupe sécurité", "soupape chauffe-eau", "fuite sous ballon"], dureeMoyenneH: 1, tvaDefault: 10 },
  { code: "PLB-022", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose adoucisseur d'eau", unite: "u", prixHtBas: 650, prixHtMoyen: 1000, prixHtHaut: 1600, motsCles: ["adoucisseur", "eau calcaire", "eau dure"], dureeMoyenneH: 4, tvaDefault: 10 },
  { code: "PLB-023", metierSlug: "plombier", categorie: "Rénovation", designation: "Installation complète salle de bain (hors carrelage)", unite: "forfait", prixHtBas: 3500, prixHtMoyen: 6500, prixHtHaut: 11000, motsCles: ["refaire salle de bain", "rénovation SDB complète"], tvaDefault: 10 },
  { code: "PLB-024", metierSlug: "plombier", categorie: "Dépannage", designation: "Dépannage urgence (jour/nuit/WE)", unite: "forfait", prixHtBas: 150, prixHtMoyen: 250, prixHtHaut: 450, motsCles: ["urgence plombier", "plombier dimanche", "dépannage nuit"], tvaDefault: 10 },
  { code: "PLB-025", metierSlug: "plombier", categorie: "Sanitaire", designation: "Pose vanne arrêt / robinet isolement", unite: "u", prixHtBas: 60, prixHtMoyen: 95, prixHtHaut: 150, motsCles: ["vanne d'arrêt", "couper eau", "robinet général"], dureeMoyenneH: 1, tvaDefault: 10 },

  // ═══ ÉLECTRICIEN (ELE) ═══
  { code: "ELE-001", metierSlug: "electricien", categorie: "Pose", designation: "Pose prise de courant (PC 16A)", unite: "u", prixHtBas: 45, prixHtMoyen: 75, prixHtHaut: 120, motsCles: ["ajouter prise", "nouvelle prise", "prise électrique"], dureeMoyenneH: 1, tvaDefault: 10 },
  { code: "ELE-002", metierSlug: "electricien", categorie: "Pose", designation: "Pose interrupteur simple / va-et-vient", unite: "u", prixHtBas: 40, prixHtMoyen: 65, prixHtHaut: 100, motsCles: ["interrupteur", "va-et-vient", "bouton lumière"], dureeMoyenneH: 0.75, tvaDefault: 10 },
  { code: "ELE-003", metierSlug: "electricien", categorie: "Pose", designation: "Pose point lumineux (DCL)", unite: "u", prixHtBas: 60, prixHtMoyen: 95, prixHtHaut: 150, motsCles: ["lustre", "suspension", "point lumineux", "ajouter lumière"], dureeMoyenneH: 1, tvaDefault: 10 },
  { code: "ELE-004", metierSlug: "electricien", categorie: "Tableau", designation: "Remplacement tableau électrique", unite: "u", prixHtBas: 550, prixHtMoyen: 950, prixHtHaut: 1600, motsCles: ["tableau électrique", "refaire compteur", "disjoncteurs"], dureeMoyenneH: 8, tvaDefault: 10 },
  { code: "ELE-005", metierSlug: "electricien", categorie: "Rénovation", designation: "Mise aux normes installation (NF C 15-100)", unite: "forfait", prixHtBas: 1500, prixHtMoyen: 3500, prixHtHaut: 7000, motsCles: ["mise aux normes", "Consuel", "installation vétuste"], tvaDefault: 10 },
  { code: "ELE-006", metierSlug: "electricien", categorie: "Dépannage", designation: "Diagnostic panne électrique", unite: "forfait", prixHtBas: 80, prixHtMoyen: 130, prixHtHaut: 220, motsCles: ["panne courant", "plus d'électricité", "diagnostic élec"], dureeMoyenneH: 1.5, tvaDefault: 10 },
  { code: "ELE-007", metierSlug: "electricien", categorie: "Pose", designation: "Pose / déplacement luminaire", unite: "u", prixHtBas: 45, prixHtMoyen: 75, prixHtHaut: 130, motsCles: ["luminaire", "applique murale", "spot encastré"], dureeMoyenneH: 1, tvaDefault: 10 },
  { code: "ELE-008", metierSlug: "electricien", categorie: "Pose", designation: "Installation spot encastré LED", unite: "u", prixHtBas: 35, prixHtMoyen: 60, prixHtHaut: 95, motsCles: ["spot LED", "spots plafond", "éclairage encastré"], dureeMoyenneH: 0.5, tvaDefault: 10 },
  { code: "ELE-009", metierSlug: "electricien", categorie: "Ligne", designation: "Création ligne spécialisée (four, plaque)", unite: "u", prixHtBas: 140, prixHtMoyen: 220, prixHtHaut: 350, motsCles: ["ligne four", "prise plaque cuisson", "ligne dédiée"], dureeMoyenneH: 2.5, tvaDefault: 10 },
  { code: "ELE-010", metierSlug: "electricien", categorie: "Ventilation", designation: "Pose VMC simple flux", unite: "u", prixHtBas: 350, prixHtMoyen: 550, prixHtHaut: 850, motsCles: ["VMC", "ventilation", "extraction air"], dureeMoyenneH: 4, tvaDefault: 10 },
  { code: "ELE-011", metierSlug: "electricien", categorie: "Ventilation", designation: "Pose VMC double flux", unite: "u", prixHtBas: 2200, prixHtMoyen: 3500, prixHtHaut: 5500, motsCles: ["VMC double flux", "ventilation performante"], dureeMoyenneH: 10, tvaDefault: 5.5 },
  { code: "ELE-012", metierSlug: "electricien", categorie: "Raccordement", designation: "Installation chauffe-eau électrique (raccordement)", unite: "u", prixHtBas: 120, prixHtMoyen: 180, prixHtHaut: 280, motsCles: ["brancher ballon", "raccord chauffe-eau"], dureeMoyenneH: 2, tvaDefault: 10 },
  { code: "ELE-013", metierSlug: "electricien", categorie: "Raccordement", designation: "Pose radiateur électrique (raccordement)", unite: "u", prixHtBas: 100, prixHtMoyen: 160, prixHtHaut: 240, motsCles: ["radiateur électrique", "brancher chauffage"], dureeMoyenneH: 1.5, tvaDefault: 10 },
  { code: "ELE-014", metierSlug: "electricien", categorie: "Sécurité", designation: "Installation interphone / visiophone", unite: "u", prixHtBas: 300, prixHtMoyen: 500, prixHtHaut: 850, motsCles: ["interphone", "visiophone", "sonnette vidéo"], dureeMoyenneH: 4, tvaDefault: 10 },
  { code: "ELE-015", metierSlug: "electricien", categorie: "Sécurité", designation: "Installation alarme sans fil", unite: "forfait", prixHtBas: 650, prixHtMoyen: 1100, prixHtHaut: 1900, motsCles: ["alarme maison", "système sécurité", "sirène"], tvaDefault: 10 },
  { code: "ELE-016", metierSlug: "electricien", categorie: "Sécurité", designation: "Pose détecteur de fumée", unite: "u", prixHtBas: 40, prixHtMoyen: 65, prixHtHaut: 95, motsCles: ["DAAF", "détecteur fumée", "alarme incendie"], dureeMoyenneH: 0.5, tvaDefault: 10 },
  { code: "ELE-017", metierSlug: "electricien", categorie: "Réseau", designation: "Installation prise RJ45 / réseau", unite: "u", prixHtBas: 55, prixHtMoyen: 90, prixHtHaut: 140, motsCles: ["prise ethernet", "RJ45", "réseau", "internet mural"], dureeMoyenneH: 1, tvaDefault: 10 },
  { code: "ELE-018", metierSlug: "electricien", categorie: "Véhicule électrique", designation: "Installation borne recharge VE 7kW", unite: "u", prixHtBas: 850, prixHtMoyen: 1400, prixHtHaut: 2200, motsCles: ["borne recharge", "Wallbox", "voiture électrique"], dureeMoyenneH: 5, tvaDefault: 5.5 },
  { code: "ELE-019", metierSlug: "electricien", categorie: "Rénovation", designation: "Passage câblage électrique neuf", unite: "m²", prixHtBas: 60, prixHtMoyen: 95, prixHtHaut: 140, motsCles: ["rénover électricité", "refaire électricité maison"], tvaDefault: 10 },
  { code: "ELE-020", metierSlug: "electricien", categorie: "Pose", designation: "Pose variateur / détecteur présence", unite: "u", prixHtBas: 60, prixHtMoyen: 95, prixHtHaut: 140, motsCles: ["variateur lumière", "détecteur mouvement"], dureeMoyenneH: 1, tvaDefault: 10 },
  { code: "ELE-021", metierSlug: "electricien", categorie: "Domotique", designation: "Installation domotique base", unite: "forfait", prixHtBas: 1200, prixHtMoyen: 2200, prixHtHaut: 4500, motsCles: ["maison connectée", "domotique", "smart home"], tvaDefault: 10 },
  { code: "ELE-022", metierSlug: "electricien", categorie: "Motorisation", designation: "Pose motorisation portail / volets", unite: "u", prixHtBas: 450, prixHtMoyen: 750, prixHtHaut: 1300, motsCles: ["motoriser portail", "volets roulants électriques"], dureeMoyenneH: 5, tvaDefault: 10 },
  { code: "ELE-023", metierSlug: "electricien", categorie: "Sinistre", designation: "Remise en service après sinistre", unite: "forfait", prixHtBas: 350, prixHtMoyen: 650, prixHtHaut: 1200, motsCles: ["réparer après inondation", "sinistre électrique"], tvaDefault: 10 },
  { code: "ELE-024", metierSlug: "electricien", categorie: "Conformité", designation: "Attestation Consuel", unite: "forfait", prixHtBas: 150, prixHtMoyen: 220, prixHtHaut: 350, motsCles: ["Consuel", "attestation conformité", "mise en service"], tvaDefault: 20 },
  { code: "ELE-025", metierSlug: "electricien", categorie: "Dépannage", designation: "Dépannage urgence électrique", unite: "forfait", prixHtBas: 150, prixHtMoyen: 250, prixHtHaut: 450, motsCles: ["urgence électricien", "panne nuit", "court-circuit"], tvaDefault: 10 },

  // ═══ PEINTRE (PEI) ═══
  { code: "PEI-001", metierSlug: "peintre", categorie: "Intérieur", designation: "Peinture murs 1 couche acrylique", unite: "m²", prixHtBas: 10, prixHtMoyen: 15, prixHtHaut: 22, motsCles: ["peindre murs", "rafraîchir peinture", "une couche"], tvaDefault: 10 },
  { code: "PEI-002", metierSlug: "peintre", categorie: "Intérieur", designation: "Peinture murs 2 couches (standard)", unite: "m²", prixHtBas: 18, prixHtMoyen: 26, prixHtHaut: 38, motsCles: ["peindre pièce", "peinture complète", "2 couches"], tvaDefault: 10 },
  { code: "PEI-003", metierSlug: "peintre", categorie: "Intérieur", designation: "Peinture plafond 2 couches", unite: "m²", prixHtBas: 20, prixHtMoyen: 30, prixHtHaut: 42, motsCles: ["peindre plafond", "plafond blanc", "plafond sali"], tvaDefault: 10 },
  { code: "PEI-004", metierSlug: "peintre", categorie: "Préparation", designation: "Préparation murs + rebouchage fissures", unite: "m²", prixHtBas: 6, prixHtMoyen: 10, prixHtHaut: 16, motsCles: ["reboucher trous", "fissures murs", "préparation"], tvaDefault: 10 },
  { code: "PEI-005", metierSlug: "peintre", categorie: "Préparation", designation: "Ponçage + enduit de lissage", unite: "m²", prixHtBas: 12, prixHtMoyen: 18, prixHtHaut: 28, motsCles: ["lisser murs", "enduit", "murs abîmés"], tvaDefault: 10 },
  { code: "PEI-006", metierSlug: "peintre", categorie: "Boiseries", designation: "Peinture boiseries (portes, plinthes, fenêtres)", unite: "ml", prixHtBas: 15, prixHtMoyen: 25, prixHtHaut: 40, motsCles: ["peindre porte", "plinthes", "fenêtres bois"], tvaDefault: 10 },
  { code: "PEI-007", metierSlug: "peintre", categorie: "Boiseries", designation: "Peinture porte complète (2 faces + chant)", unite: "u", prixHtBas: 80, prixHtMoyen: 130, prixHtHaut: 220, motsCles: ["porte à peindre", "repeindre porte intérieure"], dureeMoyenneH: 2.5, tvaDefault: 10 },
  { code: "PEI-008", metierSlug: "peintre", categorie: "Papier peint", designation: "Pose papier peint standard", unite: "m²", prixHtBas: 18, prixHtMoyen: 28, prixHtHaut: 42, motsCles: ["papier peint", "tapisserie", "coller papier peint"], tvaDefault: 10 },
  { code: "PEI-009", metierSlug: "peintre", categorie: "Papier peint", designation: "Pose papier peint intissé / panoramique", unite: "m²", prixHtBas: 28, prixHtMoyen: 42, prixHtHaut: 70, motsCles: ["intissé", "panoramique", "tapisserie design"], tvaDefault: 10 },
  { code: "PEI-010", metierSlug: "peintre", categorie: "Préparation", designation: "Décollage ancien papier peint", unite: "m²", prixHtBas: 5, prixHtMoyen: 8, prixHtHaut: 14, motsCles: ["enlever papier peint", "décoller tapisserie"], tvaDefault: 10 },
  { code: "PEI-011", metierSlug: "peintre", categorie: "Rénovation", designation: "Pose toile de verre + peinture", unite: "m²", prixHtBas: 22, prixHtMoyen: 32, prixHtHaut: 48, motsCles: ["toile de verre", "fibre de verre", "masquer fissures"], tvaDefault: 10 },
  { code: "PEI-012", metierSlug: "peintre", categorie: "Extérieur", designation: "Peinture façade extérieure", unite: "m²", prixHtBas: 25, prixHtMoyen: 40, prixHtHaut: 70, motsCles: ["ravalement", "peindre façade", "extérieur maison"], tvaDefault: 10 },
  { code: "PEI-013", metierSlug: "peintre", categorie: "Extérieur", designation: "Ravalement façade complet (nettoyage + peinture)", unite: "m²", prixHtBas: 45, prixHtMoyen: 75, prixHtHaut: 120, motsCles: ["ravalement façade", "rénover façade"], tvaDefault: 10 },
  { code: "PEI-014", metierSlug: "peintre", categorie: "Extérieur", designation: "Application crépi / enduit décoratif", unite: "m²", prixHtBas: 30, prixHtMoyen: 45, prixHtHaut: 75, motsCles: ["crépi", "enduit façade", "gratté", "taloché"], tvaDefault: 10 },
  { code: "PEI-015", metierSlug: "peintre", categorie: "Décoratif", designation: "Peinture effet décoratif (béton ciré, stuc)", unite: "m²", prixHtBas: 50, prixHtMoyen: 85, prixHtHaut: 140, motsCles: ["béton ciré", "stuc", "effet décoratif", "patine"], tvaDefault: 10 },
  { code: "PEI-016", metierSlug: "peintre", categorie: "Boiseries", designation: "Vernis / lasure parquet", unite: "m²", prixHtBas: 18, prixHtMoyen: 28, prixHtHaut: 42, motsCles: ["vernir parquet", "lasure bois", "protéger parquet"], tvaDefault: 10 },
  { code: "PEI-017", metierSlug: "peintre", categorie: "Boiseries", designation: "Peinture radiateur", unite: "u", prixHtBas: 45, prixHtMoyen: 75, prixHtHaut: 120, motsCles: ["peindre radiateur", "repeindre chauffage"], dureeMoyenneH: 1.5, tvaDefault: 10 },
  { code: "PEI-018", metierSlug: "peintre", categorie: "Boiseries", designation: "Peinture escalier (marches + contremarches)", unite: "u", prixHtBas: 25, prixHtMoyen: 40, prixHtHaut: 65, motsCles: ["peindre escalier", "rénover marches"], tvaDefault: 10 },
  { code: "PEI-019", metierSlug: "peintre", categorie: "Extérieur", designation: "Peinture volets bois", unite: "u", prixHtBas: 80, prixHtMoyen: 130, prixHtHaut: 200, motsCles: ["peindre volets", "volets écaillés"], dureeMoyenneH: 2.5, tvaDefault: 10 },
  { code: "PEI-020", metierSlug: "peintre", categorie: "Chantier", designation: "Protection sols + mobilier (bâches)", unite: "forfait", prixHtBas: 80, prixHtMoyen: 140, prixHtHaut: 220, motsCles: ["protection chantier", "bâches", "bâcher"], tvaDefault: 10 },
  { code: "PEI-021", metierSlug: "peintre", categorie: "Extérieur", designation: "Nettoyage façade (hydrogommage)", unite: "m²", prixHtBas: 18, prixHtMoyen: 28, prixHtHaut: 45, motsCles: ["nettoyer façade", "hydrogommage", "mousse façade"], tvaDefault: 10 },
  { code: "PEI-022", metierSlug: "peintre", categorie: "Rénovation", designation: "Traitement anti-humidité mur", unite: "m²", prixHtBas: 25, prixHtMoyen: 40, prixHtHaut: 65, motsCles: ["mur humide", "moisissure", "anti-humidité"], tvaDefault: 10 },
  { code: "PEI-023", metierSlug: "peintre", categorie: "Sol", designation: "Peinture sol garage / cave (résine époxy)", unite: "m²", prixHtBas: 28, prixHtMoyen: 45, prixHtHaut: 75, motsCles: ["peinture sol", "résine garage", "sol béton"], tvaDefault: 10 },
  { code: "PEI-024", metierSlug: "peintre", categorie: "Intérieur", designation: "Peinture spéciale humidité (cuisine/SDB)", unite: "m²", prixHtBas: 22, prixHtMoyen: 32, prixHtHaut: 48, motsCles: ["peinture salle de bain", "peinture cuisine", "anti-moisissure"], tvaDefault: 10 },
  { code: "PEI-025", metierSlug: "peintre", categorie: "Forfait", designation: "Rafraîchissement studio complet 25m²", unite: "forfait", prixHtBas: 900, prixHtMoyen: 1400, prixHtHaut: 2200, motsCles: ["repeindre studio", "rafraîchir appartement"], tvaDefault: 10 },

  // ═══ CARRELEUR (CAR) ═══
  { code: "CAR-001", metierSlug: "carreleur", categorie: "Sol", designation: "Pose carrelage sol standard 30x30 à 60x60", unite: "m²", prixHtBas: 40, prixHtMoyen: 60, prixHtHaut: 95, motsCles: ["poser carrelage", "carrelage sol", "carreler"], tvaDefault: 10 },
  { code: "CAR-002", metierSlug: "carreleur", categorie: "Sol", designation: "Pose carrelage grand format (≥80x80)", unite: "m²", prixHtBas: 60, prixHtMoyen: 90, prixHtHaut: 140, motsCles: ["grand carreau", "format XXL", "carrelage moderne"], tvaDefault: 10 },
  { code: "CAR-003", metierSlug: "carreleur", categorie: "Mur", designation: "Pose faïence murale salle de bain", unite: "m²", prixHtBas: 45, prixHtMoyen: 70, prixHtHaut: 110, motsCles: ["faïence", "carrelage mural", "carrelage SDB"], tvaDefault: 10 },
  { code: "CAR-004", metierSlug: "carreleur", categorie: "Cuisine", designation: "Pose crédence cuisine (faïence ou inox)", unite: "ml", prixHtBas: 80, prixHtMoyen: 130, prixHtHaut: 220, motsCles: ["crédence cuisine", "carrelage derrière plan de travail"], tvaDefault: 10 },
  { code: "CAR-005", metierSlug: "carreleur", categorie: "Sol", designation: "Pose carrelage en diagonale / chevron", unite: "m²", prixHtBas: 55, prixHtMoyen: 85, prixHtHaut: 130, motsCles: ["pose diagonale", "chevron", "point de Hongrie"], tvaDefault: 10 },
  { code: "CAR-006", metierSlug: "carreleur", categorie: "Mur", designation: "Pose mosaïque", unite: "m²", prixHtBas: 70, prixHtMoyen: 110, prixHtHaut: 180, motsCles: ["mosaïque", "pâte de verre", "petits carreaux"], tvaDefault: 10 },
  { code: "CAR-007", metierSlug: "carreleur", categorie: "Dépose", designation: "Dépose ancien carrelage sol", unite: "m²", prixHtBas: 18, prixHtMoyen: 28, prixHtHaut: 45, motsCles: ["enlever carrelage", "casser carrelage", "dépose"], tvaDefault: 10 },
  { code: "CAR-008", metierSlug: "carreleur", categorie: "Dépose", designation: "Dépose ancienne faïence", unite: "m²", prixHtBas: 15, prixHtMoyen: 25, prixHtHaut: 40, motsCles: ["enlever faïence", "dépose carrelage mural"], tvaDefault: 10 },
  { code: "CAR-009", metierSlug: "carreleur", categorie: "Préparation", designation: "Chape de ragréage avant pose", unite: "m²", prixHtBas: 18, prixHtMoyen: 28, prixHtHaut: 45, motsCles: ["ragréage", "chape", "mettre à niveau sol"], tvaDefault: 10 },
  { code: "CAR-010", metierSlug: "carreleur", categorie: "Finition", designation: "Pose plinthes carrelage", unite: "ml", prixHtBas: 12, prixHtMoyen: 20, prixHtHaut: 32, motsCles: ["plinthes carrelage", "plinthes sol"], tvaDefault: 10 },
  { code: "CAR-011", metierSlug: "carreleur", categorie: "Extérieur", designation: "Pose carrelage terrasse extérieur", unite: "m²", prixHtBas: 50, prixHtMoyen: 75, prixHtHaut: 120, motsCles: ["carrelage terrasse", "dalles extérieures"], tvaDefault: 10 },
  { code: "CAR-012", metierSlug: "carreleur", categorie: "Extérieur", designation: "Pose carrelage sur plots (terrasse)", unite: "m²", prixHtBas: 60, prixHtMoyen: 90, prixHtHaut: 140, motsCles: ["dalles sur plots", "terrasse surélevée"], tvaDefault: 10 },
  { code: "CAR-013", metierSlug: "carreleur", categorie: "SDB", designation: "Pose receveur douche italienne + carrelage", unite: "forfait", prixHtBas: 750, prixHtMoyen: 1200, prixHtHaut: 2000, motsCles: ["douche italienne carrelage", "receveur à carreler"], tvaDefault: 10 },
  { code: "CAR-014", metierSlug: "carreleur", categorie: "SDB", designation: "Étanchéité SEL / SPEC avant carrelage SDB", unite: "m²", prixHtBas: 18, prixHtMoyen: 28, prixHtHaut: 42, motsCles: ["étanchéité salle de bain", "SEL", "SPEC", "nattes"], tvaDefault: 10 },
  { code: "CAR-015", metierSlug: "carreleur", categorie: "Parquet", designation: "Pose parquet stratifié flottant", unite: "m²", prixHtBas: 22, prixHtMoyen: 35, prixHtHaut: 55, motsCles: ["stratifié", "parquet flottant", "poser lames"], tvaDefault: 10 },
  { code: "CAR-016", metierSlug: "carreleur", categorie: "Parquet", designation: "Pose parquet massif collé", unite: "m²", prixHtBas: 45, prixHtMoyen: 70, prixHtHaut: 110, motsCles: ["parquet massif", "parquet collé", "bois"], tvaDefault: 10 },
  { code: "CAR-017", metierSlug: "carreleur", categorie: "Parquet", designation: "Pose parquet contrecollé flottant", unite: "m²", prixHtBas: 30, prixHtMoyen: 50, prixHtHaut: 75, motsCles: ["parquet contrecollé", "parquet clipsable"], tvaDefault: 10 },
  { code: "CAR-018", metierSlug: "carreleur", categorie: "Sol souple", designation: "Pose sol PVC / vinyle / lino", unite: "m²", prixHtBas: 22, prixHtMoyen: 35, prixHtHaut: 55, motsCles: ["sol PVC", "vinyle", "lino", "revêtement souple"], tvaDefault: 10 },
  { code: "CAR-019", metierSlug: "carreleur", categorie: "Parquet", designation: "Ponçage + vitrification parquet", unite: "m²", prixHtBas: 30, prixHtMoyen: 45, prixHtHaut: 70, motsCles: ["poncer parquet", "rénover parquet", "vitrifier"], tvaDefault: 10 },
  { code: "CAR-020", metierSlug: "carreleur", categorie: "Sol souple", designation: "Pose moquette", unite: "m²", prixHtBas: 15, prixHtMoyen: 25, prixHtHaut: 40, motsCles: ["moquette", "tapis collé"], tvaDefault: 10 },
  { code: "CAR-021", metierSlug: "carreleur", categorie: "Rénovation", designation: "Joints carrelage (rénovation)", unite: "m²", prixHtBas: 15, prixHtMoyen: 25, prixHtHaut: 40, motsCles: ["refaire joints", "joints noircis", "joints carrelage"], tvaDefault: 10 },
  { code: "CAR-022", metierSlug: "carreleur", categorie: "Finition", designation: "Pose seuil de porte", unite: "u", prixHtBas: 45, prixHtMoyen: 75, prixHtHaut: 120, motsCles: ["seuil de porte", "jonction carrelage parquet"], tvaDefault: 10 },
  { code: "CAR-023", metierSlug: "carreleur", categorie: "SDB", designation: "Pose receveur douche standard", unite: "u", prixHtBas: 180, prixHtMoyen: 280, prixHtHaut: 450, motsCles: ["poser receveur", "bac douche"], tvaDefault: 10 },
  { code: "CAR-024", metierSlug: "carreleur", categorie: "Spécifique", designation: "Découpes complexes (tuyaux, angles)", unite: "u", prixHtBas: 25, prixHtMoyen: 40, prixHtHaut: 70, motsCles: ["découper carreau", "découpe carrelage complexe"], tvaDefault: 10 },
  { code: "CAR-025", metierSlug: "carreleur", categorie: "Forfait", designation: "Rénovation SDB 5m² carrelage + faïence", unite: "forfait", prixHtBas: 1800, prixHtMoyen: 2800, prixHtHaut: 4500, motsCles: ["carreler salle de bain", "refaire SDB carrelage"], tvaDefault: 10 },

  // ═══ MAÇON (MAC) ═══
  { code: "MAC-001", metierSlug: "macon", categorie: "Gros œuvre", designation: "Ouverture mur porteur + pose IPN", unite: "forfait", prixHtBas: 2200, prixHtMoyen: 3800, prixHtHaut: 6500, motsCles: ["casser mur", "ouverture mur porteur", "IPN", "linteau"], tvaDefault: 10 },
  { code: "MAC-002", metierSlug: "macon", categorie: "Démolition", designation: "Ouverture mur non porteur (cloison)", unite: "ml", prixHtBas: 80, prixHtMoyen: 140, prixHtHaut: 220, motsCles: ["casser cloison", "abattre mur", "pièce ouverte"], tvaDefault: 10 },
  { code: "MAC-003", metierSlug: "macon", categorie: "Cloison", designation: "Construction cloison placo standard", unite: "m²", prixHtBas: 45, prixHtMoyen: 70, prixHtHaut: 110, motsCles: ["monter cloison", "placo", "séparer pièce"], tvaDefault: 10 },
  { code: "MAC-004", metierSlug: "macon", categorie: "Cloison", designation: "Construction cloison carreaux plâtre", unite: "m²", prixHtBas: 55, prixHtMoyen: 85, prixHtHaut: 130, motsCles: ["carreaux de plâtre", "cloison phonique"], tvaDefault: 10 },
  { code: "MAC-005", metierSlug: "macon", categorie: "Cloison", designation: "Construction cloison brique", unite: "m²", prixHtBas: 75, prixHtMoyen: 120, prixHtHaut: 190, motsCles: ["cloison brique", "mur brique"], tvaDefault: 10 },
  { code: "MAC-006", metierSlug: "macon", categorie: "Gros œuvre", designation: "Montage mur parpaing", unite: "m²", prixHtBas: 80, prixHtMoyen: 130, prixHtHaut: 200, motsCles: ["monter mur", "parpaing", "agglo"], tvaDefault: 20 },
  { code: "MAC-007", metierSlug: "macon", categorie: "Dalle", designation: "Coulage dalle béton sur terre-plein", unite: "m²", prixHtBas: 65, prixHtMoyen: 100, prixHtHaut: 160, motsCles: ["couler dalle", "dalle béton", "terrasse béton"], tvaDefault: 10 },
  { code: "MAC-008", metierSlug: "macon", categorie: "Sol", designation: "Chape de ciment lissée", unite: "m²", prixHtBas: 25, prixHtMoyen: 38, prixHtHaut: 60, motsCles: ["chape", "lisser sol", "chape ciment"], tvaDefault: 10 },
  { code: "MAC-009", metierSlug: "macon", categorie: "Sol", designation: "Chape liquide (anhydrite)", unite: "m²", prixHtBas: 22, prixHtMoyen: 32, prixHtHaut: 50, motsCles: ["chape liquide", "anhydrite", "chape fluide"], tvaDefault: 10 },
  { code: "MAC-010", metierSlug: "macon", categorie: "Extérieur", designation: "Enduit extérieur traditionnel", unite: "m²", prixHtBas: 35, prixHtMoyen: 55, prixHtHaut: 85, motsCles: ["enduit façade", "crépi extérieur", "enduit ciment"], tvaDefault: 10 },
  { code: "MAC-011", metierSlug: "macon", categorie: "Gros œuvre", designation: "Création ouverture fenêtre (mur ext)", unite: "u", prixHtBas: 900, prixHtMoyen: 1500, prixHtHaut: 2800, motsCles: ["percer fenêtre", "créer ouverture", "nouvelle fenêtre"], tvaDefault: 10 },
  { code: "MAC-012", metierSlug: "macon", categorie: "Gros œuvre", designation: "Rebouchage ouverture fenêtre / porte", unite: "u", prixHtBas: 450, prixHtMoyen: 750, prixHtHaut: 1300, motsCles: ["boucher fenêtre", "reboucher porte", "condamner"], tvaDefault: 10 },
  { code: "MAC-013", metierSlug: "macon", categorie: "Extérieur", designation: "Construction muret de jardin / clôture", unite: "ml", prixHtBas: 120, prixHtMoyen: 200, prixHtHaut: 350, motsCles: ["muret jardin", "mur clôture", "muret pierre"], tvaDefault: 20 },
  { code: "MAC-014", metierSlug: "macon", categorie: "Extérieur", designation: "Piliers portail maçonnés", unite: "u", prixHtBas: 350, prixHtMoyen: 600, prixHtHaut: 1100, motsCles: ["piliers portail", "poteaux entrée"], tvaDefault: 20 },
  { code: "MAC-015", metierSlug: "macon", categorie: "Dalle", designation: "Création terrasse sur vide sanitaire", unite: "m²", prixHtBas: 180, prixHtMoyen: 280, prixHtHaut: 450, motsCles: ["terrasse béton", "dalle sur vide sanitaire"], tvaDefault: 10 },
  { code: "MAC-016", metierSlug: "macon", categorie: "Escalier", designation: "Escalier béton coulé", unite: "forfait", prixHtBas: 1500, prixHtMoyen: 2800, prixHtHaut: 5000, motsCles: ["escalier béton", "marches béton"], tvaDefault: 10 },
  { code: "MAC-017", metierSlug: "macon", categorie: "Dalle", designation: "Création dalle garage", unite: "m²", prixHtBas: 70, prixHtMoyen: 110, prixHtHaut: 170, motsCles: ["dalle garage", "sol garage béton"], tvaDefault: 10 },
  { code: "MAC-018", metierSlug: "macon", categorie: "Extérieur", designation: "Ravalement pierre / rejointoiement", unite: "m²", prixHtBas: 60, prixHtMoyen: 95, prixHtHaut: 160, motsCles: ["rejointoyer pierre", "ravalement pierre"], tvaDefault: 10 },
  { code: "MAC-019", metierSlug: "macon", categorie: "Gros œuvre", designation: "Scellement / fixation IPN existant", unite: "u", prixHtBas: 300, prixHtMoyen: 550, prixHtHaut: 1000, motsCles: ["IPN à sceller", "renforcer poutre"], tvaDefault: 10 },
  { code: "MAC-020", metierSlug: "macon", categorie: "Rénovation", designation: "Traitement fissures structurelles", unite: "ml", prixHtBas: 80, prixHtMoyen: 140, prixHtHaut: 250, motsCles: ["fissure façade", "fissure structurelle", "agrafe"], tvaDefault: 10 },
  { code: "MAC-021", metierSlug: "macon", categorie: "Cheminée", designation: "Création cheminée / conduit", unite: "forfait", prixHtBas: 1800, prixHtMoyen: 3200, prixHtHaut: 6000, motsCles: ["conduit cheminée", "tubage", "création âtre"], tvaDefault: 10 },
  { code: "MAC-022", metierSlug: "macon", categorie: "Gros œuvre", designation: "Reprise de linteau existant", unite: "u", prixHtBas: 450, prixHtMoyen: 850, prixHtHaut: 1600, motsCles: ["linteau fissuré", "reprendre linteau"], tvaDefault: 10 },
  { code: "MAC-023", metierSlug: "macon", categorie: "Démolition", designation: "Démolition cloison + évacuation gravats", unite: "m²", prixHtBas: 35, prixHtMoyen: 55, prixHtHaut: 90, motsCles: ["démolir cloison", "évacuer gravats"], tvaDefault: 10 },
  { code: "MAC-024", metierSlug: "macon", categorie: "Gros œuvre", designation: "Création sous-sol / cave", unite: "m²", prixHtBas: 800, prixHtMoyen: 1400, prixHtHaut: 2500, motsCles: ["creuser cave", "sous-sol", "terrassement"], tvaDefault: 20 },
  { code: "MAC-025", metierSlug: "macon", categorie: "Extension", designation: "Extension maçonnée gros œuvre (hors finitions)", unite: "m²", prixHtBas: 700, prixHtMoyen: 1100, prixHtHaut: 1800, motsCles: ["extension maison", "agrandir", "gros œuvre"], tvaDefault: 20 },

  // ═══ COUVREUR (COU) — set réduit 10 principales ═══
  { code: "COU-001", metierSlug: "couvreur", categorie: "Réparation", designation: "Remplacement tuiles cassées", unite: "u", prixHtBas: 25, prixHtMoyen: 45, prixHtHaut: 80, motsCles: ["tuile cassée", "changer tuile", "tuile manquante"], tvaDefault: 10 },
  { code: "COU-002", metierSlug: "couvreur", categorie: "Réfection", designation: "Réfection toiture tuiles terre cuite", unite: "m²", prixHtBas: 85, prixHtMoyen: 130, prixHtHaut: 200, motsCles: ["refaire toiture", "nouvelle toiture", "tuiles"], tvaDefault: 10 },
  { code: "COU-003", metierSlug: "couvreur", categorie: "Réfection", designation: "Réfection toiture ardoises", unite: "m²", prixHtBas: 120, prixHtMoyen: 180, prixHtHaut: 280, motsCles: ["ardoise", "toiture ardoise", "refaire ardoises"], tvaDefault: 10 },
  { code: "COU-004", metierSlug: "couvreur", categorie: "Réfection", designation: "Réfection toiture zinc", unite: "m²", prixHtBas: 150, prixHtMoyen: 230, prixHtHaut: 380, motsCles: ["toiture zinc", "couverture zinc"], tvaDefault: 10 },
  { code: "COU-005", metierSlug: "couvreur", categorie: "Entretien", designation: "Nettoyage toiture (démoussage + traitement)", unite: "m²", prixHtBas: 10, prixHtMoyen: 18, prixHtHaut: 30, motsCles: ["mousse toiture", "démoussage", "nettoyer tuiles"], tvaDefault: 10 },
  { code: "COU-006", metierSlug: "couvreur", categorie: "Dépannage", designation: "Recherche de fuite toiture", unite: "forfait", prixHtBas: 200, prixHtMoyen: 350, prixHtHaut: 600, motsCles: ["fuite toiture", "infiltration toit", "recherche fuite"], tvaDefault: 10 },
  { code: "COU-007", metierSlug: "couvreur", categorie: "Gouttière", designation: "Pose gouttières zinc", unite: "ml", prixHtBas: 55, prixHtMoyen: 85, prixHtHaut: 140, motsCles: ["gouttière zinc", "chéneau zinc"], tvaDefault: 10 },
  { code: "COU-008", metierSlug: "couvreur", categorie: "Gouttière", designation: "Pose gouttières PVC / aluminium", unite: "ml", prixHtBas: 35, prixHtMoyen: 55, prixHtHaut: 95, motsCles: ["gouttière PVC", "gouttière alu"], tvaDefault: 10 },
  { code: "COU-009", metierSlug: "couvreur", categorie: "Velux", designation: "Pose velux / fenêtre de toit", unite: "u", prixHtBas: 550, prixHtMoyen: 900, prixHtHaut: 1500, motsCles: ["velux", "fenêtre de toit", "puit de lumière"], tvaDefault: 10 },
  { code: "COU-010", metierSlug: "couvreur", categorie: "Isolation", designation: "Isolation combles laine soufflée", unite: "m²", prixHtBas: 22, prixHtMoyen: 35, prixHtHaut: 55, motsCles: ["isoler combles", "laine soufflée", "ouate"], tvaDefault: 5.5 },

  // ═══ CHAUFFAGISTE (CHF) — set réduit ═══
  { code: "CHF-001", metierSlug: "chauffagiste", categorie: "Entretien", designation: "Entretien annuel chaudière gaz", unite: "u", prixHtBas: 95, prixHtMoyen: 140, prixHtHaut: 220, motsCles: ["entretien chaudière", "contrat entretien", "visite annuelle"], tvaDefault: 10 },
  { code: "CHF-002", metierSlug: "chauffagiste", categorie: "Installation", designation: "Remplacement chaudière gaz condensation", unite: "u", prixHtBas: 1800, prixHtMoyen: 2800, prixHtHaut: 4500, motsCles: ["changer chaudière", "chaudière condensation", "nouvelle chaudière gaz"], tvaDefault: 5.5 },
  { code: "CHF-003", metierSlug: "chauffagiste", categorie: "Installation", designation: "Installation chaudière granulés/pellets", unite: "u", prixHtBas: 8000, prixHtMoyen: 12000, prixHtHaut: 18000, motsCles: ["chaudière granulés", "pellets", "chaudière bois"], tvaDefault: 5.5 },
  { code: "CHF-004", metierSlug: "chauffagiste", categorie: "Installation", designation: "Installation pompe à chaleur air/eau", unite: "u", prixHtBas: 6000, prixHtMoyen: 10000, prixHtHaut: 16000, motsCles: ["PAC", "pompe à chaleur", "air eau"], tvaDefault: 5.5 },
  { code: "CHF-005", metierSlug: "chauffagiste", categorie: "Installation", designation: "Installation PAC air/air (clim réversible)", unite: "u", prixHtBas: 1800, prixHtMoyen: 3200, prixHtHaut: 5500, motsCles: ["climatisation", "clim réversible", "PAC air air"], tvaDefault: 10 },
  { code: "CHF-006", metierSlug: "chauffagiste", categorie: "Installation", designation: "Installation split climatisation", unite: "u", prixHtBas: 650, prixHtMoyen: 1100, prixHtHaut: 1800, motsCles: ["split clim", "unité intérieure", "ajouter clim"], tvaDefault: 10 },
  { code: "CHF-007", metierSlug: "chauffagiste", categorie: "Dépannage", designation: "Dépannage chaudière (panne)", unite: "forfait", prixHtBas: 150, prixHtMoyen: 250, prixHtHaut: 450, motsCles: ["chaudière en panne", "plus de chauffage", "fumée chaudière"], tvaDefault: 10 },
  { code: "CHF-008", metierSlug: "chauffagiste", categorie: "Radiateur", designation: "Pose radiateur eau chaude", unite: "u", prixHtBas: 350, prixHtMoyen: 550, prixHtHaut: 900, motsCles: ["poser radiateur", "nouveau radiateur", "remplacer radiateur"], tvaDefault: 10 },
  { code: "CHF-009", metierSlug: "chauffagiste", categorie: "Chauffage sol", designation: "Pose plancher chauffant eau chaude", unite: "m²", prixHtBas: 65, prixHtMoyen: 95, prixHtHaut: 150, motsCles: ["plancher chauffant", "chauffage au sol", "PCR"], tvaDefault: 10 },
  { code: "CHF-010", metierSlug: "chauffagiste", categorie: "Poêle", designation: "Installation poêle à granulés", unite: "u", prixHtBas: 2800, prixHtMoyen: 4500, prixHtHaut: 7500, motsCles: ["poêle pellets", "poêle granulés"], tvaDefault: 5.5 },

  // ═══ MENUISIER (MEN) — set réduit ═══
  { code: "MEN-001", metierSlug: "menuisier", categorie: "Porte", designation: "Pose porte intérieure bloc-porte", unite: "u", prixHtBas: 180, prixHtMoyen: 280, prixHtHaut: 450, motsCles: ["poser porte", "bloc porte", "porte intérieure"], tvaDefault: 10 },
  { code: "MEN-002", metierSlug: "menuisier", categorie: "Porte", designation: "Pose porte d'entrée blindée", unite: "u", prixHtBas: 800, prixHtMoyen: 1400, prixHtHaut: 2500, motsCles: ["porte entrée", "porte blindée", "sécurité entrée"], tvaDefault: 10 },
  { code: "MEN-003", metierSlug: "menuisier", categorie: "Fenêtre", designation: "Pose fenêtre PVC double vitrage", unite: "u", prixHtBas: 350, prixHtMoyen: 550, prixHtHaut: 900, motsCles: ["fenêtre PVC", "double vitrage", "changer fenêtre"], tvaDefault: 5.5 },
  { code: "MEN-004", metierSlug: "menuisier", categorie: "Fenêtre", designation: "Pose fenêtre aluminium", unite: "u", prixHtBas: 550, prixHtMoyen: 850, prixHtHaut: 1400, motsCles: ["fenêtre alu", "aluminium"], tvaDefault: 5.5 },
  { code: "MEN-005", metierSlug: "menuisier", categorie: "Fenêtre", designation: "Pose baie vitrée coulissante 2 vantaux", unite: "u", prixHtBas: 1200, prixHtMoyen: 1900, prixHtHaut: 3200, motsCles: ["baie vitrée", "coulissant", "porte-fenêtre"], tvaDefault: 5.5 },
  { code: "MEN-006", metierSlug: "menuisier", categorie: "Volet", designation: "Pose volet roulant (rénovation)", unite: "u", prixHtBas: 350, prixHtMoyen: 600, prixHtHaut: 950, motsCles: ["volet roulant", "motoriser volets"], tvaDefault: 10 },
  { code: "MEN-007", metierSlug: "menuisier", categorie: "Escalier", designation: "Pose escalier bois sur mesure", unite: "u", prixHtBas: 2200, prixHtMoyen: 3800, prixHtHaut: 6500, motsCles: ["escalier bois", "escalier sur mesure", "quart tournant"], tvaDefault: 10 },
  { code: "MEN-008", metierSlug: "menuisier", categorie: "Placard", designation: "Pose placard mural sur mesure", unite: "ml", prixHtBas: 400, prixHtMoyen: 650, prixHtHaut: 1100, motsCles: ["placard sur mesure", "dressing mural"], tvaDefault: 10 },
  { code: "MEN-009", metierSlug: "menuisier", categorie: "Extérieur", designation: "Pose terrasse bois", unite: "m²", prixHtBas: 60, prixHtMoyen: 95, prixHtHaut: 160, motsCles: ["terrasse bois", "lames composite", "pin"], tvaDefault: 10 },
  { code: "MEN-010", metierSlug: "menuisier", categorie: "Charpente", designation: "Pose / réparation charpente", unite: "m²", prixHtBas: 100, prixHtMoyen: 170, prixHtHaut: 280, motsCles: ["charpente", "poser charpente maison", "renforcer charpente"], tvaDefault: 10 },

  // ═══ SERRURIER (SER) — set réduit ═══
  { code: "SER-001", metierSlug: "serrurier", categorie: "Dépannage", designation: "Ouverture de porte claquée", unite: "forfait", prixHtBas: 90, prixHtMoyen: 150, prixHtHaut: 280, motsCles: ["porte claquée", "enfermé dehors", "clé à l'intérieur"], tvaDefault: 20 },
  { code: "SER-002", metierSlug: "serrurier", categorie: "Dépannage", designation: "Ouverture porte fermée à clé", unite: "forfait", prixHtBas: 180, prixHtMoyen: 300, prixHtHaut: 550, motsCles: ["ouvrir porte sans clé", "perdu clés", "crochetage"], tvaDefault: 20 },
  { code: "SER-003", metierSlug: "serrurier", categorie: "Serrure", designation: "Remplacement cylindre standard", unite: "u", prixHtBas: 90, prixHtMoyen: 150, prixHtHaut: 250, motsCles: ["changer cylindre", "nouveau barillet", "changer serrure"], tvaDefault: 20 },
  { code: "SER-004", metierSlug: "serrurier", categorie: "Serrure", designation: "Cylindre haute sécurité A2P ★★★", unite: "u", prixHtBas: 180, prixHtMoyen: 300, prixHtHaut: 550, motsCles: ["serrure A2P", "haute sécurité", "cylindre sécurité"], tvaDefault: 20 },
  { code: "SER-005", metierSlug: "serrurier", categorie: "Serrure", designation: "Pose serrure 3 points en applique", unite: "u", prixHtBas: 280, prixHtMoyen: 450, prixHtHaut: 750, motsCles: ["serrure 3 points", "serrure multipoints", "sécuriser porte"], tvaDefault: 20 },
  { code: "SER-006", metierSlug: "serrurier", categorie: "Sécurité", designation: "Pose blindage de porte", unite: "u", prixHtBas: 550, prixHtMoyen: 900, prixHtHaut: 1500, motsCles: ["blinder porte", "blindage", "cornière anti-pince"], tvaDefault: 20 },
  { code: "SER-007", metierSlug: "serrurier", categorie: "Dépannage", designation: "Urgence serrurier 24/7", unite: "forfait", prixHtBas: 150, prixHtMoyen: 280, prixHtHaut: 500, motsCles: ["urgence serrurier", "nuit", "weekend", "dimanche"], tvaDefault: 20 },
  { code: "SER-008", metierSlug: "serrurier", categorie: "Garage", designation: "Pose porte de garage sectionnelle", unite: "u", prixHtBas: 1200, prixHtMoyen: 1900, prixHtHaut: 3200, motsCles: ["porte garage", "porte sectionnelle", "basculante"], tvaDefault: 10 },
  { code: "SER-009", metierSlug: "serrurier", categorie: "Garage", designation: "Motorisation porte de garage", unite: "u", prixHtBas: 550, prixHtMoyen: 900, prixHtHaut: 1500, motsCles: ["motoriser garage", "télécommande porte garage"], tvaDefault: 10 },
  { code: "SER-010", metierSlug: "serrurier", categorie: "Extérieur", designation: "Pose portail métallique", unite: "u", prixHtBas: 900, prixHtMoyen: 1500, prixHtHaut: 2800, motsCles: ["portail fer", "portail métal", "portail battant"], tvaDefault: 20 },

  // ═══ CUISINISTE (CUI) — set réduit ═══
  { code: "CUI-001", metierSlug: "cuisiniste", categorie: "Cuisine", designation: "Pose cuisine équipée standard 2,40ml", unite: "forfait", prixHtBas: 1500, prixHtMoyen: 2500, prixHtHaut: 4000, motsCles: ["monter cuisine", "pose cuisine équipée"], tvaDefault: 10 },
  { code: "CUI-002", metierSlug: "cuisiniste", categorie: "Cuisine", designation: "Pose cuisine équipée 3-4ml", unite: "forfait", prixHtBas: 2500, prixHtMoyen: 4000, prixHtHaut: 6500, motsCles: ["cuisine complète", "poser cuisine"], tvaDefault: 10 },
  { code: "CUI-003", metierSlug: "cuisiniste", categorie: "Cuisine", designation: "Pose îlot central cuisine", unite: "u", prixHtBas: 650, prixHtMoyen: 1100, prixHtHaut: 2200, motsCles: ["îlot central", "îlot cuisine"], tvaDefault: 10 },
  { code: "CUI-004", metierSlug: "cuisiniste", categorie: "Plan travail", designation: "Pose plan de travail stratifié", unite: "ml", prixHtBas: 60, prixHtMoyen: 100, prixHtHaut: 170, motsCles: ["plan de travail stratifié", "mélaminé"], tvaDefault: 10 },
  { code: "CUI-005", metierSlug: "cuisiniste", categorie: "Plan travail", designation: "Pose plan de travail quartz / granit", unite: "ml", prixHtBas: 180, prixHtMoyen: 300, prixHtHaut: 550, motsCles: ["plan travail quartz", "granit", "pierre naturelle"], tvaDefault: 10 },
  { code: "CUI-006", metierSlug: "cuisiniste", categorie: "Forfait", designation: "Rénovation cuisine complète clé en main", unite: "forfait", prixHtBas: 5500, prixHtMoyen: 9500, prixHtHaut: 18000, motsCles: ["rénover cuisine", "cuisine neuve", "refaire cuisine"], tvaDefault: 10 },
  { code: "CUI-007", metierSlug: "cuisiniste", categorie: "SDB", designation: "Pose meuble vasque SDB", unite: "u", prixHtBas: 180, prixHtMoyen: 300, prixHtHaut: 550, motsCles: ["meuble vasque", "meuble SDB", "double vasque"], tvaDefault: 10 },
  { code: "CUI-008", metierSlug: "cuisiniste", categorie: "Forfait", designation: "Rénovation salle de bain clé en main", unite: "forfait", prixHtBas: 6500, prixHtMoyen: 11000, prixHtHaut: 22000, motsCles: ["refaire salle de bain", "rénover SDB", "SDB clé en main"], tvaDefault: 10 },
  { code: "CUI-009", metierSlug: "cuisiniste", categorie: "SDB", designation: "Transformation SDB senior (douche plain-pied)", unite: "forfait", prixHtBas: 3500, prixHtMoyen: 6000, prixHtHaut: 10000, motsCles: ["SDB senior", "douche plain pied", "PMR", "accessibilité"], tvaDefault: 5.5 },
  { code: "CUI-010", metierSlug: "cuisiniste", categorie: "Aménagement", designation: "Aménagement buanderie / cellier", unite: "forfait", prixHtBas: 1500, prixHtMoyen: 2500, prixHtHaut: 4500, motsCles: ["buanderie", "cellier", "lingerie"], tvaDefault: 10 },
];

async function main() {
  console.log(`📚 Seeding ${CATALOGUE.length} prestations BTP...`);

  for (const p of CATALOGUE) {
    await prisma.cataloguePrestation.upsert({
      where: { code: p.code },
      update: {
        metierSlug: p.metierSlug,
        categorie: p.categorie ?? null,
        designation: p.designation,
        description: p.description ?? null,
        unite: p.unite,
        prixHtBas: p.prixHtBas,
        prixHtMoyen: p.prixHtMoyen,
        prixHtHaut: p.prixHtHaut,
        motsCles: p.motsCles,
        dureeMoyenneH: p.dureeMoyenneH ?? null,
        tvaDefault: p.tvaDefault ?? null,
      },
      create: {
        code: p.code,
        metierSlug: p.metierSlug,
        categorie: p.categorie ?? null,
        designation: p.designation,
        description: p.description ?? null,
        unite: p.unite,
        prixHtBas: p.prixHtBas,
        prixHtMoyen: p.prixHtMoyen,
        prixHtHaut: p.prixHtHaut,
        motsCles: p.motsCles,
        dureeMoyenneH: p.dureeMoyenneH ?? null,
        tvaDefault: p.tvaDefault ?? null,
      },
    });
  }

  const byMetier = CATALOGUE.reduce<Record<string, number>>((acc, p) => {
    acc[p.metierSlug] = (acc[p.metierSlug] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`\n✅ Catalogue seedé :`);
  for (const [m, n] of Object.entries(byMetier).sort()) console.log(`   - ${m}: ${n}`);
  console.log(`   Total : ${CATALOGUE.length} prestations`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
