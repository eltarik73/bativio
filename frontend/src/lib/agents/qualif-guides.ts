/**
 * Guides de qualification ultra-détaillés par métier BTP Rhône-Alpes 2026.
 * Injectés dans le prompt système de l'Agent 1 (qualif-agent.ts) pour atteindre
 * ±10% de précision devis au lieu de ±30%.
 *
 * Structure par métier :
 * - Questions OBLIGATOIRES (4-6) avec id, prompt, type, choix/placeholder
 * - Questions CONDITIONNELLES (3-5) selon réponses
 * - Mots-clés DÉTECTION (15-20)
 * - PIÈGES spécifiques à éviter
 * - CHECKPOINT validité devis (liste champs minimum)
 */

export const DETAILED_QUALIF_GUIDES: Record<string, string> = {
  plombier: `## Plombier — Guide qualif détaillé

OBLIGATOIRES :
1. type_intervention (choices) : Fuite/urgence | Installation neuve | Rénovation complète | Remplacement ponctuel | Diagnostic
2. piece_concernee (choices) : SDB | Cuisine | WC | Buanderie | Extérieur | Plusieurs
3. surface_ou_nb_points (text, placeholder "Ex: SDB 5 m² avec douche + vasque + WC, ou 3 points d'eau")
4. etat_installation (choices) : Neuve (<5 ans) | Récente (5-15 ans) | Vétuste (>15 ans) | Ne sait pas
5. niveau_gamme (choices) : Basique | Standard | Haut de gamme | Ne sait pas
6. urgence (choices) : Immédiat | 48-72h | Dans le mois | Flexible

CONDITIONNELLES :
- Si urgence → type_fuite (robinet/canalisation/évacuation/chauffe-eau)
- Si installation/rénovation → equipements_souhaites (text, "Ex: douche italienne + WC suspendu")
- Si SDB → douche_ou_baignoire
- Si rénovation → depose_existant

MOTS-CLÉS : fuite, tuyau, robinet, mitigeur, WC, chauffe-eau, cumulus, douche italienne, siphon, évacuation, débouchage, plomberie, dégorgement, VMC humidité

PIÈGES : Longueur tuyaux cachée, accessibilité étage (+20-40%), dépose ancien carrelage, gravitaire/pompe relevage, matériau équipement (WC 100€ vs 800€ suspendu).

CHECKPOINT DEVIS : type_intervention + piece + surface/nb_points + niveau_gamme + etat_installation + urgence obligatoires.`,

  electricien: `## Électricien — Guide qualif détaillé

OBLIGATOIRES :
1. type_intervention (choices) : Mise aux normes | Rénovation complète | Ajout points | Panne | Tableau/domotique | Borne recharge
2. surface_logement (text, "Ex: 80 m² ± 10 m²")
3. type_logement (choices) : Appartement | Maison | Local pro | Neuf | Ancien rénové
4. etat_installation (choices) : Aux normes | <15 ans | 15-30 ans | >30 ans vétuste | Ne sait pas
5. nb_points_a_ajouter (text, "Ex: 5 prises + 2 interrupteurs + 1 point lumière")
6. urgence (choices) : Urgent panne | 1 semaine | Dans le mois | Flexible

CONDITIONNELLES :
- Si rénovation → nb_pieces + refaire_tableau
- Si mise aux normes → diagnostic_existant
- Si borne recharge → type_borne (3,7/7,4/11/22 kW) + distance_tableau
- Si domotique → perimetre (volets/éclairage/chauffage/alarme/tout)

MOTS-CLÉS : prise, interrupteur, tableau, disjoncteur, Linky, Consuel, court-circuit, câblage, Wallbox, IRVE, domotique, va-et-vient, NF C 15-100

PIÈGES : Saignées + finitions (+30-50%), tableau à refaire, distance câblage facturé au ml, IRVE certification, Consuel 180-250€, sections câbles 1,5/2,5/6 mm².

CHECKPOINT : type_intervention + surface + type_logement + etat + urgence.`,

  peintre: `## Peintre — Guide qualif détaillé

OBLIGATOIRES :
1. type_surface (choices) : Murs int | Plafonds | Boiseries | Façade ext | Plusieurs
2. surface_a_peindre (text, "Ex: 40 m² murs + 15 m² plafond, ou 'tout le salon + 2 chambres'")
3. etat_support (choices) : Neuves lisses | Bon état | Trous/fissures | Papier peint à décoller | Très abîmé
4. nb_couleurs_finition (choices) : Blanc mat | Couleur mat standard | Satin/velours | Laque HDG | Effets décoratifs
5. nb_couches (choices) : Même couleur | Couleur proche (2 couches) | Foncé→clair (3 couches) | Ne sait pas
6. meubles_presents (choices) : Vide chantier | Meublée à protéger | Habitée

CONDITIONNELLES :
- Si façade → surface_facade + hauteur + etat_facade + type_peinture_ext (acrylique/siloxane/pliolite)
- Si papier peint → nb_couches_papier
- Si très abîmé → ragreage_necessaire (léger/moyen/lourd)
- Si boiseries → nb_portes_fenetres
- Si plafond → hauteur_sous_plafond (<2,5m / 2,5-3m / >3m échafaudage)

MOTS-CLÉS : peinture, peindre, mur, plafond, boiserie, porte, fenêtre, façade, crépis, ravalement, papier peint, tapisserie, enduit, fissure, lasure, laque, primaire, sous-couche, acrylique

PIÈGES : Préparation = 70% du temps, papier peint souvent caché, hauteur >3m = échafaudage (+200-500€), matériaux x3 (acrylique basique vs Farrow&Ball), toujours 2 couches min, protection mobilier, façade = nettoyage HP + fongicide (+30%).

CHECKPOINT : type_surface + surface_m2 + etat + finition + nb_couches.`,

  carreleur: `## Carreleur — Guide qualif détaillé

OBLIGATOIRES :
1. zone_a_carreler (choices) : Sol seul | Mur seul | Sol+mur | Terrasse/ext | Piscine
2. piece_concernee (choices) : SDB | Cuisine | Salon | Hall/couloir | Terrasse/balcon | Plusieurs
3. surface_sol (text, "Ex: 8 m² SDB, 25 m² séjour (± 2 m²)")
4. type_carrelage (choices) : Basique <20€/m² | Standard 20-40€ | HDG 40-80€ | Très HDG >80€ | Fourni client
5. format_carreau (choices) : Petit <30x30 | Standard 30-60 | Grand 60x120 | Très grand >120 | Mosaïque
6. etat_support (choices) : Neuf prêt | Ancien à conserver | Ancien à déposer | Parquet/lino à retirer | Chape à refaire

CONDITIONNELLES :
- Si sol+mur → surface_mur (text, "Ex: 12 m² faïence")
- Si terrasse → type_pose_ext (scellée/collée/plots)
- Si SDB → douche_italienne (oui receveur / oui à carreler / non)
- Si ancien à déposer → epaisseur_depose
- Si grand format → pose_droite_decalee_chevron_diagonale
- Si mosaïque → complexite_motif
- Si cuisine → credence (faïence/verre/inox/pierre)

MOTS-CLÉS : carrelage, faïence, sol, mur, joints, chape, ragréage, grès cérame, mosaïque, plinthes, douche italienne, crédence, terrasse, dalle, travertin, marbre

PIÈGES : Prix matériau x10 (15-150€/m²), chape (+30-50€/m²), étanchéité SPEC douche italienne (+40-80€/m²), grand format pose x1.5, dépose 20-40€/m² séparée, joints époxy +50%, plinthes souvent oubliées. TOUJOURS demander sol ET mur.

CHECKPOINT : zone + surface_m2 + type + format + etat_support.`,

  macon: `## Maçon — Guide qualif détaillé

OBLIGATOIRES :
1. type_travaux (choices) : Extension | Ouverture mur porteur | Dalle/chape | Fissures | Démolition cloison | Muret clôture | Terrassement
2. volume_surface (text, "Ex: extension 25 m², ouverture 3m x 2,5m, dalle 40 m²")
3. structure_porteuse (choices) : Oui porteur | Non cloison | Ne sait pas étude
4. type_materiau (choices) : Parpaings | Briques monomur | Béton cellulaire | Pierre ancien | Ossature bois | Ne sait pas
5. acces_chantier (choices) : Facile plain-pied | Moyen escaliers | Difficile étage
6. permis_deja_obtenu (choices) : Déjà obtenu | En cours | À faire | Pas nécessaire

CONDITIONNELLES :
- Si extension → hauteur_etages (RDC/R+1/R+2) + type_fondations
- Si ouverture mur → largeur_ouverture + ipn_ou_linteau
- Si dalle → epaisseur (8-10/12-15/20+ cm)
- Si fissures → gravite (micro/traversantes/structurelles)
- Si clôture → hauteur_muret + longueur_totale
- Si terrassement → volume_m3 profondeur

MOTS-CLÉS : extension, agrandissement, ouverture, mur porteur, cloison, démolition, dalle, chape, béton, parpaing, fondation, fissure, IPN, linteau, terrassement, muret, gros œuvre

PIÈGES : Étude structure ouverture porteur (BE 500-1500€), permis >20m² (2-4 mois), évacuation gravats (benne 1500€+), raccordement réseaux extension (+3-8k€), fondations variables (étude G1/G2 1-3k€), accès engins, RE2020 isolation, toiture extension oubliée.

CHECKPOINT : type + volume + porteur + matériau + accès + permis.`,

  menuisier: `## Menuisier — Guide qualif détaillé

OBLIGATOIRES :
1. type_menuiserie (choices) : Parquet/sol | Portes int | Fenêtres/baies | Placards/dressing | Escalier | Terrasse bois/bardage | Meuble sur mesure
2. quantite_dimensions (text, "Ex: 3 portes + 2 fenêtres, 30 m² parquet, dressing 3 ml")
3. materiau_souhaite (choices) : Stratifié éco | MDF standard | Bois massif chêne | Exotique | Alu/PVC | Mixte bois-alu | Ne sait pas
4. type_pose (choices) : Pose neuve | Remplacement dépose | Rénovation conservation dormant | Sur mesure
5. niveau_finition (choices) : Brut à peindre | Standard | HDG vernis/laque | Sur mesure design

CONDITIONNELLES :
- Si parquet → essence_bois + type_pose_parquet (cloué/collé/flottant)
- Si fenêtres → nb_ouvrants + type_vitrage + dimensions
- Si porte → nb_portes + int/entrée_blindée
- Si placard → ml + configuration (coulissantes/battantes/ouvert)
- Si escalier → forme (droit/quart/hélicoïdal/demi) + hauteur
- Si terrasse bois → surface + structure (lambourdes/plots/dalle)
- Si remplacement → depose_necessaire (facile/maçonnerie/amiante)

MOTS-CLÉS : parquet, stratifié, porte, fenêtre, baie vitrée, menuiserie, placard, dressing, escalier, terrasse bois, bardage, lambris, chêne, volet roulant, double/triple vitrage, sur mesure

PIÈGES : Sur mesure +20-40%, dépose oubliée (200€/unité), reprise maçonnerie, RE2020 Uw <1,3, parquet massif chauffage sol restrictions, escalier hélicoïdal x2-3 prix, MaPrimeRénov' RGE obligatoire, terrasse bois structure +30%.

CHECKPOINT : type + quantité/dims + matériau + type_pose + finition.`,

  couvreur: `## Couvreur — Guide qualif détaillé

OBLIGATOIRES :
1. type_intervention (choices) : Fuite/infiltration | Rénovation complète | Remplacement ponctuel | Démoussage | Création/extension | Velux | Zinguerie
2. surface_toiture (text, "Ex: 90 m² maison (±10 m²), rampant 6m x 12m")
3. type_couverture_actuelle (choices) : Tuiles terre cuite | Tuiles béton | Ardoises naturelles | Ardoises fibro | Tôle/bac acier | Zinc | Toit terrasse/bitume | Ne sait pas
4. age_toiture (choices) : <10 ans | 10-30 ans | 30-50 ans | >50 ans | Ne sait pas
5. etat_charpente (choices) : Bon apparent | Signes usure | Humidité/insectes | Très dégradée | Ne sait pas
6. nb_pans_toiture (choices) : Simple 2 pans | 4 pans | Complexe (lucarnes noues) | Toit plat | Monopente

CONDITIONNELLES :
- Si rénovation → isolation_sous_toiture + écran_sous_toiture
- Si velux → nb_velux + dimensions
- Si zinguerie → type (gouttières/descentes/chéneaux/complet)
- Si fuite → localisation (faîtage/noue/cheminée/velux/rupture)
- Si ardoise → type_pose (crochets/clous/mixte)

MOTS-CLÉS : toiture, toit, tuile, ardoise, charpente, couverture, fuite, infiltration, gouttière, zinguerie, velux, faîtage, noue, arêtier, solin, cheminée, démoussage, isolation combles, sarking

PIÈGES : Échafaudage >3m (+1500-4000€), charpente cachée dégradée (+50-100%), RE2020 isolation (+30-50€/m²), écran sous toiture souvent oublié (+8-15€/m²), zinguerie à refaire avec couverture, cheminée étanchéité (+300-800€), évacuation gravats (benne 1-2k€), MaPrimeRénov' RGE.

CHECKPOINT : type + surface + couverture + âge + charpente + nb_pans.`,

  chauffagiste: `## Chauffagiste — Guide qualif détaillé

OBLIGATOIRES :
1. type_projet (choices) : Remplacement chaudière | PAC | Climatisation | Radiateurs/PC | Dépannage | Chauffe-eau/ballon thermo | Installation neuf
2. surface_logement (text, "Ex: 100 m² maison (± 10 m²)")
3. energie_actuelle (choices) : Gaz ville | Fioul | Électrique | Bois/pellets | Pas de chauffage | Mixte | Ne sait pas
4. energie_cible (choices) : PAC air/eau | PAC air/air | PAC géothermique | Chaudière gaz condensation | Chaudière granulés | Électrique | Solaire | Conseil
5. type_logement (choices) : Maison bien isolée | Maison moyenne | Maison ancienne mal isolée | Appart bien isolé | Appart mal isolé
6. emission_chaleur (choices) : Radiateurs existants | Radiateurs neufs | Plancher chauffant | Unités murales | Mixte

CONDITIONNELLES :
- Si PAC air/eau → puissance_estimee (6/8/10/12/14+ kW)
- Si PAC → emplacement_unite_ext (jardin/balcon/façade/toiture/ABF)
- Si chaudière → type (condensation gaz/granulés/bois/hybride)
- Si clim → nb_splits + type_multi (mono/bi/multi 3+/gainable)
- Si fioul actuel → cuve_a_retirer (neutralisation/dépose/non)
- Si PC → renovation_ou_neuf

MOTS-CLÉS : chauffage, chaudière, PAC, pompe à chaleur, climatisation, réversible, radiateur, plancher chauffant, poêle, pellets, granulés, fioul, gaz, condensation, chauffe-eau, ballon thermodynamique, split, géothermie, RGE, MaPrimeRénov'

PIÈGES : Dimensionnement PAC = consommation x2 (calcul thermique obligatoire), RGE QualiPAC/QualiGaz obligatoire pour aides, dépose cuve fioul 1,5-3k€, PAC BT nécessite grand radiateurs, groupe ext bruit/voisinage, coffret ext obligatoire, PC rénovation +3-8cm (portes/plinthes), clim copro autorisation, Qualigaz obligatoire gaz, DPE avant/après.

CHECKPOINT : type + surface + énergie actuelle + cible + isolation + émission.`,

  serrurier: `## Serrurier — Guide qualif détaillé

OBLIGATOIRES :
1. type_intervention (choices) : Urgence clé perdue/porte claquée | Remplacement serrure | Pose porte blindée | Sécurisation | Volets/grilles | Coffre-fort | Copie clé
2. situation_actuelle (choices) : Bloqué dehors | Bloqué dedans | Tout OK veut améliorer | Cambriolage récent | Emménagement
3. niveau_securite (choices) : Basique | A2P 1★ | A2P 2★ | A2P 3★ | Assurance exige spécifique
4. type_porte (choices) : Porte entrée appart | Porte entrée maison | Porte garage | Porte-fenêtre | Portail | Coffre-fort
5. urgence (choices) : Immédiat bloqué | Aujourd'hui | Dans la semaine | Dans le mois | Flexible

CONDITIONNELLES :
- Si porte blindée → classement_BP (BP1/2/3) + dimensions
- Si remplacement serrure → type_serrure_actuelle (multipoints 3/5/7, monopoint, encastrer, applique)
- Si urgence → heure_intervention (journée/soir/nuit/weekend) + tentative_effraction
- Si porte garage → type_ouverture (basculante/sectionnelle/enroulable) + motorise
- Si volets/grilles → nb_ouvertures + dimensions_moy
- Si cambriolage → certificat_assurance

MOTS-CLÉS : serrure, clé, porte blindée, A2P, cylindre, verrou, barillet, cambriolage, effraction, sécurité, claqué dehors, multipoint, Fichet, Picard, Vachette, Bricard, coffre-fort, garage, volet, rideau métallique

PIÈGES : Arnaques urgence (x3-5), A2P 1★ 5min vs 3★ 15min (x5 prix), blindage vs porte blindée (x2), dépose/repose maçonnerie, cambriolage assurance A2P** min, multipoints 3/5/7 prix croissant, majoration nuit/dimanche (+50-100%) à annoncer, copropriété autorisation, certificat intervention assurance, norme EN 1627 CR1-CR6.

CHECKPOINT : type + situation + niveau_securite + type_porte + urgence.`,

  cuisiniste: `## Cuisiniste — Guide qualif détaillé

OBLIGATOIRES :
1. type_projet (choices) : Neuve complète | Rénovation partielle | Ajout îlot | Électroménager seul | Plan de travail seul | Conseil
2. surface_cuisine (text, "Ex: 12 m² avec 4 ml meubles, ou 20 m² + îlot 2,5m")
3. configuration (choices) : Linéaire | Angle/L | Parallèle/U | Avec îlot | Ouverte sur séjour | Ne sait pas
4. gamme_budget (choices) : <5k€ | 5-12k€ | 12-25k€ | >25k€ | Sur mesure artisan
5. facades_materiau (choices) : Mélaminé | Stratifié | Laqué brillant | Laqué mat | Bois massif | Verre/mixte | Sur mesure
6. plan_de_travail (choices) : Stratifié | Bois massif | Quartz (Silestone/Dekton) | Granit | Marbre/pierre | Inox/béton ciré | Ne sait pas

CONDITIONNELLES :
- Si neuve → depose_existant (oui cuisiniste / déjà déposée / pas de cuisine)
- Si neuve/rénovation → electromenager (conservation / fourni client / inclus devis) + gamme_electro si inclus
- Si îlot → dimensions_ilot + ilot_avec_eau_gaz
- Si plan pierre → longueur_plan + nb_decoupes
- Si ouverte séjour → ouverture_mur (déjà / à créer / porteur)
- Si rénovation partielle → elements_a_garder

MOTS-CLÉS : cuisine, cuisiniste, îlot, plan de travail, crédence, évier, électroménager, four, plaque, hotte, meuble haut/bas, façade, laqué, mélaminé, quartz, granit, Silestone, Dekton, mitigeur, IKEA, Mobalpa, Schmidt, sur mesure

PIÈGES : Prix x14 (2,5k-35k€), dépose ancienne 500-1500€, plomberie/élec quasi-systématique (+1-3k€), livraison+pose parfois exclus, électroménager 1,5k-15k€, pierre découpes (+30%), crédence variable, LED sous meubles oubliées (+200-500€), hotte conduit (+800-2k€), socles/plinthes finitions, hauteur >2,70m sur mesure, îlot avec eau (+1,5-3k€).

CHECKPOINT : type + surface + config + gamme + facades + plan.`,
};

export function getQualifGuideForMetier(metier: string | null): string {
  if (!metier) return "";
  return DETAILED_QUALIF_GUIDES[metier.toLowerCase()] || "";
}

export function getAllQualifGuides(): string {
  return Object.values(DETAILED_QUALIF_GUIDES).join("\n\n");
}
