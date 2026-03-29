import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEO_DATA: Record<string, { seoTitle: string; seoDescription: string; contenuSeo: string }> = {
  chambery: {
    seoTitle: "Artisans du bâtiment à Chambéry | Plombier, Électricien, Peintre — Bativio",
    seoDescription: "Trouvez un artisan qualifié à Chambéry et en Savoie. Plombier, électricien, peintre, maçon, carreleur. Devis gratuit, zéro commission. Artisans vérifiés.",
    contenuSeo: `<h2>Trouvez votre artisan de confiance à Chambéry</h2>
<p>Bativio vous connecte avec les meilleurs artisans du bâtiment à Chambéry et dans l'agglomération chambérienne. Que vous cherchiez un <strong>plombier à Chambéry</strong> pour une fuite urgente, un <strong>électricien</strong> pour une mise aux normes, ou un <strong>peintre</strong> pour rafraîchir votre appartement, nos artisans sont qualifiés, assurés et disponibles.</p>
<h3>Tous les métiers du bâtiment à portée de clic</h3>
<p>Notre annuaire couvre l'ensemble des corps de métier du bâtiment en Savoie : plomberie, électricité, peinture, maçonnerie, carrelage, menuiserie, couverture, chauffage, serrurerie et cuisine. Chaque artisan inscrit sur Bativio est un professionnel vérifié — SIRET validé, assurance décennale à jour, qualifications contrôlées.</p>
<h3>Chambéry et communes environnantes</h3>
<p>Nos artisans interviennent à Chambéry mais aussi dans les communes voisines : Cognin, La Ravoire, La Motte-Servolex, Bassens, Saint-Alban-Leysse, Bissy, Jacob-Bellecombette, Barberaz, Barby et Challes-les-Eaux. Chaque artisan définit sa zone d'intervention — vous voyez immédiatement s'il peut se déplacer chez vous.</p>
<h3>Demandez un devis gratuit en 2 minutes</h3>
<p>Décrivez votre besoin, recevez un devis personnalisé de l'artisan. Zéro commission : le prix affiché est le prix que vous payez. Bativio ne prend aucune commission sur les travaux réalisés.</p>`,
  },
  annecy: {
    seoTitle: "Artisans du bâtiment à Annecy | Plombier, Électricien, Peintre — Bativio",
    seoDescription: "Trouvez un artisan qualifié à Annecy et en Haute-Savoie. Devis gratuit, artisans vérifiés, zéro commission. Plombier, électricien, peintre, maçon.",
    contenuSeo: `<h2>Vos artisans de confiance à Annecy</h2>
<p>Annecy est l'une des villes les plus dynamiques de Haute-Savoie en matière de rénovation et de construction. Entre les appartements du centre-ville historique et les maisons des communes alentour, la demande en artisans qualifiés est forte. Bativio vous permet de trouver rapidement un <strong>artisan à Annecy</strong> — plombier, électricien, peintre, maçon ou carreleur.</p>
<h3>Un marché immobilier qui pousse la rénovation</h3>
<p>Avec un prix moyen au m² parmi les plus élevés de la région, les propriétaires annéciens investissent dans la rénovation pour valoriser leur bien. <strong>Rénovation de salle de bain à Annecy</strong>, mise aux normes électriques, isolation thermique — les artisans Bativio maîtrisent ces prestations.</p>
<h3>Intervention sur toute l'agglomération</h3>
<p>Nos artisans couvrent Annecy et les communes de l'agglomération : Cran-Gevrier, Seynod, Meythet, Pringy, Argonay, Épagny Metz-Tessy, Poisy et Sillingy. Certains interviennent également autour du lac jusqu'à Talloires, Menthon-Saint-Bernard et Veyrier-du-Lac.</p>
<h3>Artisans certifiés RGE en Haute-Savoie</h3>
<p>Pour vos travaux de rénovation énergétique à Annecy, faites appel à un artisan <strong>RGE (Reconnu Garant de l'Environnement)</strong>. C'est indispensable pour bénéficier de MaPrimeRénov' et des aides CEE. Bativio vérifie automatiquement la certification RGE de chaque artisan inscrit.</p>`,
  },
  grenoble: {
    seoTitle: "Artisans du bâtiment à Grenoble | Plombier, Électricien, Peintre — Bativio",
    seoDescription: "Artisans qualifiés à Grenoble et en Isère. Plombier, électricien, peintre, maçon. Devis gratuit en ligne, zéro commission, artisans vérifiés.",
    contenuSeo: `<h2>Artisans du bâtiment à Grenoble et en Isère</h2>
<p>Grenoble et sa métropole concentrent une forte demande en travaux du bâtiment. Rénovation d'appartements en centre-ville, construction dans les communes de la cuvette, réhabilitation de maisons en montagne — les artisans grenoblois sont sollicités sur des chantiers variés et exigeants.</p>
<h3>Des artisans adaptés au bâti grenoblois</h3>
<p>Le parc immobilier grenoblois a ses spécificités : immeubles des années 60-70 à rénover, maisons anciennes du centre historique, constructions récentes dans les éco-quartiers. Trouver un <strong>plombier à Grenoble</strong> qui connaît ces contraintes, ou un <strong>électricien</strong> capable de mettre aux normes un tableau des années 80, c'est ce que Bativio vous propose.</p>
<h3>Grenoble métropole et alentours</h3>
<p>Nos artisans interviennent dans toute la métropole grenobloise : Saint-Martin-d'Hères, Échirolles, Fontaine, Meylan, La Tronche, Seyssinet-Pariset, Saint-Égrève, Sassenage, Claix et Corenc.</p>
<h3>Rénovation énergétique dans les Alpes</h3>
<p>Avec des hivers rigoureux, l'isolation et le chauffage sont des enjeux majeurs à Grenoble. Nos artisans <strong>RGE qualifiés</strong> vous accompagnent sur l'isolation thermique, le remplacement de chaudière, l'installation de pompes à chaleur.</p>`,
  },
  lyon: {
    seoTitle: "Artisans du bâtiment à Lyon | Plombier, Électricien, Peintre — Bativio",
    seoDescription: "Trouvez un artisan de confiance à Lyon et dans le Rhône. Plombier, électricien, peintre, maçon, carreleur. Devis gratuit, zéro commission.",
    contenuSeo: `<h2>Trouvez un artisan qualifié à Lyon</h2>
<p>Lyon est le deuxième marché de la rénovation en France après Paris. Avec un parc immobilier qui va des immeubles haussmanniens de la Presqu'île aux résidences modernes de la Part-Dieu, les besoins en artisans qualifiés sont considérables. Bativio vous donne accès à des <strong>artisans vérifiés à Lyon</strong> en quelques clics.</p>
<h3>Tous les arrondissements couverts</h3>
<p>Que vous soyez dans le 1er, le 3ème, le 6ème ou le 8ème arrondissement, nos artisans se déplacent dans tout Lyon. Nos professionnels interviennent également à Villeurbanne, Caluire-et-Cuire, Vénissieux, Bron, Oullins, Vaulx-en-Velin et Saint-Priest.</p>
<h3>Le défi des immeubles lyonnais</h3>
<p>Les immeubles anciens lyonnais — avec leurs traboules, leurs cours intérieures et leurs étages sans ascenseur — demandent des artisans habitués à ces contraintes. <strong>Plomberie dans un appartement canut</strong>, rénovation électrique d'un immeuble classé, peinture dans des volumes atypiques : nos artisans connaissent le bâti lyonnais.</p>
<h3>Zéro commission, même à Lyon</h3>
<p>Contrairement aux plateformes qui prélèvent jusqu'à 20% du montant des travaux, Bativio ne prend aucune commission. Le prix du devis est le prix que vous payez.</p>`,
  },
  valence: {
    seoTitle: "Artisans du bâtiment à Valence | Plombier, Électricien, Peintre — Bativio",
    seoDescription: "Artisans qualifiés à Valence et dans la Drôme. Plombier, électricien, peintre, maçon. Devis gratuit, zéro commission, professionnels vérifiés.",
    contenuSeo: `<h2>Artisans du bâtiment à Valence et dans la Drôme</h2>
<p>Valence, porte du Midi, est une ville en plein développement qui attire de plus en plus de familles et de professionnels. Les projets de rénovation et de construction se multiplient, et trouver un <strong>artisan fiable à Valence</strong> devient un vrai besoin. Bativio vous connecte avec des professionnels du bâtiment qualifiés et vérifiés dans la Drôme.</p>
<h3>Un bassin de vie dynamique</h3>
<p>L'agglomération valentinoise offre un cadre de vie attractif avec des prix immobiliers plus accessibles que Lyon ou Annecy. Les chantiers de rénovation sont nombreux : maisons de ville du centre, pavillons des quartiers résidentiels, appartements récents.</p>
<h3>Valence et communes voisines</h3>
<p>Nos artisans couvrent Valence et ses environs : Bourg-lès-Valence, Portes-lès-Valence, Guilherand-Granges, Saint-Péray, Beaumont-lès-Valence, Chabeuil et Montélier.</p>
<h3>Des devis adaptés au marché drômois</h3>
<p>Les prix des travaux à Valence sont généralement inférieurs de 15 à 25% par rapport à Lyon. Nos artisans proposent des devis adaptés au marché local, transparents et sans surprise.</p>`,
  },
};

export async function seedSeo() {
  console.log("  Seeding SEO content...");
  for (const [slug, data] of Object.entries(SEO_DATA)) {
    await prisma.ville.update({
      where: { slug },
      data: {
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        contenuSeo: data.contenuSeo,
      },
    });
  }
  console.log(`  ${Object.keys(SEO_DATA).length} villes SEO`);
}
