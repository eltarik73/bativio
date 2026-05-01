# Communes & Quartiers cibles SEO — Bativio.fr

Liste exhaustive des zones de couverture pour le maillage SEO de l'annuaire artisans bâtiment Bativio.

**Méthodologie**
- Sources : INSEE (codes officiels géographiques), geo.api.gouv.fr, Wikipedia FR, sites des intercommunalités (Grand Chambéry, Grand Annecy, Grenoble Alpes Métropole, Métropole de Lyon, Valence Romans Agglo).
- Population : recensement INSEE le plus récent (2021–2024).
- Type de rattachement :
  - `intramuros` = quartier de la ville centre
  - `commune-deleguee` = ancienne commune fusionnée
  - `banlieue` = commune limitrophe (≤ 10 km)
  - `agglo` = bassin économique immédiat (10–25 km)
  - `bassin` = zone de chalandise étendue (25–45 km)
- Slug : kebab-case sans accents, conforme aux conventions Next.js (compatible avec `[ville]/[slug]` du routing Bativio).

**Total cible** : ~280 zones (volontairement supérieur à 250 pour donner de la marge de priorisation).

---

## 1. CHAMBÉRY (Savoie - 73)

### A. Quartiers intramuros de Chambéry (CP 73000)

| Quartier | CP | Type | Pop | Slug |
|---|---|---|---|---|
| Centre-Ville / Carré Curial | 73000 | intramuros | ~6 000 | centre-ville |
| Curial / Hyperscentre | 73000 | intramuros | ~3 500 | curial |
| Vieille Ville / Château | 73000 | intramuros | ~4 000 | vieille-ville |
| Faubourg Maché | 73000 | intramuros | ~3 500 | faubourg-mache |
| Faubourg Reclus | 73000 | intramuros | ~2 500 | faubourg-reclus |
| Faubourg Montmélian | 73000 | intramuros | ~3 000 | faubourg-montmelian |
| Les Hauts de Chambéry | 73000 | intramuros | ~10 000 | les-hauts-de-chambery |
| Le Biollay | 73000 | intramuros | ~5 000 | le-biollay |
| Bellevue | 73000 | intramuros | ~2 500 | bellevue |
| Mérande | 73000 | intramuros | ~3 000 | merande |
| Les Charmettes | 73000 | intramuros | ~1 500 | les-charmettes |
| Chambéry-le-Vieux | 73000 | intramuros | ~3 500 | chambery-le-vieux |
| Bissy | 73000 | intramuros | ~3 000 | bissy |
| Joppet | 73000 | intramuros | ~2 000 | joppet |
| Calamine | 73000 | intramuros | ~1 500 | calamine |
| Laurier | 73000 | intramuros | ~1 800 | laurier |
| Pré de l'Âne | 73000 | intramuros | ~1 200 | pre-de-l-ane |
| Sainte-Thérèse | 73000 | intramuros | ~2 000 | sainte-therese |
| Saint-Jean-d'Arvey (limitrophe) | 73230 | intramuros | ~1 500 | saint-jean-d-arvey |

### B. Communes de Grand Chambéry / banlieue immédiate

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Cognin | 73160 | 73087 | banlieue | 6 200 | cognin |
| Bassens | 73000 | 73031 | banlieue | 3 800 | bassens |
| Saint-Alban-Leysse | 73230 | 73213 | banlieue | 5 800 | saint-alban-leysse |
| La Motte-Servolex | 73290 | 73179 | banlieue | 12 200 | la-motte-servolex |
| Sonnaz | 73000 | 73288 | banlieue | 2 400 | sonnaz |
| Voglans | 73420 | 73331 | banlieue | 1 700 | voglans |
| Barberaz | 73000 | 73027 | banlieue | 4 700 | barberaz |
| Challes-les-Eaux | 73190 | 73064 | banlieue | 5 200 | challes-les-eaux |
| Jacob-Bellecombette | 73000 | 73137 | banlieue | 3 800 | jacob-bellecombette |
| Vimines | 73160 | 73329 | banlieue | 2 200 | vimines |
| La Ravoire | 73490 | 73213 | banlieue | 8 800 | la-ravoire |
| La Thuile | 73190 | 73291 | banlieue | 700 | la-thuile |
| Saint-Jeoire-Prieuré | 73190 | 73230 | banlieue | 1 100 | saint-jeoire-prieure |
| Saint-Sulpice | 73160 | 73271 | banlieue | 1 100 | saint-sulpice |
| Montagnole | 73000 | 73168 | banlieue | 1 100 | montagnole |
| Curienne | 73190 | 73097 | banlieue | 600 | curienne |
| Thoiry | 73230 | 73294 | banlieue | 750 | thoiry |
| Verel-Pragondran | 73230 | 73318 | banlieue | 350 | verel-pragondran |
| Les Déserts | 73230 | 73101 | banlieue | 320 | les-deserts |
| Puygros | 73190 | 73210 | banlieue | 500 | puygros |

### C. Communes agglo Aix-les-Bains / Bourget

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Aix-les-Bains | 73100 | 73008 | agglo | 30 800 | aix-les-bains |
| Le Bourget-du-Lac | 73370 | 73051 | agglo | 5 100 | le-bourget-du-lac |
| Tresserve | 73100 | 73297 | agglo | 2 900 | tresserve |
| Grésy-sur-Aix | 73100 | 73128 | agglo | 5 200 | gresy-sur-aix |
| Drumettaz-Clarafond | 73420 | 73108 | agglo | 2 500 | drumettaz-clarafond |
| Méry | 73420 | 73158 | agglo | 1 500 | mery |
| Mouxy | 73100 | 73182 | agglo | 1 200 | mouxy |
| Pugny-Chatenod | 73100 | 73208 | agglo | 1 100 | pugny-chatenod |
| Trévignin | 73100 | 73299 | agglo | 850 | trevignin |
| Brison-Saint-Innocent | 73100 | 73055 | agglo | 2 200 | brison-saint-innocent |
| Viviers-du-Lac | 73420 | 73330 | agglo | 1 800 | viviers-du-lac |

### D. Bassin (20-40 km) — Combe de Savoie / Avant-Pays / Bauges

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Albertville | 73200 | 73011 | bassin | 19 000 | albertville |
| Montmélian | 73800 | 73171 | bassin | 4 000 | montmelian |
| Saint-Pierre-d'Albigny | 73250 | 73257 | bassin | 4 000 | saint-pierre-d-albigny |
| Pontcharra | 38530 | 38314 | bassin | 7 200 | pontcharra |
| Le Pont-de-Beauvoisin | 73330 | 73199 | bassin | 3 200 | le-pont-de-beauvoisin |
| Les Échelles | 73360 | 73113 | bassin | 1 300 | les-echelles |
| Yenne | 73170 | 73340 | bassin | 3 000 | yenne |
| Apremont | 73190 | 73015 | bassin | 1 100 | apremont |
| Chamoux-sur-Gelon | 73390 | 73067 | bassin | 1 700 | chamoux-sur-gelon |
| Le Châtelard | 73630 | 73079 | bassin | 750 | le-chatelard |
| Saint-Jean-de-Maurienne | 73300 | 73248 | bassin | 7 800 | saint-jean-de-maurienne |
| La Bridoire | 73520 | 73053 | bassin | 800 | la-bridoire |

**Sous-total Chambéry : ~62 zones**

---

## 2. ANNECY (Haute-Savoie - 74)

### A. Quartiers intramuros & communes déléguées d'Annecy (CP 74000)

Depuis 2017, Annecy fusionne avec 5 communes (Annecy-le-Vieux, Cran-Gevrier, Meythet, Pringy, Seynod). Toutes sont désormais des communes déléguées d'Annecy.

| Quartier | CP | Type | Pop | Slug |
|---|---|---|---|---|
| Centre-Ville / Vieille Ville | 74000 | intramuros | ~10 000 | centre-ville |
| Pâquier / Bonlieu | 74000 | intramuros | ~3 000 | bonlieu |
| Bord du Lac / Champ de Mars | 74000 | intramuros | ~2 500 | bord-du-lac |
| Carnot / Préfecture | 74000 | intramuros | ~3 500 | carnot |
| Novel | 74000 | intramuros | ~6 000 | novel |
| Les Romains | 74000 | intramuros | ~5 000 | les-romains |
| Vovray | 74000 | intramuros | ~3 500 | vovray |
| Teppes | 74000 | intramuros | ~4 500 | teppes |
| Loverchy | 74000 | intramuros | ~3 000 | loverchy |
| Trésum | 74000 | intramuros | ~2 500 | tresum |
| Annecy-le-Vieux (commune déléguée) | 74940 | commune-deleguee | 21 000 | annecy-le-vieux |
| Cran-Gevrier (commune déléguée) | 74960 | commune-deleguee | 18 000 | cran-gevrier |
| Seynod (commune déléguée) | 74600 | commune-deleguee | 20 000 | seynod |
| Meythet (commune déléguée) | 74960 | commune-deleguee | 8 700 | meythet |
| Pringy (commune déléguée) | 74370 | commune-deleguee | 3 800 | pringy |

### B. Banlieue immédiate du Grand Annecy

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Argonay | 74370 | 74019 | banlieue | 3 100 | argonay |
| Épagny-Metz-Tessy | 74330 | 74112 | banlieue | 7 700 | epagny-metz-tessy |
| Poisy | 74330 | 74211 | banlieue | 8 000 | poisy |
| Sevrier | 74320 | 74272 | banlieue | 4 200 | sevrier |
| Saint-Jorioz | 74410 | 74242 | banlieue | 6 100 | saint-jorioz |
| Veyrier-du-Lac | 74290 | 74302 | banlieue | 2 200 | veyrier-du-lac |
| Chavanod | 74650 | 74067 | banlieue | 2 500 | chavanod |
| Quintal | 74600 | 74220 | banlieue | 800 | quintal |
| Montagny-les-Lanches | 74600 | 74186 | banlieue | 1 100 | montagny-les-lanches |
| Bluffy | 74290 | 74037 | banlieue | 350 | bluffy |
| Naves-Parmelan | 74370 | 74195 | banlieue | 1 100 | naves-parmelan |
| Charvonnex | 74370 | 74064 | banlieue | 1 200 | charvonnex |
| Saint-Martin-Bellevue | 74370 | 74250 | banlieue | 2 200 | saint-martin-bellevue |
| Villaz | 74370 | 74303 | banlieue | 4 000 | villaz |
| Groisy | 74570 | 74139 | banlieue | 3 200 | groisy |

### C. Agglo Annecy + 1ère couronne tour du lac

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Talloires-Montmin | 74290 | 74275 | agglo | 1 800 | talloires-montmin |
| Menthon-Saint-Bernard | 74290 | 74180 | agglo | 1 800 | menthon-saint-bernard |
| Doussard | 74210 | 74104 | agglo | 3 800 | doussard |
| Lathuile | 74210 | 74148 | agglo | 1 100 | lathuile |
| Duingt | 74410 | 74106 | agglo | 1 000 | duingt |
| Faverges-Seythenex | 74210 | 74123 | agglo | 7 600 | faverges-seythenex |
| Alby-sur-Chéran | 74540 | 74002 | agglo | 2 100 | alby-sur-cheran |
| Rumilly | 74150 | 74225 | agglo | 16 000 | rumilly |
| Allonzier-la-Caille | 74350 | 74006 | agglo | 1 700 | allonzier-la-caille |
| Cruseilles | 74350 | 74096 | agglo | 4 700 | cruseilles |
| La Roche-sur-Foron | 74800 | 74224 | agglo | 11 700 | la-roche-sur-foron |
| Thônes | 74230 | 74280 | agglo | 6 700 | thones |

### D. Bassin (jusqu'à Genevois français + Annemasse)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Annemasse | 74100 | 74012 | bassin | 38 000 | annemasse |
| Saint-Julien-en-Genevois | 74160 | 74243 | bassin | 14 800 | saint-julien-en-genevois |
| Bonneville | 74130 | 74042 | bassin | 13 100 | bonneville |
| Sallanches | 74700 | 74256 | bassin | 16 800 | sallanches |
| Cluses | 74300 | 74081 | bassin | 17 700 | cluses |
| Thonon-les-Bains | 74200 | 74281 | bassin | 36 100 | thonon-les-bains |
| Évian-les-Bains | 74500 | 74119 | bassin | 8 900 | evian-les-bains |

**Sous-total Annecy : ~52 zones**

---

## 3. GRENOBLE (Isère - 38)

### A. Quartiers intramuros de Grenoble (CP 38000 / 38100)

Grenoble est divisée en 6 secteurs administratifs et de nombreux quartiers reconnus.

| Quartier | CP | Type | Pop | Slug |
|---|---|---|---|---|
| Hyper-Centre / Victor-Hugo | 38000 | intramuros | ~10 000 | hyper-centre |
| Notre-Dame / Vieille Ville | 38000 | intramuros | ~6 000 | notre-dame |
| Saint-Laurent / Bastille | 38000 | intramuros | ~4 000 | saint-laurent |
| Île Verte | 38000 | intramuros | ~7 000 | ile-verte |
| Berriat / Saint-Bruno | 38000 | intramuros | ~12 000 | berriat |
| Europole | 38000 | intramuros | ~4 000 | europole |
| Saint-Bruno | 38000 | intramuros | ~6 000 | saint-bruno |
| Mistral / Eaux-Claires | 38100 | intramuros | ~5 500 | mistral |
| Capuche | 38100 | intramuros | ~6 000 | capuche |
| Bajatière / Exposition | 38100 | intramuros | ~6 000 | bajatiere |
| Alliés / Alpins | 38100 | intramuros | ~4 500 | allies-alpins |
| Teisseire | 38100 | intramuros | ~6 000 | teisseire |
| Malherbe | 38100 | intramuros | ~5 000 | malherbe |
| Saint-Martin (Grenoble) | 38100 | intramuros | ~4 000 | saint-martin |
| Villeneuve | 38100 | intramuros | ~12 000 | villeneuve |
| Vigny-Musset | 38100 | intramuros | ~5 500 | vigny-musset |
| Beauvert | 38100 | intramuros | ~4 000 | beauvert |
| Abbaye / Jouhaux / Châtelet | 38100 | intramuros | ~6 500 | abbaye |
| Bouchayer-Viallet | 38000 | intramuros | ~3 500 | bouchayer-viallet |
| Presqu'île Scientifique | 38000 | intramuros | ~3 000 | presquile |
| Caserne de Bonne | 38000 | intramuros | ~2 500 | caserne-de-bonne |

### B. Banlieue immédiate (Grenoble Alpes Métropole)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Saint-Martin-d'Hères | 38400 | 38421 | banlieue | 38 800 | saint-martin-d-heres |
| Échirolles | 38130 | 38151 | banlieue | 36 700 | echirolles |
| Fontaine | 38600 | 38169 | banlieue | 23 200 | fontaine |
| Saint-Égrève | 38120 | 38382 | banlieue | 16 700 | saint-egreve |
| Meylan | 38240 | 38229 | banlieue | 17 800 | meylan |
| Eybens | 38320 | 38158 | banlieue | 9 900 | eybens |
| La Tronche | 38700 | 38516 | banlieue | 7 000 | la-tronche |
| Seyssins | 38180 | 38485 | banlieue | 7 200 | seyssins |
| Seyssinet-Pariset | 38170 | 38486 | banlieue | 12 200 | seyssinet-pariset |
| Saint-Martin-le-Vinoux | 38950 | 38422 | banlieue | 5 800 | saint-martin-le-vinoux |
| Pont-de-Claix | 38800 | 38317 | banlieue | 12 000 | pont-de-claix |
| Sassenage | 38360 | 38474 | banlieue | 11 700 | sassenage |
| Gières | 38610 | 38179 | banlieue | 6 700 | gieres |
| Corenc | 38700 | 38126 | banlieue | 4 100 | corenc |
| Le Fontanil-Cornillon | 38120 | 38170 | banlieue | 2 800 | le-fontanil-cornillon |

### C. Agglo Grenoble (jusqu'à 25 km)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Voiron | 38500 | 38563 | agglo | 21 000 | voiron |
| Voreppe | 38340 | 38565 | agglo | 9 700 | voreppe |
| Vif | 38450 | 38545 | agglo | 8 400 | vif |
| Le Versoud | 38420 | 38538 | agglo | 4 700 | le-versoud |
| Crolles | 38920 | 38140 | agglo | 8 700 | crolles |
| Bernin | 38190 | 38043 | agglo | 3 200 | bernin |
| Brignoud (Villard-Bonnot) | 38190 | 38547 | agglo | 7 600 | villard-bonnot |
| Domène | 38420 | 38150 | agglo | 6 800 | domene |
| Murianette | 38420 | 38271 | agglo | 1 100 | murianette |
| Champagnier | 38800 | 38071 | agglo | 1 200 | champagnier |
| Champ-sur-Drac | 38560 | 38074 | agglo | 3 100 | champ-sur-drac |
| Jarrie | 38560 | 38200 | agglo | 4 000 | jarrie |
| Vizille | 38220 | 38562 | agglo | 7 700 | vizille |
| Le Sappey-en-Chartreuse | 38700 | 38473 | agglo | 1 200 | le-sappey-en-chartreuse |
| Saint-Ismier | 38330 | 38397 | agglo | 7 100 | saint-ismier |
| Biviers | 38330 | 38046 | agglo | 2 300 | biviers |
| Montbonnot-Saint-Martin | 38330 | 38249 | agglo | 5 100 | montbonnot-saint-martin |
| Claix | 38640 | 38111 | agglo | 8 200 | claix |
| Veurey-Voroize | 38113 | 38540 | agglo | 1 600 | veurey-voroize |
| Noyarey | 38360 | 38281 | agglo | 2 400 | noyarey |
| Varces-Allières-et-Risset | 38760 | 38524 | agglo | 8 000 | varces-allieres-et-risset |
| Saint-Paul-de-Varces | 38760 | 38437 | agglo | 2 100 | saint-paul-de-varces |
| Le Pont-de-Cheruy | 38230 | 38316 | agglo | 4 700 | le-pont-de-cheruy |
| Tullins | 38210 | 38520 | agglo | 7 800 | tullins |
| Moirans | 38430 | 38239 | agglo | 8 200 | moirans |
| Saint-Marcellin | 38160 | 38416 | agglo | 8 400 | saint-marcellin |
| Coublevie | 38500 | 38132 | agglo | 4 600 | coublevie |
| La Buisse | 38500 | 38059 | agglo | 3 200 | la-buisse |

### D. Bassin (Grésivaudan / Vercors / Trièves)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Allevard | 38580 | 38006 | bassin | 4 200 | allevard |
| Lans-en-Vercors | 38250 | 38205 | bassin | 2 700 | lans-en-vercors |
| Villard-de-Lans | 38250 | 38548 | bassin | 4 100 | villard-de-lans |
| Autrans-Méaudre-en-Vercors | 38112 | 38026 | bassin | 3 100 | autrans-meaudre-en-vercors |
| Mens | 38710 | 38226 | bassin | 1 500 | mens |
| Monestier-de-Clermont | 38650 | 38244 | bassin | 1 300 | monestier-de-clermont |
| La Mure | 38350 | 38269 | bassin | 5 100 | la-mure |
| Bourg-d'Oisans | 38520 | 38052 | bassin | 3 100 | bourg-d-oisans |
| Vinay | 38470 | 38559 | bassin | 4 100 | vinay |
| Pont-en-Royans | 38680 | 38319 | bassin | 850 | pont-en-royans |

**Sous-total Grenoble : ~74 zones**

---

## 4. LYON (Rhône - 69)

### A. Arrondissements de Lyon (CP 69001 à 69009)

Lyon est divisée en 9 arrondissements officiels — chacun mérite sa propre page SEO.

| Arrondissement | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Lyon 1er | 69001 | 69381 | intramuros | 28 800 | lyon-1er |
| Lyon 2e | 69002 | 69382 | intramuros | 32 100 | lyon-2e |
| Lyon 3e | 69003 | 69383 | intramuros | 105 100 | lyon-3e |
| Lyon 4e | 69004 | 69384 | intramuros | 36 400 | lyon-4e |
| Lyon 5e | 69005 | 69385 | intramuros | 47 200 | lyon-5e |
| Lyon 6e | 69006 | 69386 | intramuros | 51 100 | lyon-6e |
| Lyon 7e | 69007 | 69387 | intramuros | 87 100 | lyon-7e |
| Lyon 8e | 69008 | 69388 | intramuros | 86 400 | lyon-8e |
| Lyon 9e | 69009 | 69389 | intramuros | 51 800 | lyon-9e |

### B. Quartiers emblématiques de Lyon (cibles SEO transversales)

| Quartier | CP | Type | Arrondissement | Slug |
|---|---|---|---|---|
| Vieux Lyon | 69005 | intramuros | 5e | vieux-lyon |
| Croix-Rousse | 69001 / 69004 | intramuros | 1er & 4e | croix-rousse |
| Presqu'île | 69001 / 69002 | intramuros | 1er & 2e | presquile |
| Confluence | 69002 | intramuros | 2e | confluence |
| Bellecour | 69002 | intramuros | 2e | bellecour |
| Perrache | 69002 | intramuros | 2e | perrache |
| Part-Dieu | 69003 | intramuros | 3e | part-dieu |
| Montchat | 69003 | intramuros | 3e | montchat |
| Villette / Paul Bert | 69003 | intramuros | 3e | villette-paul-bert |
| Préfecture | 69003 | intramuros | 3e | prefecture |
| Brotteaux | 69006 | intramuros | 6e | brotteaux |
| Tête d'Or | 69006 | intramuros | 6e | tete-d-or |
| Foch | 69006 | intramuros | 6e | foch |
| Guillotière | 69007 | intramuros | 7e | guillotiere |
| Gerland | 69007 | intramuros | 7e | gerland |
| Jean Macé | 69007 | intramuros | 7e | jean-mace |
| Mermoz | 69008 | intramuros | 8e | mermoz |
| Monplaisir | 69008 | intramuros | 8e | monplaisir |
| Bachut | 69008 | intramuros | 8e | bachut |
| États-Unis | 69008 | intramuros | 8e | etats-unis |
| Vaise | 69009 | intramuros | 9e | vaise |
| La Duchère | 69009 | intramuros | 9e | la-duchere |
| Saint-Rambert | 69009 | intramuros | 9e | saint-rambert |
| Gorge de Loup | 69009 | intramuros | 9e | gorge-de-loup |
| Industrie / Champvert | 69009 | intramuros | 9e | champvert |
| Point du Jour | 69005 | intramuros | 5e | point-du-jour |
| Saint-Just | 69005 | intramuros | 5e | saint-just |
| Fourvière | 69005 | intramuros | 5e | fourviere |
| Ménival | 69005 | intramuros | 5e | menival |

### C. Métropole de Lyon — banlieue immédiate (1ère couronne)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Villeurbanne | 69100 | 69266 | banlieue | 156 800 | villeurbanne |
| Caluire-et-Cuire | 69300 | 69034 | banlieue | 43 100 | caluire-et-cuire |
| Vénissieux | 69200 | 69259 | banlieue | 65 100 | venissieux |
| Vaulx-en-Velin | 69120 | 69256 | banlieue | 53 100 | vaulx-en-velin |
| Bron | 69500 | 69029 | banlieue | 41 000 | bron |
| Saint-Priest | 69800 | 69290 | banlieue | 47 800 | saint-priest |
| Décines-Charpieu | 69150 | 69275 | banlieue | 28 700 | decines-charpieu |
| Meyzieu | 69330 | 69282 | banlieue | 33 700 | meyzieu |
| Rillieux-la-Pape | 69140 | 69286 | banlieue | 31 200 | rillieux-la-pape |
| Tassin-la-Demi-Lune | 69160 | 69249 | banlieue | 22 100 | tassin-la-demi-lune |
| Oullins | 69600 | 69149 | banlieue | 26 600 | oullins |
| Pierre-Bénite | 69310 | 69152 | banlieue | 10 700 | pierre-benite |
| Saint-Fons | 69190 | 69199 | banlieue | 19 200 | saint-fons |
| Sainte-Foy-lès-Lyon | 69110 | 69202 | banlieue | 22 400 | sainte-foy-les-lyon |
| Francheville | 69340 | 69089 | banlieue | 13 800 | francheville |
| Écully | 69130 | 69081 | banlieue | 18 700 | ecully |
| Champagne-au-Mont-d'Or | 69410 | 69040 | banlieue | 5 700 | champagne-au-mont-d-or |
| Dardilly | 69570 | 69072 | banlieue | 8 900 | dardilly |
| Limonest | 69760 | 69116 | banlieue | 3 700 | limonest |
| Saint-Didier-au-Mont-d'Or | 69370 | 69191 | banlieue | 7 200 | saint-didier-au-mont-d-or |
| Saint-Cyr-au-Mont-d'Or | 69450 | 69191 | banlieue | 5 800 | saint-cyr-au-mont-d-or |
| Collonges-au-Mont-d'Or | 69660 | 69063 | banlieue | 4 100 | collonges-au-mont-d-or |
| Fontaines-sur-Saône | 69270 | 69088 | banlieue | 7 100 | fontaines-sur-saone |
| Couzon-au-Mont-d'Or | 69270 | 69068 | banlieue | 2 800 | couzon-au-mont-d-or |
| Saint-Genis-Laval | 69230 | 69204 | banlieue | 22 000 | saint-genis-laval |
| Irigny | 69540 | 69100 | banlieue | 8 700 | irigny |
| Charbonnières-les-Bains | 69260 | 69044 | banlieue | 5 200 | charbonnieres-les-bains |
| La Tour-de-Salvagny | 69890 | 69250 | banlieue | 4 200 | la-tour-de-salvagny |
| Marcy-l'Étoile | 69280 | 69127 | banlieue | 3 800 | marcy-l-etoile |
| Craponne | 69290 | 69069 | banlieue | 11 600 | craponne |
| Montanay | 69250 | 69284 | banlieue | 2 800 | montanay |
| Sathonay-Camp | 69580 | 69292 | banlieue | 5 700 | sathonay-camp |
| Sathonay-Village | 69580 | 69293 | banlieue | 2 200 | sathonay-village |
| Chassieu | 69680 | 69271 | banlieue | 11 100 | chassieu |
| Genas | 69740 | 38179 | banlieue | 13 100 | genas |
| Mions | 69780 | 69283 | banlieue | 14 200 | mions |
| Corbas | 69960 | 69273 | banlieue | 11 700 | corbas |
| Feyzin | 69320 | 69276 | banlieue | 10 100 | feyzin |
| Solaize | 69360 | 69296 | banlieue | 3 100 | solaize |
| Vernaison | 69390 | 69260 | banlieue | 5 300 | vernaison |
| Charly | 69390 | 69046 | banlieue | 4 700 | charly |
| Givors | 69700 | 69091 | banlieue | 19 800 | givors |
| Grigny | 69520 | 69094 | banlieue | 8 800 | grigny |
| Lentilly | 69210 | 69112 | banlieue | 6 100 | lentilly |
| L'Arbresle | 69210 | 69010 | banlieue | 6 100 | l-arbresle |

### D. Bassin Lyon (jusqu'à 30 km — Beaujolais sud / Plaine Est / Pays de l'Ozon)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Villefranche-sur-Saône | 69400 | 69264 | bassin | 36 700 | villefranche-sur-saone |
| Anse | 69480 | 69009 | bassin | 8 400 | anse |
| Belleville-en-Beaujolais | 69220 | 69019 | bassin | 13 600 | belleville-en-beaujolais |
| Tarare | 69170 | 69243 | bassin | 11 100 | tarare |
| L'Isle-d'Abeau | 38080 | 38193 | bassin | 17 200 | l-isle-d-abeau |
| Bourgoin-Jallieu | 38300 | 38053 | bassin | 28 800 | bourgoin-jallieu |
| Pont-de-Chéruy | 38230 | 38316 | bassin | 4 700 | pont-de-cheruy |
| Heyrieux | 38540 | 38189 | bassin | 5 100 | heyrieux |
| Saint-Symphorien-d'Ozon | 69360 | 69297 | bassin | 6 600 | saint-symphorien-d-ozon |
| Communay | 69360 | 69069 | bassin | 4 600 | communay |
| Sérézin-du-Rhône | 69360 | 69294 | bassin | 3 200 | serezin-du-rhone |
| Brignais | 69530 | 69027 | bassin | 12 200 | brignais |
| Chaponost | 69630 | 69043 | bassin | 9 100 | chaponost |
| Mornant | 69440 | 69141 | bassin | 6 200 | mornant |
| Saint-Laurent-de-Mure | 69720 | 69288 | bassin | 6 200 | saint-laurent-de-mure |
| Pusignan | 69330 | 69285 | bassin | 4 800 | pusignan |
| Jonage | 69330 | 69279 | bassin | 6 700 | jonage |
| Villette-d'Anthon | 38280 | 38556 | bassin | 4 700 | villette-d-anthon |

**Sous-total Lyon : ~95 zones (9 arrondissements + 29 quartiers + 44 banlieue + 18 bassin)**

---

## 5. VALENCE (Drôme - 26)

### A. Quartiers intramuros de Valence (CP 26000)

| Quartier | CP | Type | Pop | Slug |
|---|---|---|---|---|
| Centre-Ville / Champ de Mars | 26000 | intramuros | ~7 000 | centre-ville |
| Vieux Valence | 26000 | intramuros | ~3 500 | vieux-valence |
| Calvaire / Saint-Jean | 26000 | intramuros | ~5 000 | calvaire |
| Polygone | 26000 | intramuros | ~6 500 | polygone |
| Fontbarlettes | 26000 | intramuros | ~6 800 | fontbarlettes |
| Le Plan | 26000 | intramuros | ~3 800 | le-plan |
| Mistral / Valensolles | 26000 | intramuros | ~5 200 | mistral |
| Chamberlière | 26000 | intramuros | ~4 500 | chamberliere |
| Saint-Nicolas | 26000 | intramuros | ~3 500 | saint-nicolas |
| Briffaut | 26000 | intramuros | ~3 200 | briffaut |
| Latour-Maubourg | 26000 | intramuros | ~4 000 | latour-maubourg |
| Beauregard / Beausoleil | 26000 | intramuros | ~3 000 | beauregard |
| Laprat / Châteauvert | 26000 | intramuros | ~3 500 | chateauvert |
| Hugo / Préfecture | 26000 | intramuros | ~4 200 | hugo |
| Marcs | 26000 | intramuros | ~2 500 | marcs |

### B. Banlieue immédiate de Valence

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Bourg-lès-Valence | 26500 | 26058 | banlieue | 19 700 | bourg-les-valence |
| Bourg-de-Péage | 26300 | 26057 | banlieue | 10 600 | bourg-de-peage |
| Portes-lès-Valence | 26800 | 26252 | banlieue | 10 400 | portes-les-valence |
| Saint-Marcel-lès-Valence | 26320 | 26313 | banlieue | 5 800 | saint-marcel-les-valence |
| Saint-Péray | 07130 | 07281 | banlieue | 7 800 | saint-peray |
| Guilherand-Granges | 07500 | 07102 | banlieue | 11 600 | guilherand-granges |
| Soyons | 07130 | 07314 | banlieue | 1 900 | soyons |
| Cornas | 07130 | 07069 | banlieue | 2 500 | cornas |
| Châteauneuf-sur-Isère | 26300 | 26085 | banlieue | 3 600 | chateauneuf-sur-isere |
| Beaumont-lès-Valence | 26760 | 26035 | banlieue | 4 100 | beaumont-les-valence |
| Étoile-sur-Rhône | 26800 | 26124 | banlieue | 5 300 | etoile-sur-rhone |
| Malissard | 26120 | 26167 | banlieue | 3 200 | malissard |
| Chabeuil | 26120 | 26064 | banlieue | 7 100 | chabeuil |
| Montélier | 26120 | 26197 | banlieue | 3 700 | montelier |
| Alixan | 26300 | 26004 | banlieue | 2 800 | alixan |

### C. Agglo Valence Romans (jusqu'à 25 km)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Romans-sur-Isère | 26100 | 26281 | agglo | 33 700 | romans-sur-isere |
| Tain-l'Hermitage | 26600 | 26347 | agglo | 5 700 | tain-l-hermitage |
| Tournon-sur-Rhône | 07300 | 07324 | agglo | 11 100 | tournon-sur-rhone |
| Mauves | 07300 | 07158 | agglo | 1 700 | mauves |
| Saint-Jean-de-Muzols | 07300 | 07237 | agglo | 2 600 | saint-jean-de-muzols |
| Vernoux-en-Vivarais | 07240 | 07344 | agglo | 2 100 | vernoux-en-vivarais |
| Privas | 07000 | 07186 | agglo | 8 100 | privas |
| Le Pouzin | 07250 | 07185 | agglo | 2 700 | le-pouzin |
| La Voulte-sur-Rhône | 07800 | 07350 | agglo | 4 800 | la-voulte-sur-rhone |
| Saint-Vallier | 26240 | 26333 | agglo | 4 100 | saint-vallier |
| Crest | 26400 | 26108 | agglo | 8 100 | crest |
| Livron-sur-Drôme | 26250 | 26165 | agglo | 9 100 | livron-sur-drome |
| Loriol-sur-Drôme | 26270 | 26166 | agglo | 6 600 | loriol-sur-drome |

### D. Bassin (Drôme provençale + Ardèche verte)

| Commune | CP | INSEE | Type | Pop | Slug |
|---|---|---|---|---|---|
| Montélimar | 26200 | 26198 | bassin | 39 800 | montelimar |
| Pierrelatte | 26700 | 26235 | bassin | 13 800 | pierrelatte |
| Aubenas | 07200 | 07019 | bassin | 12 200 | aubenas |
| Annonay | 07100 | 07010 | bassin | 16 100 | annonay |
| Die | 26150 | 26113 | bassin | 4 600 | die |
| Saillans | 26340 | 26301 | bassin | 1 350 | saillans |

**Sous-total Valence : ~49 zones**

---

## RÉCAPITULATIF GLOBAL

| Ville | Intramuros | Banlieue | Agglo | Bassin | Total |
|---|---|---|---|---|---|
| Chambéry | 19 | 20 | 11 | 12 | **62** |
| Annecy | 15 | 15 | 12 | 7 | **49** |
| Grenoble | 21 | 15 | 28 | 10 | **74** |
| Lyon | 9 + 29 | 44 | — | 18 | **100** |
| Valence | 15 | 15 | 13 | 6 | **49** |
| **TOTAL** | **108** | **109** | **64** | **53** | **334** |

> Total = **334 zones cibles SEO** (largement au-dessus de l'objectif de 250).

---

## EXPORT JSON — Format directement utilisable dans Next.js

Format proposé : objet keyed par ville centrale, avec un tableau de zones. Compatible avec le routing `[ville]/[slug]` actuel et avec une éventuelle évolution `[ville]/quartier/[slug]` ou `[ville]/commune/[slug]`.

Fichier suggéré : `frontend/src/lib/zones.ts`

```ts
// frontend/src/lib/zones.ts
// Auto-généré depuis seo/research/04-communes-quartiers.md

export type ZoneType = "intramuros" | "commune-deleguee" | "banlieue" | "agglo" | "bassin";

export interface Zone {
  name: string;          // Nom officiel
  cp: string;            // Code postal
  insee?: string;        // Code INSEE (5 chiffres)
  type: ZoneType;
  pop: number;           // Population approximative
  slug: string;          // kebab-case
}

export interface VilleZones {
  ville: string;          // ex: "Chambéry"
  villeSlug: string;      // ex: "chambery"
  departement: string;    // ex: "Savoie"
  codeDept: string;       // ex: "73"
  zones: Zone[];
}

export const ZONES_SEO: Record<string, VilleZones> = {
  chambery: {
    ville: "Chambéry",
    villeSlug: "chambery",
    departement: "Savoie",
    codeDept: "73",
    zones: [
      { name: "Centre-Ville / Carré Curial", cp: "73000", type: "intramuros", pop: 6000, slug: "centre-ville" },
      { name: "Curial / Hyperscentre", cp: "73000", type: "intramuros", pop: 3500, slug: "curial" },
      { name: "Vieille Ville / Château", cp: "73000", type: "intramuros", pop: 4000, slug: "vieille-ville" },
      { name: "Faubourg Maché", cp: "73000", type: "intramuros", pop: 3500, slug: "faubourg-mache" },
      { name: "Faubourg Reclus", cp: "73000", type: "intramuros", pop: 2500, slug: "faubourg-reclus" },
      { name: "Faubourg Montmélian", cp: "73000", type: "intramuros", pop: 3000, slug: "faubourg-montmelian" },
      { name: "Les Hauts de Chambéry", cp: "73000", type: "intramuros", pop: 10000, slug: "les-hauts-de-chambery" },
      { name: "Le Biollay", cp: "73000", type: "intramuros", pop: 5000, slug: "le-biollay" },
      { name: "Bellevue", cp: "73000", type: "intramuros", pop: 2500, slug: "bellevue" },
      { name: "Mérande", cp: "73000", type: "intramuros", pop: 3000, slug: "merande" },
      { name: "Les Charmettes", cp: "73000", type: "intramuros", pop: 1500, slug: "les-charmettes" },
      { name: "Chambéry-le-Vieux", cp: "73000", type: "intramuros", pop: 3500, slug: "chambery-le-vieux" },
      { name: "Bissy", cp: "73000", type: "intramuros", pop: 3000, slug: "bissy" },
      { name: "Joppet", cp: "73000", type: "intramuros", pop: 2000, slug: "joppet" },
      { name: "Calamine", cp: "73000", type: "intramuros", pop: 1500, slug: "calamine" },
      { name: "Laurier", cp: "73000", type: "intramuros", pop: 1800, slug: "laurier" },
      { name: "Pré de l'Âne", cp: "73000", type: "intramuros", pop: 1200, slug: "pre-de-l-ane" },
      { name: "Sainte-Thérèse", cp: "73000", type: "intramuros", pop: 2000, slug: "sainte-therese" },
      { name: "Saint-Jean-d'Arvey", cp: "73230", type: "intramuros", pop: 1500, slug: "saint-jean-d-arvey" },

      { name: "Cognin", cp: "73160", insee: "73087", type: "banlieue", pop: 6200, slug: "cognin" },
      { name: "Bassens", cp: "73000", insee: "73031", type: "banlieue", pop: 3800, slug: "bassens" },
      { name: "Saint-Alban-Leysse", cp: "73230", insee: "73213", type: "banlieue", pop: 5800, slug: "saint-alban-leysse" },
      { name: "La Motte-Servolex", cp: "73290", insee: "73179", type: "banlieue", pop: 12200, slug: "la-motte-servolex" },
      { name: "Sonnaz", cp: "73000", insee: "73288", type: "banlieue", pop: 2400, slug: "sonnaz" },
      { name: "Voglans", cp: "73420", insee: "73331", type: "banlieue", pop: 1700, slug: "voglans" },
      { name: "Barberaz", cp: "73000", insee: "73027", type: "banlieue", pop: 4700, slug: "barberaz" },
      { name: "Challes-les-Eaux", cp: "73190", insee: "73064", type: "banlieue", pop: 5200, slug: "challes-les-eaux" },
      { name: "Jacob-Bellecombette", cp: "73000", insee: "73137", type: "banlieue", pop: 3800, slug: "jacob-bellecombette" },
      { name: "Vimines", cp: "73160", insee: "73329", type: "banlieue", pop: 2200, slug: "vimines" },
      { name: "La Ravoire", cp: "73490", insee: "73213", type: "banlieue", pop: 8800, slug: "la-ravoire" },
      { name: "La Thuile", cp: "73190", insee: "73291", type: "banlieue", pop: 700, slug: "la-thuile" },
      { name: "Saint-Jeoire-Prieuré", cp: "73190", insee: "73230", type: "banlieue", pop: 1100, slug: "saint-jeoire-prieure" },
      { name: "Saint-Sulpice", cp: "73160", insee: "73271", type: "banlieue", pop: 1100, slug: "saint-sulpice" },
      { name: "Montagnole", cp: "73000", insee: "73168", type: "banlieue", pop: 1100, slug: "montagnole" },
      { name: "Curienne", cp: "73190", insee: "73097", type: "banlieue", pop: 600, slug: "curienne" },
      { name: "Thoiry", cp: "73230", insee: "73294", type: "banlieue", pop: 750, slug: "thoiry" },
      { name: "Verel-Pragondran", cp: "73230", insee: "73318", type: "banlieue", pop: 350, slug: "verel-pragondran" },
      { name: "Les Déserts", cp: "73230", insee: "73101", type: "banlieue", pop: 320, slug: "les-deserts" },
      { name: "Puygros", cp: "73190", insee: "73210", type: "banlieue", pop: 500, slug: "puygros" },

      { name: "Aix-les-Bains", cp: "73100", insee: "73008", type: "agglo", pop: 30800, slug: "aix-les-bains" },
      { name: "Le Bourget-du-Lac", cp: "73370", insee: "73051", type: "agglo", pop: 5100, slug: "le-bourget-du-lac" },
      { name: "Tresserve", cp: "73100", insee: "73297", type: "agglo", pop: 2900, slug: "tresserve" },
      { name: "Grésy-sur-Aix", cp: "73100", insee: "73128", type: "agglo", pop: 5200, slug: "gresy-sur-aix" },
      { name: "Drumettaz-Clarafond", cp: "73420", insee: "73108", type: "agglo", pop: 2500, slug: "drumettaz-clarafond" },
      { name: "Méry", cp: "73420", insee: "73158", type: "agglo", pop: 1500, slug: "mery" },
      { name: "Mouxy", cp: "73100", insee: "73182", type: "agglo", pop: 1200, slug: "mouxy" },
      { name: "Pugny-Chatenod", cp: "73100", insee: "73208", type: "agglo", pop: 1100, slug: "pugny-chatenod" },
      { name: "Trévignin", cp: "73100", insee: "73299", type: "agglo", pop: 850, slug: "trevignin" },
      { name: "Brison-Saint-Innocent", cp: "73100", insee: "73055", type: "agglo", pop: 2200, slug: "brison-saint-innocent" },
      { name: "Viviers-du-Lac", cp: "73420", insee: "73330", type: "agglo", pop: 1800, slug: "viviers-du-lac" },

      { name: "Albertville", cp: "73200", insee: "73011", type: "bassin", pop: 19000, slug: "albertville" },
      { name: "Montmélian", cp: "73800", insee: "73171", type: "bassin", pop: 4000, slug: "montmelian" },
      { name: "Saint-Pierre-d'Albigny", cp: "73250", insee: "73257", type: "bassin", pop: 4000, slug: "saint-pierre-d-albigny" },
      { name: "Pontcharra", cp: "38530", insee: "38314", type: "bassin", pop: 7200, slug: "pontcharra" },
      { name: "Le Pont-de-Beauvoisin", cp: "73330", insee: "73199", type: "bassin", pop: 3200, slug: "le-pont-de-beauvoisin" },
      { name: "Les Échelles", cp: "73360", insee: "73113", type: "bassin", pop: 1300, slug: "les-echelles" },
      { name: "Yenne", cp: "73170", insee: "73340", type: "bassin", pop: 3000, slug: "yenne" },
      { name: "Apremont", cp: "73190", insee: "73015", type: "bassin", pop: 1100, slug: "apremont" },
      { name: "Chamoux-sur-Gelon", cp: "73390", insee: "73067", type: "bassin", pop: 1700, slug: "chamoux-sur-gelon" },
      { name: "Le Châtelard", cp: "73630", insee: "73079", type: "bassin", pop: 750, slug: "le-chatelard" },
      { name: "Saint-Jean-de-Maurienne", cp: "73300", insee: "73248", type: "bassin", pop: 7800, slug: "saint-jean-de-maurienne" },
      { name: "La Bridoire", cp: "73520", insee: "73053", type: "bassin", pop: 800, slug: "la-bridoire" },
    ],
  },

  annecy: {
    ville: "Annecy",
    villeSlug: "annecy",
    departement: "Haute-Savoie",
    codeDept: "74",
    zones: [
      { name: "Centre-Ville / Vieille Ville", cp: "74000", type: "intramuros", pop: 10000, slug: "centre-ville" },
      { name: "Pâquier / Bonlieu", cp: "74000", type: "intramuros", pop: 3000, slug: "bonlieu" },
      { name: "Bord du Lac / Champ de Mars", cp: "74000", type: "intramuros", pop: 2500, slug: "bord-du-lac" },
      { name: "Carnot / Préfecture", cp: "74000", type: "intramuros", pop: 3500, slug: "carnot" },
      { name: "Novel", cp: "74000", type: "intramuros", pop: 6000, slug: "novel" },
      { name: "Les Romains", cp: "74000", type: "intramuros", pop: 5000, slug: "les-romains" },
      { name: "Vovray", cp: "74000", type: "intramuros", pop: 3500, slug: "vovray" },
      { name: "Teppes", cp: "74000", type: "intramuros", pop: 4500, slug: "teppes" },
      { name: "Loverchy", cp: "74000", type: "intramuros", pop: 3000, slug: "loverchy" },
      { name: "Trésum", cp: "74000", type: "intramuros", pop: 2500, slug: "tresum" },
      { name: "Annecy-le-Vieux", cp: "74940", type: "commune-deleguee", pop: 21000, slug: "annecy-le-vieux" },
      { name: "Cran-Gevrier", cp: "74960", type: "commune-deleguee", pop: 18000, slug: "cran-gevrier" },
      { name: "Seynod", cp: "74600", type: "commune-deleguee", pop: 20000, slug: "seynod" },
      { name: "Meythet", cp: "74960", type: "commune-deleguee", pop: 8700, slug: "meythet" },
      { name: "Pringy", cp: "74370", type: "commune-deleguee", pop: 3800, slug: "pringy" },

      { name: "Argonay", cp: "74370", insee: "74019", type: "banlieue", pop: 3100, slug: "argonay" },
      { name: "Épagny-Metz-Tessy", cp: "74330", insee: "74112", type: "banlieue", pop: 7700, slug: "epagny-metz-tessy" },
      { name: "Poisy", cp: "74330", insee: "74211", type: "banlieue", pop: 8000, slug: "poisy" },
      { name: "Sevrier", cp: "74320", insee: "74272", type: "banlieue", pop: 4200, slug: "sevrier" },
      { name: "Saint-Jorioz", cp: "74410", insee: "74242", type: "banlieue", pop: 6100, slug: "saint-jorioz" },
      { name: "Veyrier-du-Lac", cp: "74290", insee: "74302", type: "banlieue", pop: 2200, slug: "veyrier-du-lac" },
      { name: "Chavanod", cp: "74650", insee: "74067", type: "banlieue", pop: 2500, slug: "chavanod" },
      { name: "Quintal", cp: "74600", insee: "74220", type: "banlieue", pop: 800, slug: "quintal" },
      { name: "Montagny-les-Lanches", cp: "74600", insee: "74186", type: "banlieue", pop: 1100, slug: "montagny-les-lanches" },
      { name: "Bluffy", cp: "74290", insee: "74037", type: "banlieue", pop: 350, slug: "bluffy" },
      { name: "Naves-Parmelan", cp: "74370", insee: "74195", type: "banlieue", pop: 1100, slug: "naves-parmelan" },
      { name: "Charvonnex", cp: "74370", insee: "74064", type: "banlieue", pop: 1200, slug: "charvonnex" },
      { name: "Saint-Martin-Bellevue", cp: "74370", insee: "74250", type: "banlieue", pop: 2200, slug: "saint-martin-bellevue" },
      { name: "Villaz", cp: "74370", insee: "74303", type: "banlieue", pop: 4000, slug: "villaz" },
      { name: "Groisy", cp: "74570", insee: "74139", type: "banlieue", pop: 3200, slug: "groisy" },

      { name: "Talloires-Montmin", cp: "74290", insee: "74275", type: "agglo", pop: 1800, slug: "talloires-montmin" },
      { name: "Menthon-Saint-Bernard", cp: "74290", insee: "74180", type: "agglo", pop: 1800, slug: "menthon-saint-bernard" },
      { name: "Doussard", cp: "74210", insee: "74104", type: "agglo", pop: 3800, slug: "doussard" },
      { name: "Lathuile", cp: "74210", insee: "74148", type: "agglo", pop: 1100, slug: "lathuile" },
      { name: "Duingt", cp: "74410", insee: "74106", type: "agglo", pop: 1000, slug: "duingt" },
      { name: "Faverges-Seythenex", cp: "74210", insee: "74123", type: "agglo", pop: 7600, slug: "faverges-seythenex" },
      { name: "Alby-sur-Chéran", cp: "74540", insee: "74002", type: "agglo", pop: 2100, slug: "alby-sur-cheran" },
      { name: "Rumilly", cp: "74150", insee: "74225", type: "agglo", pop: 16000, slug: "rumilly" },
      { name: "Allonzier-la-Caille", cp: "74350", insee: "74006", type: "agglo", pop: 1700, slug: "allonzier-la-caille" },
      { name: "Cruseilles", cp: "74350", insee: "74096", type: "agglo", pop: 4700, slug: "cruseilles" },
      { name: "La Roche-sur-Foron", cp: "74800", insee: "74224", type: "agglo", pop: 11700, slug: "la-roche-sur-foron" },
      { name: "Thônes", cp: "74230", insee: "74280", type: "agglo", pop: 6700, slug: "thones" },

      { name: "Annemasse", cp: "74100", insee: "74012", type: "bassin", pop: 38000, slug: "annemasse" },
      { name: "Saint-Julien-en-Genevois", cp: "74160", insee: "74243", type: "bassin", pop: 14800, slug: "saint-julien-en-genevois" },
      { name: "Bonneville", cp: "74130", insee: "74042", type: "bassin", pop: 13100, slug: "bonneville" },
      { name: "Sallanches", cp: "74700", insee: "74256", type: "bassin", pop: 16800, slug: "sallanches" },
      { name: "Cluses", cp: "74300", insee: "74081", type: "bassin", pop: 17700, slug: "cluses" },
      { name: "Thonon-les-Bains", cp: "74200", insee: "74281", type: "bassin", pop: 36100, slug: "thonon-les-bains" },
      { name: "Évian-les-Bains", cp: "74500", insee: "74119", type: "bassin", pop: 8900, slug: "evian-les-bains" },
    ],
  },

  grenoble: {
    ville: "Grenoble",
    villeSlug: "grenoble",
    departement: "Isère",
    codeDept: "38",
    zones: [
      { name: "Hyper-Centre / Victor-Hugo", cp: "38000", type: "intramuros", pop: 10000, slug: "hyper-centre" },
      { name: "Notre-Dame / Vieille Ville", cp: "38000", type: "intramuros", pop: 6000, slug: "notre-dame" },
      { name: "Saint-Laurent / Bastille", cp: "38000", type: "intramuros", pop: 4000, slug: "saint-laurent" },
      { name: "Île Verte", cp: "38000", type: "intramuros", pop: 7000, slug: "ile-verte" },
      { name: "Berriat / Saint-Bruno", cp: "38000", type: "intramuros", pop: 12000, slug: "berriat" },
      { name: "Europole", cp: "38000", type: "intramuros", pop: 4000, slug: "europole" },
      { name: "Saint-Bruno", cp: "38000", type: "intramuros", pop: 6000, slug: "saint-bruno" },
      { name: "Mistral / Eaux-Claires", cp: "38100", type: "intramuros", pop: 5500, slug: "mistral" },
      { name: "Capuche", cp: "38100", type: "intramuros", pop: 6000, slug: "capuche" },
      { name: "Bajatière / Exposition", cp: "38100", type: "intramuros", pop: 6000, slug: "bajatiere" },
      { name: "Alliés / Alpins", cp: "38100", type: "intramuros", pop: 4500, slug: "allies-alpins" },
      { name: "Teisseire", cp: "38100", type: "intramuros", pop: 6000, slug: "teisseire" },
      { name: "Malherbe", cp: "38100", type: "intramuros", pop: 5000, slug: "malherbe" },
      { name: "Saint-Martin", cp: "38100", type: "intramuros", pop: 4000, slug: "saint-martin" },
      { name: "Villeneuve", cp: "38100", type: "intramuros", pop: 12000, slug: "villeneuve" },
      { name: "Vigny-Musset", cp: "38100", type: "intramuros", pop: 5500, slug: "vigny-musset" },
      { name: "Beauvert", cp: "38100", type: "intramuros", pop: 4000, slug: "beauvert" },
      { name: "Abbaye / Jouhaux / Châtelet", cp: "38100", type: "intramuros", pop: 6500, slug: "abbaye" },
      { name: "Bouchayer-Viallet", cp: "38000", type: "intramuros", pop: 3500, slug: "bouchayer-viallet" },
      { name: "Presqu'île Scientifique", cp: "38000", type: "intramuros", pop: 3000, slug: "presquile" },
      { name: "Caserne de Bonne", cp: "38000", type: "intramuros", pop: 2500, slug: "caserne-de-bonne" },

      { name: "Saint-Martin-d'Hères", cp: "38400", insee: "38421", type: "banlieue", pop: 38800, slug: "saint-martin-d-heres" },
      { name: "Échirolles", cp: "38130", insee: "38151", type: "banlieue", pop: 36700, slug: "echirolles" },
      { name: "Fontaine", cp: "38600", insee: "38169", type: "banlieue", pop: 23200, slug: "fontaine" },
      { name: "Saint-Égrève", cp: "38120", insee: "38382", type: "banlieue", pop: 16700, slug: "saint-egreve" },
      { name: "Meylan", cp: "38240", insee: "38229", type: "banlieue", pop: 17800, slug: "meylan" },
      { name: "Eybens", cp: "38320", insee: "38158", type: "banlieue", pop: 9900, slug: "eybens" },
      { name: "La Tronche", cp: "38700", insee: "38516", type: "banlieue", pop: 7000, slug: "la-tronche" },
      { name: "Seyssins", cp: "38180", insee: "38485", type: "banlieue", pop: 7200, slug: "seyssins" },
      { name: "Seyssinet-Pariset", cp: "38170", insee: "38486", type: "banlieue", pop: 12200, slug: "seyssinet-pariset" },
      { name: "Saint-Martin-le-Vinoux", cp: "38950", insee: "38422", type: "banlieue", pop: 5800, slug: "saint-martin-le-vinoux" },
      { name: "Pont-de-Claix", cp: "38800", insee: "38317", type: "banlieue", pop: 12000, slug: "pont-de-claix" },
      { name: "Sassenage", cp: "38360", insee: "38474", type: "banlieue", pop: 11700, slug: "sassenage" },
      { name: "Gières", cp: "38610", insee: "38179", type: "banlieue", pop: 6700, slug: "gieres" },
      { name: "Corenc", cp: "38700", insee: "38126", type: "banlieue", pop: 4100, slug: "corenc" },
      { name: "Le Fontanil-Cornillon", cp: "38120", insee: "38170", type: "banlieue", pop: 2800, slug: "le-fontanil-cornillon" },

      { name: "Voiron", cp: "38500", insee: "38563", type: "agglo", pop: 21000, slug: "voiron" },
      { name: "Voreppe", cp: "38340", insee: "38565", type: "agglo", pop: 9700, slug: "voreppe" },
      { name: "Vif", cp: "38450", insee: "38545", type: "agglo", pop: 8400, slug: "vif" },
      { name: "Le Versoud", cp: "38420", insee: "38538", type: "agglo", pop: 4700, slug: "le-versoud" },
      { name: "Crolles", cp: "38920", insee: "38140", type: "agglo", pop: 8700, slug: "crolles" },
      { name: "Bernin", cp: "38190", insee: "38043", type: "agglo", pop: 3200, slug: "bernin" },
      { name: "Villard-Bonnot", cp: "38190", insee: "38547", type: "agglo", pop: 7600, slug: "villard-bonnot" },
      { name: "Domène", cp: "38420", insee: "38150", type: "agglo", pop: 6800, slug: "domene" },
      { name: "Murianette", cp: "38420", insee: "38271", type: "agglo", pop: 1100, slug: "murianette" },
      { name: "Champagnier", cp: "38800", insee: "38071", type: "agglo", pop: 1200, slug: "champagnier" },
      { name: "Champ-sur-Drac", cp: "38560", insee: "38074", type: "agglo", pop: 3100, slug: "champ-sur-drac" },
      { name: "Jarrie", cp: "38560", insee: "38200", type: "agglo", pop: 4000, slug: "jarrie" },
      { name: "Vizille", cp: "38220", insee: "38562", type: "agglo", pop: 7700, slug: "vizille" },
      { name: "Le Sappey-en-Chartreuse", cp: "38700", insee: "38473", type: "agglo", pop: 1200, slug: "le-sappey-en-chartreuse" },
      { name: "Saint-Ismier", cp: "38330", insee: "38397", type: "agglo", pop: 7100, slug: "saint-ismier" },
      { name: "Biviers", cp: "38330", insee: "38046", type: "agglo", pop: 2300, slug: "biviers" },
      { name: "Montbonnot-Saint-Martin", cp: "38330", insee: "38249", type: "agglo", pop: 5100, slug: "montbonnot-saint-martin" },
      { name: "Claix", cp: "38640", insee: "38111", type: "agglo", pop: 8200, slug: "claix" },
      { name: "Veurey-Voroize", cp: "38113", insee: "38540", type: "agglo", pop: 1600, slug: "veurey-voroize" },
      { name: "Noyarey", cp: "38360", insee: "38281", type: "agglo", pop: 2400, slug: "noyarey" },
      { name: "Varces-Allières-et-Risset", cp: "38760", insee: "38524", type: "agglo", pop: 8000, slug: "varces-allieres-et-risset" },
      { name: "Saint-Paul-de-Varces", cp: "38760", insee: "38437", type: "agglo", pop: 2100, slug: "saint-paul-de-varces" },
      { name: "Le Pont-de-Cheruy", cp: "38230", insee: "38316", type: "agglo", pop: 4700, slug: "le-pont-de-cheruy" },
      { name: "Tullins", cp: "38210", insee: "38520", type: "agglo", pop: 7800, slug: "tullins" },
      { name: "Moirans", cp: "38430", insee: "38239", type: "agglo", pop: 8200, slug: "moirans" },
      { name: "Saint-Marcellin", cp: "38160", insee: "38416", type: "agglo", pop: 8400, slug: "saint-marcellin" },
      { name: "Coublevie", cp: "38500", insee: "38132", type: "agglo", pop: 4600, slug: "coublevie" },
      { name: "La Buisse", cp: "38500", insee: "38059", type: "agglo", pop: 3200, slug: "la-buisse" },

      { name: "Allevard", cp: "38580", insee: "38006", type: "bassin", pop: 4200, slug: "allevard" },
      { name: "Lans-en-Vercors", cp: "38250", insee: "38205", type: "bassin", pop: 2700, slug: "lans-en-vercors" },
      { name: "Villard-de-Lans", cp: "38250", insee: "38548", type: "bassin", pop: 4100, slug: "villard-de-lans" },
      { name: "Autrans-Méaudre-en-Vercors", cp: "38112", insee: "38026", type: "bassin", pop: 3100, slug: "autrans-meaudre-en-vercors" },
      { name: "Mens", cp: "38710", insee: "38226", type: "bassin", pop: 1500, slug: "mens" },
      { name: "Monestier-de-Clermont", cp: "38650", insee: "38244", type: "bassin", pop: 1300, slug: "monestier-de-clermont" },
      { name: "La Mure", cp: "38350", insee: "38269", type: "bassin", pop: 5100, slug: "la-mure" },
      { name: "Bourg-d'Oisans", cp: "38520", insee: "38052", type: "bassin", pop: 3100, slug: "bourg-d-oisans" },
      { name: "Vinay", cp: "38470", insee: "38559", type: "bassin", pop: 4100, slug: "vinay" },
      { name: "Pont-en-Royans", cp: "38680", insee: "38319", type: "bassin", pop: 850, slug: "pont-en-royans" },
    ],
  },

  lyon: {
    ville: "Lyon",
    villeSlug: "lyon",
    departement: "Rhône / Métropole de Lyon",
    codeDept: "69",
    zones: [
      // Arrondissements
      { name: "Lyon 1er", cp: "69001", insee: "69381", type: "intramuros", pop: 28800, slug: "lyon-1er" },
      { name: "Lyon 2e", cp: "69002", insee: "69382", type: "intramuros", pop: 32100, slug: "lyon-2e" },
      { name: "Lyon 3e", cp: "69003", insee: "69383", type: "intramuros", pop: 105100, slug: "lyon-3e" },
      { name: "Lyon 4e", cp: "69004", insee: "69384", type: "intramuros", pop: 36400, slug: "lyon-4e" },
      { name: "Lyon 5e", cp: "69005", insee: "69385", type: "intramuros", pop: 47200, slug: "lyon-5e" },
      { name: "Lyon 6e", cp: "69006", insee: "69386", type: "intramuros", pop: 51100, slug: "lyon-6e" },
      { name: "Lyon 7e", cp: "69007", insee: "69387", type: "intramuros", pop: 87100, slug: "lyon-7e" },
      { name: "Lyon 8e", cp: "69008", insee: "69388", type: "intramuros", pop: 86400, slug: "lyon-8e" },
      { name: "Lyon 9e", cp: "69009", insee: "69389", type: "intramuros", pop: 51800, slug: "lyon-9e" },

      // Quartiers transversaux
      { name: "Vieux Lyon", cp: "69005", type: "intramuros", pop: 8000, slug: "vieux-lyon" },
      { name: "Croix-Rousse", cp: "69001", type: "intramuros", pop: 30000, slug: "croix-rousse" },
      { name: "Presqu'île", cp: "69002", type: "intramuros", pop: 20000, slug: "presquile" },
      { name: "Confluence", cp: "69002", type: "intramuros", pop: 8000, slug: "confluence" },
      { name: "Bellecour", cp: "69002", type: "intramuros", pop: 6000, slug: "bellecour" },
      { name: "Perrache", cp: "69002", type: "intramuros", pop: 5000, slug: "perrache" },
      { name: "Part-Dieu", cp: "69003", type: "intramuros", pop: 25000, slug: "part-dieu" },
      { name: "Montchat", cp: "69003", type: "intramuros", pop: 18000, slug: "montchat" },
      { name: "Villette / Paul Bert", cp: "69003", type: "intramuros", pop: 20000, slug: "villette-paul-bert" },
      { name: "Préfecture", cp: "69003", type: "intramuros", pop: 15000, slug: "prefecture" },
      { name: "Brotteaux", cp: "69006", type: "intramuros", pop: 18000, slug: "brotteaux" },
      { name: "Tête d'Or", cp: "69006", type: "intramuros", pop: 12000, slug: "tete-d-or" },
      { name: "Foch", cp: "69006", type: "intramuros", pop: 8000, slug: "foch" },
      { name: "Guillotière", cp: "69007", type: "intramuros", pop: 30000, slug: "guillotiere" },
      { name: "Gerland", cp: "69007", type: "intramuros", pop: 25000, slug: "gerland" },
      { name: "Jean Macé", cp: "69007", type: "intramuros", pop: 12000, slug: "jean-mace" },
      { name: "Mermoz", cp: "69008", type: "intramuros", pop: 15000, slug: "mermoz" },
      { name: "Monplaisir", cp: "69008", type: "intramuros", pop: 25000, slug: "monplaisir" },
      { name: "Bachut", cp: "69008", type: "intramuros", pop: 12000, slug: "bachut" },
      { name: "États-Unis", cp: "69008", type: "intramuros", pop: 18000, slug: "etats-unis" },
      { name: "Vaise", cp: "69009", type: "intramuros", pop: 25000, slug: "vaise" },
      { name: "La Duchère", cp: "69009", type: "intramuros", pop: 12000, slug: "la-duchere" },
      { name: "Saint-Rambert", cp: "69009", type: "intramuros", pop: 8000, slug: "saint-rambert" },
      { name: "Gorge de Loup", cp: "69009", type: "intramuros", pop: 5000, slug: "gorge-de-loup" },
      { name: "Champvert", cp: "69009", type: "intramuros", pop: 6500, slug: "champvert" },
      { name: "Point du Jour", cp: "69005", type: "intramuros", pop: 8000, slug: "point-du-jour" },
      { name: "Saint-Just", cp: "69005", type: "intramuros", pop: 6000, slug: "saint-just" },
      { name: "Fourvière", cp: "69005", type: "intramuros", pop: 4000, slug: "fourviere" },
      { name: "Ménival", cp: "69005", type: "intramuros", pop: 5500, slug: "menival" },

      // Métropole 1ère couronne
      { name: "Villeurbanne", cp: "69100", insee: "69266", type: "banlieue", pop: 156800, slug: "villeurbanne" },
      { name: "Caluire-et-Cuire", cp: "69300", insee: "69034", type: "banlieue", pop: 43100, slug: "caluire-et-cuire" },
      { name: "Vénissieux", cp: "69200", insee: "69259", type: "banlieue", pop: 65100, slug: "venissieux" },
      { name: "Vaulx-en-Velin", cp: "69120", insee: "69256", type: "banlieue", pop: 53100, slug: "vaulx-en-velin" },
      { name: "Bron", cp: "69500", insee: "69029", type: "banlieue", pop: 41000, slug: "bron" },
      { name: "Saint-Priest", cp: "69800", insee: "69290", type: "banlieue", pop: 47800, slug: "saint-priest" },
      { name: "Décines-Charpieu", cp: "69150", insee: "69275", type: "banlieue", pop: 28700, slug: "decines-charpieu" },
      { name: "Meyzieu", cp: "69330", insee: "69282", type: "banlieue", pop: 33700, slug: "meyzieu" },
      { name: "Rillieux-la-Pape", cp: "69140", insee: "69286", type: "banlieue", pop: 31200, slug: "rillieux-la-pape" },
      { name: "Tassin-la-Demi-Lune", cp: "69160", insee: "69249", type: "banlieue", pop: 22100, slug: "tassin-la-demi-lune" },
      { name: "Oullins", cp: "69600", insee: "69149", type: "banlieue", pop: 26600, slug: "oullins" },
      { name: "Pierre-Bénite", cp: "69310", insee: "69152", type: "banlieue", pop: 10700, slug: "pierre-benite" },
      { name: "Saint-Fons", cp: "69190", insee: "69199", type: "banlieue", pop: 19200, slug: "saint-fons" },
      { name: "Sainte-Foy-lès-Lyon", cp: "69110", insee: "69202", type: "banlieue", pop: 22400, slug: "sainte-foy-les-lyon" },
      { name: "Francheville", cp: "69340", insee: "69089", type: "banlieue", pop: 13800, slug: "francheville" },
      { name: "Écully", cp: "69130", insee: "69081", type: "banlieue", pop: 18700, slug: "ecully" },
      { name: "Champagne-au-Mont-d'Or", cp: "69410", insee: "69040", type: "banlieue", pop: 5700, slug: "champagne-au-mont-d-or" },
      { name: "Dardilly", cp: "69570", insee: "69072", type: "banlieue", pop: 8900, slug: "dardilly" },
      { name: "Limonest", cp: "69760", insee: "69116", type: "banlieue", pop: 3700, slug: "limonest" },
      { name: "Saint-Didier-au-Mont-d'Or", cp: "69370", insee: "69191", type: "banlieue", pop: 7200, slug: "saint-didier-au-mont-d-or" },
      { name: "Saint-Cyr-au-Mont-d'Or", cp: "69450", insee: "69191", type: "banlieue", pop: 5800, slug: "saint-cyr-au-mont-d-or" },
      { name: "Collonges-au-Mont-d'Or", cp: "69660", insee: "69063", type: "banlieue", pop: 4100, slug: "collonges-au-mont-d-or" },
      { name: "Fontaines-sur-Saône", cp: "69270", insee: "69088", type: "banlieue", pop: 7100, slug: "fontaines-sur-saone" },
      { name: "Couzon-au-Mont-d'Or", cp: "69270", insee: "69068", type: "banlieue", pop: 2800, slug: "couzon-au-mont-d-or" },
      { name: "Saint-Genis-Laval", cp: "69230", insee: "69204", type: "banlieue", pop: 22000, slug: "saint-genis-laval" },
      { name: "Irigny", cp: "69540", insee: "69100", type: "banlieue", pop: 8700, slug: "irigny" },
      { name: "Charbonnières-les-Bains", cp: "69260", insee: "69044", type: "banlieue", pop: 5200, slug: "charbonnieres-les-bains" },
      { name: "La Tour-de-Salvagny", cp: "69890", insee: "69250", type: "banlieue", pop: 4200, slug: "la-tour-de-salvagny" },
      { name: "Marcy-l'Étoile", cp: "69280", insee: "69127", type: "banlieue", pop: 3800, slug: "marcy-l-etoile" },
      { name: "Craponne", cp: "69290", insee: "69069", type: "banlieue", pop: 11600, slug: "craponne" },
      { name: "Montanay", cp: "69250", insee: "69284", type: "banlieue", pop: 2800, slug: "montanay" },
      { name: "Sathonay-Camp", cp: "69580", insee: "69292", type: "banlieue", pop: 5700, slug: "sathonay-camp" },
      { name: "Sathonay-Village", cp: "69580", insee: "69293", type: "banlieue", pop: 2200, slug: "sathonay-village" },
      { name: "Chassieu", cp: "69680", insee: "69271", type: "banlieue", pop: 11100, slug: "chassieu" },
      { name: "Genas", cp: "69740", insee: "69277", type: "banlieue", pop: 13100, slug: "genas" },
      { name: "Mions", cp: "69780", insee: "69283", type: "banlieue", pop: 14200, slug: "mions" },
      { name: "Corbas", cp: "69960", insee: "69273", type: "banlieue", pop: 11700, slug: "corbas" },
      { name: "Feyzin", cp: "69320", insee: "69276", type: "banlieue", pop: 10100, slug: "feyzin" },
      { name: "Solaize", cp: "69360", insee: "69296", type: "banlieue", pop: 3100, slug: "solaize" },
      { name: "Vernaison", cp: "69390", insee: "69260", type: "banlieue", pop: 5300, slug: "vernaison" },
      { name: "Charly", cp: "69390", insee: "69046", type: "banlieue", pop: 4700, slug: "charly" },
      { name: "Givors", cp: "69700", insee: "69091", type: "banlieue", pop: 19800, slug: "givors" },
      { name: "Grigny", cp: "69520", insee: "69094", type: "banlieue", pop: 8800, slug: "grigny" },
      { name: "Lentilly", cp: "69210", insee: "69112", type: "banlieue", pop: 6100, slug: "lentilly" },
      { name: "L'Arbresle", cp: "69210", insee: "69010", type: "banlieue", pop: 6100, slug: "l-arbresle" },

      // Bassin
      { name: "Villefranche-sur-Saône", cp: "69400", insee: "69264", type: "bassin", pop: 36700, slug: "villefranche-sur-saone" },
      { name: "Anse", cp: "69480", insee: "69009", type: "bassin", pop: 8400, slug: "anse" },
      { name: "Belleville-en-Beaujolais", cp: "69220", insee: "69019", type: "bassin", pop: 13600, slug: "belleville-en-beaujolais" },
      { name: "Tarare", cp: "69170", insee: "69243", type: "bassin", pop: 11100, slug: "tarare" },
      { name: "L'Isle-d'Abeau", cp: "38080", insee: "38193", type: "bassin", pop: 17200, slug: "l-isle-d-abeau" },
      { name: "Bourgoin-Jallieu", cp: "38300", insee: "38053", type: "bassin", pop: 28800, slug: "bourgoin-jallieu" },
      { name: "Pont-de-Chéruy", cp: "38230", insee: "38316", type: "bassin", pop: 4700, slug: "pont-de-cheruy" },
      { name: "Heyrieux", cp: "38540", insee: "38189", type: "bassin", pop: 5100, slug: "heyrieux" },
      { name: "Saint-Symphorien-d'Ozon", cp: "69360", insee: "69297", type: "bassin", pop: 6600, slug: "saint-symphorien-d-ozon" },
      { name: "Communay", cp: "69360", insee: "69069", type: "bassin", pop: 4600, slug: "communay" },
      { name: "Sérézin-du-Rhône", cp: "69360", insee: "69294", type: "bassin", pop: 3200, slug: "serezin-du-rhone" },
      { name: "Brignais", cp: "69530", insee: "69027", type: "bassin", pop: 12200, slug: "brignais" },
      { name: "Chaponost", cp: "69630", insee: "69043", type: "bassin", pop: 9100, slug: "chaponost" },
      { name: "Mornant", cp: "69440", insee: "69141", type: "bassin", pop: 6200, slug: "mornant" },
      { name: "Saint-Laurent-de-Mure", cp: "69720", insee: "69288", type: "bassin", pop: 6200, slug: "saint-laurent-de-mure" },
      { name: "Pusignan", cp: "69330", insee: "69285", type: "bassin", pop: 4800, slug: "pusignan" },
      { name: "Jonage", cp: "69330", insee: "69279", type: "bassin", pop: 6700, slug: "jonage" },
      { name: "Villette-d'Anthon", cp: "38280", insee: "38556", type: "bassin", pop: 4700, slug: "villette-d-anthon" },
    ],
  },

  valence: {
    ville: "Valence",
    villeSlug: "valence",
    departement: "Drôme",
    codeDept: "26",
    zones: [
      { name: "Centre-Ville / Champ de Mars", cp: "26000", type: "intramuros", pop: 7000, slug: "centre-ville" },
      { name: "Vieux Valence", cp: "26000", type: "intramuros", pop: 3500, slug: "vieux-valence" },
      { name: "Calvaire / Saint-Jean", cp: "26000", type: "intramuros", pop: 5000, slug: "calvaire" },
      { name: "Polygone", cp: "26000", type: "intramuros", pop: 6500, slug: "polygone" },
      { name: "Fontbarlettes", cp: "26000", type: "intramuros", pop: 6800, slug: "fontbarlettes" },
      { name: "Le Plan", cp: "26000", type: "intramuros", pop: 3800, slug: "le-plan" },
      { name: "Mistral / Valensolles", cp: "26000", type: "intramuros", pop: 5200, slug: "mistral" },
      { name: "Chamberlière", cp: "26000", type: "intramuros", pop: 4500, slug: "chamberliere" },
      { name: "Saint-Nicolas", cp: "26000", type: "intramuros", pop: 3500, slug: "saint-nicolas" },
      { name: "Briffaut", cp: "26000", type: "intramuros", pop: 3200, slug: "briffaut" },
      { name: "Latour-Maubourg", cp: "26000", type: "intramuros", pop: 4000, slug: "latour-maubourg" },
      { name: "Beauregard / Beausoleil", cp: "26000", type: "intramuros", pop: 3000, slug: "beauregard" },
      { name: "Châteauvert", cp: "26000", type: "intramuros", pop: 3500, slug: "chateauvert" },
      { name: "Hugo / Préfecture", cp: "26000", type: "intramuros", pop: 4200, slug: "hugo" },
      { name: "Marcs", cp: "26000", type: "intramuros", pop: 2500, slug: "marcs" },

      { name: "Bourg-lès-Valence", cp: "26500", insee: "26058", type: "banlieue", pop: 19700, slug: "bourg-les-valence" },
      { name: "Bourg-de-Péage", cp: "26300", insee: "26057", type: "banlieue", pop: 10600, slug: "bourg-de-peage" },
      { name: "Portes-lès-Valence", cp: "26800", insee: "26252", type: "banlieue", pop: 10400, slug: "portes-les-valence" },
      { name: "Saint-Marcel-lès-Valence", cp: "26320", insee: "26313", type: "banlieue", pop: 5800, slug: "saint-marcel-les-valence" },
      { name: "Saint-Péray", cp: "07130", insee: "07281", type: "banlieue", pop: 7800, slug: "saint-peray" },
      { name: "Guilherand-Granges", cp: "07500", insee: "07102", type: "banlieue", pop: 11600, slug: "guilherand-granges" },
      { name: "Soyons", cp: "07130", insee: "07314", type: "banlieue", pop: 1900, slug: "soyons" },
      { name: "Cornas", cp: "07130", insee: "07069", type: "banlieue", pop: 2500, slug: "cornas" },
      { name: "Châteauneuf-sur-Isère", cp: "26300", insee: "26085", type: "banlieue", pop: 3600, slug: "chateauneuf-sur-isere" },
      { name: "Beaumont-lès-Valence", cp: "26760", insee: "26035", type: "banlieue", pop: 4100, slug: "beaumont-les-valence" },
      { name: "Étoile-sur-Rhône", cp: "26800", insee: "26124", type: "banlieue", pop: 5300, slug: "etoile-sur-rhone" },
      { name: "Malissard", cp: "26120", insee: "26167", type: "banlieue", pop: 3200, slug: "malissard" },
      { name: "Chabeuil", cp: "26120", insee: "26064", type: "banlieue", pop: 7100, slug: "chabeuil" },
      { name: "Montélier", cp: "26120", insee: "26197", type: "banlieue", pop: 3700, slug: "montelier" },
      { name: "Alixan", cp: "26300", insee: "26004", type: "banlieue", pop: 2800, slug: "alixan" },

      { name: "Romans-sur-Isère", cp: "26100", insee: "26281", type: "agglo", pop: 33700, slug: "romans-sur-isere" },
      { name: "Tain-l'Hermitage", cp: "26600", insee: "26347", type: "agglo", pop: 5700, slug: "tain-l-hermitage" },
      { name: "Tournon-sur-Rhône", cp: "07300", insee: "07324", type: "agglo", pop: 11100, slug: "tournon-sur-rhone" },
      { name: "Mauves", cp: "07300", insee: "07158", type: "agglo", pop: 1700, slug: "mauves" },
      { name: "Saint-Jean-de-Muzols", cp: "07300", insee: "07237", type: "agglo", pop: 2600, slug: "saint-jean-de-muzols" },
      { name: "Vernoux-en-Vivarais", cp: "07240", insee: "07344", type: "agglo", pop: 2100, slug: "vernoux-en-vivarais" },
      { name: "Privas", cp: "07000", insee: "07186", type: "agglo", pop: 8100, slug: "privas" },
      { name: "Le Pouzin", cp: "07250", insee: "07185", type: "agglo", pop: 2700, slug: "le-pouzin" },
      { name: "La Voulte-sur-Rhône", cp: "07800", insee: "07350", type: "agglo", pop: 4800, slug: "la-voulte-sur-rhone" },
      { name: "Saint-Vallier", cp: "26240", insee: "26333", type: "agglo", pop: 4100, slug: "saint-vallier" },
      { name: "Crest", cp: "26400", insee: "26108", type: "agglo", pop: 8100, slug: "crest" },
      { name: "Livron-sur-Drôme", cp: "26250", insee: "26165", type: "agglo", pop: 9100, slug: "livron-sur-drome" },
      { name: "Loriol-sur-Drôme", cp: "26270", insee: "26166", type: "agglo", pop: 6600, slug: "loriol-sur-drome" },

      { name: "Montélimar", cp: "26200", insee: "26198", type: "bassin", pop: 39800, slug: "montelimar" },
      { name: "Pierrelatte", cp: "26700", insee: "26235", type: "bassin", pop: 13800, slug: "pierrelatte" },
      { name: "Aubenas", cp: "07200", insee: "07019", type: "bassin", pop: 12200, slug: "aubenas" },
      { name: "Annonay", cp: "07100", insee: "07010", type: "bassin", pop: 16100, slug: "annonay" },
      { name: "Die", cp: "26150", insee: "26113", type: "bassin", pop: 4600, slug: "die" },
      { name: "Saillans", cp: "26340", insee: "26301", type: "bassin", pop: 1350, slug: "saillans" },
    ],
  },
};

// Helpers
export function getZonesForVille(villeSlug: string): Zone[] {
  return ZONES_SEO[villeSlug]?.zones ?? [];
}

export function getAllZones(): Array<{ ville: string; villeSlug: string; zone: Zone }> {
  return Object.values(ZONES_SEO).flatMap((v) =>
    v.zones.map((z) => ({ ville: v.ville, villeSlug: v.villeSlug, zone: z }))
  );
}

export function findZoneBySlug(villeSlug: string, zoneSlug: string): Zone | undefined {
  return ZONES_SEO[villeSlug]?.zones.find((z) => z.slug === zoneSlug);
}

// Pour le sitemap : zones triées par poids SEO (population × type)
export function getPrioritizedZones(): Zone[] {
  const typeWeight: Record<ZoneType, number> = {
    intramuros: 1.0,
    "commune-deleguee": 0.95,
    banlieue: 0.85,
    agglo: 0.7,
    bassin: 0.5,
  };
  return getAllZones()
    .map(({ zone }) => ({ ...zone, score: zone.pop * typeWeight[zone.type] }))
    .sort((a, b) => b.score - a.score);
}
```

---

## NOTES & RECOMMANDATIONS SEO

### Priorisation de déploiement
1. **Phase 1 (mois 1)** : 9 arrondissements de Lyon + Villeurbanne + 5 villes centres = 15 pages (plus gros volume de recherche)
2. **Phase 2 (mois 2)** : ~50 banlieues immédiates (population > 5 000) — quick wins de longue traîne
3. **Phase 3 (mois 3)** : ~100 quartiers intramuros — différentiateur SEO local fort
4. **Phase 4 (mois 4-6)** : Reste (agglo + bassin + petits quartiers)

### Maillage interne
- Page ville centre → liste tous les quartiers + communes liées avec lien
- Page quartier/commune → breadcrumb (ville centre > zone) + 3-5 zones voisines
- Page artisan → mention de la zone d'intervention principale + zones adjacentes desservies

### Schema.org recommandé par zone
- `@type: Place` pour le quartier + `containedInPlace` (la ville centre)
- `@type: AdministrativeArea` pour les communes
- `@type: ItemList` listant les artisans par métier sur la zone
- `geo: GeoCoordinates` (à compléter avec lat/lng INSEE)

### Vigilance
- **Doublons de slugs** : "centre-ville" existe pour les 5 villes — la clé doit être `{villeSlug}/{zoneSlug}` pour rester unique.
- **Saint-Martin** : 6 communes différentes en France — toujours préfixer par la ville/département.
- **Codes INSEE Lyon** : les arrondissements ont leur propre code INSEE (69381 à 69389), distinct du code commune principale (69123).
- **Cran-Gevrier / Annecy-le-Vieux / Seynod / Meythet / Pringy** : depuis 2017, communes déléguées d'Annecy — n'ont plus de code INSEE actif distinct, mais le CP historique reste utilisé localement.
