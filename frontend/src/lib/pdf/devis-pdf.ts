import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from "pdf-lib";

interface LigneDevis {
  label: string;
  description?: string;
  qte: number;
  unite: string;
  puHt: number;
  totalHt: number;
  tva: number;
}

export interface DevisPdfInput {
  numero: string;
  date: Date;
  validiteJours: number;
  artisan: {
    nomAffichage: string;
    raisonSociale?: string | null;
    siret: string;
    adresse?: string | null;
    codePostal?: string | null;
    ville?: string | null;
    telephone?: string;
    email?: string | null;
    assuranceNom?: string | null;
    assuranceNumero?: string | null;
    logo?: string | null;
  };
  client: {
    nom: string;
    email?: string | null;
    telephone?: string | null;
    adresse?: string | null;
  };
  objet: string;
  lignes: LigneDevis[];
  totalHt: number;
  totalTva: number;
  totalTtc: number;
  dureeEstimee?: string | null;
  conditionsPaiement?: string | null;
  notes?: string | null;
  couleurAccent?: string;
}

const TERRE = rgb(196 / 255, 83 / 255, 26 / 255);
const BOIS = rgb(61 / 255, 46 / 255, 31 / 255);
const GRIS = rgb(107 / 255, 101 / 255, 96 / 255);
const SABLE = rgb(232 / 255, 213 / 255, 192 / 255);
const CREME = rgb(250 / 255, 248 / 255, 245 / 255);

export async function generateDevisPdf(input: DevisPdfInput): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helv = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const margin = 40;
  let y = height - margin;

  // ══════ HEADER ══════
  page.drawRectangle({
    x: 0,
    y: height - 90,
    width,
    height: 90,
    color: CREME,
  });
  page.drawRectangle({
    x: 0,
    y: height - 93,
    width,
    height: 3,
    color: TERRE,
  });

  page.drawText("DEVIS", {
    x: margin,
    y: height - 50,
    size: 28,
    font: helvBold,
    color: BOIS,
  });

  page.drawText(input.numero, {
    x: margin,
    y: height - 73,
    size: 11,
    font: helv,
    color: GRIS,
  });

  // Date + validité à droite
  const dateStr = input.date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const validiteDate = new Date(input.date.getTime() + input.validiteJours * 24 * 60 * 60 * 1000);
  const validiteStr = validiteDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  page.drawText(`Date d'émission : ${dateStr}`, {
    x: width - margin - 180,
    y: height - 45,
    size: 9,
    font: helv,
    color: GRIS,
  });
  page.drawText(`Valide jusqu'au ${validiteStr}`, {
    x: width - margin - 180,
    y: height - 58,
    size: 9,
    font: helv,
    color: GRIS,
  });
  page.drawText(`Durée ${input.validiteJours} jours`, {
    x: width - margin - 180,
    y: height - 71,
    size: 9,
    font: helvItalic,
    color: TERRE,
  });

  y = height - 120;

  // ══════ ARTISAN + CLIENT ══════
  const colWidth = (width - 2 * margin - 20) / 2;

  // Artisan
  page.drawText("ÉMETTEUR", { x: margin, y, size: 8, font: helvBold, color: GRIS });
  page.drawText(input.artisan.raisonSociale || input.artisan.nomAffichage, {
    x: margin,
    y: y - 14,
    size: 12,
    font: helvBold,
    color: BOIS,
  });
  y -= 26;
  const artisanLines = [
    input.artisan.adresse,
    [input.artisan.codePostal, input.artisan.ville].filter(Boolean).join(" "),
    `SIRET : ${input.artisan.siret}`,
    input.artisan.telephone ? `Tél : ${input.artisan.telephone}` : null,
    input.artisan.email ? `Email : ${input.artisan.email}` : null,
    input.artisan.assuranceNom ? `Assurance : ${input.artisan.assuranceNom}${input.artisan.assuranceNumero ? ` n°${input.artisan.assuranceNumero}` : ""}` : null,
  ].filter(Boolean) as string[];
  let artisanY = y;
  for (const line of artisanLines) {
    page.drawText(line, { x: margin, y: artisanY, size: 9, font: helv, color: GRIS });
    artisanY -= 12;
  }

  // Client
  const cliX = margin + colWidth + 20;
  page.drawText("DESTINATAIRE", { x: cliX, y, size: 8, font: helvBold, color: GRIS });
  page.drawText(input.client.nom, {
    x: cliX,
    y: y - 14,
    size: 12,
    font: helvBold,
    color: BOIS,
  });
  let cliY = y - 26;
  const cliLines = [
    input.client.adresse,
    input.client.telephone ? `Tél : ${input.client.telephone}` : null,
    input.client.email ? `Email : ${input.client.email}` : null,
  ].filter(Boolean) as string[];
  for (const line of cliLines) {
    page.drawText(line, { x: cliX, y: cliY, size: 9, font: helv, color: GRIS });
    cliY -= 12;
  }

  y = Math.min(artisanY, cliY) - 30;

  // ══════ OBJET ══════
  page.drawText("OBJET", { x: margin, y, size: 8, font: helvBold, color: GRIS });
  y -= 14;
  drawWrappedText(page, input.objet, margin, y, width - 2 * margin, 11, helv, BOIS);
  y -= 30;

  // ══════ TABLEAU LIGNES ══════
  const tableX = margin;
  const tableWidth = width - 2 * margin;
  const colDesign = 0.52 * tableWidth;
  const colQte = 0.1 * tableWidth;
  const colUnite = 0.08 * tableWidth;
  const colPu = 0.12 * tableWidth;
  const colTotal = 0.18 * tableWidth;

  // Header table
  page.drawRectangle({ x: tableX, y: y - 20, width: tableWidth, height: 22, color: BOIS });
  page.drawText("Désignation", { x: tableX + 8, y: y - 14, size: 9, font: helvBold, color: rgb(1, 1, 1) });
  page.drawText("Qté", { x: tableX + colDesign + 4, y: y - 14, size: 9, font: helvBold, color: rgb(1, 1, 1) });
  page.drawText("Unité", { x: tableX + colDesign + colQte + 4, y: y - 14, size: 9, font: helvBold, color: rgb(1, 1, 1) });
  page.drawText("PU HT", { x: tableX + colDesign + colQte + colUnite + 4, y: y - 14, size: 9, font: helvBold, color: rgb(1, 1, 1) });
  page.drawText("Total HT", { x: tableX + colDesign + colQte + colUnite + colPu + 4, y: y - 14, size: 9, font: helvBold, color: rgb(1, 1, 1) });
  y -= 28;

  // Lignes
  for (const l of input.lignes) {
    if (y < 180) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = page.getSize().height - margin;
    }
    const rowHeight = l.description ? 32 : 20;
    page.drawRectangle({ x: tableX, y: y - rowHeight + 4, width: tableWidth, height: rowHeight - 4, color: CREME });
    page.drawText(truncate(l.label, 55), { x: tableX + 8, y: y - 10, size: 9, font: helvBold, color: BOIS });
    if (l.description) {
      page.drawText(truncate(l.description, 75), { x: tableX + 8, y: y - 22, size: 8, font: helvItalic, color: GRIS });
    }
    page.drawText(l.qte.toLocaleString("fr-FR"), { x: tableX + colDesign + 4, y: y - 10, size: 9, font: helv, color: BOIS });
    page.drawText(l.unite, { x: tableX + colDesign + colQte + 4, y: y - 10, size: 9, font: helv, color: BOIS });
    page.drawText(`${l.puHt.toLocaleString("fr-FR")} €`, { x: tableX + colDesign + colQte + colUnite + 4, y: y - 10, size: 9, font: helv, color: BOIS });
    page.drawText(`${l.totalHt.toLocaleString("fr-FR")} €`, { x: tableX + colDesign + colQte + colUnite + colPu + 4, y: y - 10, size: 9, font: helvBold, color: BOIS });
    y -= rowHeight + 2;
  }

  y -= 10;

  // ══════ TOTAUX ══════
  const totalX = width - margin - 220;
  const totalW = 220;
  page.drawLine({ start: { x: totalX, y }, end: { x: totalX + totalW, y }, thickness: 1, color: SABLE });
  y -= 14;
  page.drawText("Total HT", { x: totalX, y, size: 10, font: helv, color: GRIS });
  page.drawText(`${input.totalHt.toLocaleString("fr-FR")} €`, { x: totalX + totalW - 70, y, size: 10, font: helvBold, color: BOIS });
  y -= 14;
  page.drawText("TVA", { x: totalX, y, size: 10, font: helv, color: GRIS });
  page.drawText(`${input.totalTva.toLocaleString("fr-FR")} €`, { x: totalX + totalW - 70, y, size: 10, font: helvBold, color: BOIS });
  y -= 14;
  page.drawLine({ start: { x: totalX, y: y + 3 }, end: { x: totalX + totalW, y: y + 3 }, thickness: 1, color: TERRE });
  y -= 10;
  page.drawText("TOTAL TTC", { x: totalX, y, size: 12, font: helvBold, color: BOIS });
  page.drawText(`${input.totalTtc.toLocaleString("fr-FR")} €`, { x: totalX + totalW - 80, y, size: 14, font: helvBold, color: TERRE });

  y -= 40;

  // ══════ CONDITIONS ══════
  if (input.dureeEstimee || input.conditionsPaiement || input.notes) {
    page.drawText("CONDITIONS", { x: margin, y, size: 8, font: helvBold, color: GRIS });
    y -= 14;

    if (input.dureeEstimee) {
      page.drawText(`Durée estimée : ${input.dureeEstimee}`, { x: margin, y, size: 9, font: helv, color: BOIS });
      y -= 13;
    }
    if (input.conditionsPaiement) {
      y = drawWrappedText(page, `Paiement : ${input.conditionsPaiement}`, margin, y, width - 2 * margin, 9, helv, BOIS);
      y -= 6;
    }
    if (input.notes) {
      y = drawWrappedText(page, `Notes : ${input.notes}`, margin, y, width - 2 * margin, 9, helvItalic, GRIS);
      y -= 6;
    }
  }

  y -= 20;

  // ══════ SIGNATURE ══════
  if (y < 140) {
    page = pdfDoc.addPage([595.28, 841.89]);
    y = page.getSize().height - margin;
  }

  page.drawRectangle({ x: margin, y: y - 100, width: width - 2 * margin, height: 100, borderColor: SABLE, borderWidth: 1, color: rgb(1, 1, 1) });
  page.drawText("BON POUR ACCORD", { x: margin + 12, y: y - 18, size: 10, font: helvBold, color: TERRE });
  page.drawText("Le client reconnaît avoir reçu ce devis avant l'exécution des travaux.", {
    x: margin + 12,
    y: y - 32,
    size: 8,
    font: helv,
    color: GRIS,
  });
  page.drawText("Mention manuscrite obligatoire : « Bon pour accord »", {
    x: margin + 12,
    y: y - 46,
    size: 8,
    font: helvItalic,
    color: GRIS,
  });
  page.drawText("Date :", { x: margin + 12, y: y - 68, size: 9, font: helv, color: BOIS });
  page.drawText("Signature du client :", { x: margin + 200, y: y - 68, size: 9, font: helv, color: BOIS });

  y -= 120;

  // ══════ MENTIONS LÉGALES FOOTER ══════
  const footerY = 60;
  page.drawLine({ start: { x: margin, y: footerY + 32 }, end: { x: width - margin, y: footerY + 32 }, thickness: 0.5, color: SABLE });
  const mentions = [
    `Devis ${input.numero} — établi le ${dateStr} — validité ${input.validiteJours} jours.`,
    `Prix fermes et non révisables pendant la durée de validité. TVA selon taux en vigueur.`,
    `En cas de retard de paiement : pénalités au taux légal majoré de 10 points + indemnité forfaitaire de 40 €.`,
    `Document généré par Bativio — Plateforme d'artisans certifiés en Rhône-Alpes — bativio.fr`,
  ];
  let mY = footerY + 22;
  for (const m of mentions) {
    page.drawText(m, { x: margin, y: mY, size: 7, font: helv, color: GRIS });
    mY -= 9;
  }

  return await pdfDoc.save();
}

function truncate(text: string, maxLen: number): string {
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  size: number,
  font: PDFFont,
  color: ReturnType<typeof rgb>,
): number {
  const words = text.split(/\s+/);
  let line = "";
  let y = startY;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);
    if (width > maxWidth && line) {
      page.drawText(line, { x, y, size, font, color });
      y -= size + 3;
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) {
    page.drawText(line, { x, y, size, font, color });
    y -= size + 3;
  }
  return y;
}
