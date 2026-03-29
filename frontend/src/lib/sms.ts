import { prisma } from "@/lib/prisma";
import { getConfig } from "@/lib/config";
import { sendEmail } from "@/lib/email";

// ---------- Types ----------

interface SendSmsParams {
  to: string;
  content: string;
  artisanId: string;
  artisanPlan: string;
  artisanEmail?: string;
}

type SmsResult = "sent" | "email_fallback" | "blocked";

// ---------- Phone formatting ----------

function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "+33" + cleaned.slice(1);
  }
  return cleaned;
}

// ---------- Current month key ----------

function currentMois(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ---------- Send SMS via Brevo ----------

async function sendBrevoSms(to: string, content: string): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY not configured, cannot send SMS");
    return false;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: "Bativio",
        recipient: to,
        content,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Brevo SMS error:", res.status, body);
      return false;
    }
    return true;
  } catch (e) {
    console.error("Brevo SMS exception:", e);
    return false;
  }
}

// ---------- Public API ----------

/**
 * Envoie un SMS en verifiant le quota. Fallback email si configure.
 */
export async function sendSmsWithQuota(params: SendSmsParams): Promise<SmsResult> {
  const { to, content, artisanId, artisanPlan, artisanEmail } = params;

  // Verifier si SMS active globalement
  const smsEnabled = await getConfig("sms.enabled");
  if (!smsEnabled) {
    return handleFallback(artisanEmail, content);
  }

  // Verifier si le plan est autorise
  const plansAutorises: string[] = (await getConfig("sms.plans_autorises")) || [];
  if (!plansAutorises.includes(artisanPlan)) {
    return handleFallback(artisanEmail, content);
  }

  // Recuperer le quota pour ce plan
  const quotaKey = `sms.quota_${artisanPlan.toLowerCase()}`;
  const quotaMax: number = (await getConfig(quotaKey)) ?? 0;
  if (quotaMax <= 0) {
    return handleFallback(artisanEmail, content);
  }

  // Verifier / creer l'usage du mois
  const mois = currentMois();
  const usage = await prisma.smsUsage.upsert({
    where: { artisanId_mois: { artisanId, mois } },
    create: { artisanId, mois, count: 0, quota: quotaMax },
    update: {},
  });

  if (usage.count >= usage.quota) {
    return handleFallback(artisanEmail, content);
  }

  // Envoyer le SMS
  const formatted = formatPhone(to);
  const sent = await sendBrevoSms(formatted, content);

  if (!sent) {
    return handleFallback(artisanEmail, content);
  }

  // Incrementer le compteur
  await prisma.smsUsage.update({
    where: { artisanId_mois: { artisanId, mois } },
    data: { count: { increment: 1 } },
  });

  return "sent";
}

// ---------- Fallback ----------

async function handleFallback(
  email: string | undefined,
  content: string
): Promise<SmsResult> {
  const fallbackEnabled = await getConfig("sms.fallback_email");
  if (fallbackEnabled && email) {
    await sendEmail(
      email,
      "Notification Bativio (SMS indisponible)",
      `<div style="font-family:sans-serif;padding:20px;">
        <h2 style="color:#C4531A;">Notification Bativio</h2>
        <p>${content}</p>
        <hr/>
        <p style="font-size:12px;color:#888;">Ce message vous est envoy\u00e9 par email car le SMS n'a pas pu \u00eatre transmis.</p>
      </div>`
    );
    return "email_fallback";
  }
  return "blocked";
}

// ---------- Templates ----------

export const smsTemplates = {
  nouveauDevisUrgent(clientNom: string): string {
    return `Bativio: Nouvelle demande URGENTE de ${clientNom}. Connectez-vous pour repondre rapidement !`;
  },
  reponseDevisUrgent(artisanNom: string): string {
    return `Bativio: ${artisanNom} a repondu a votre demande urgente. Consultez la reponse sur Bativio.`;
  },
  rappelRdv(date: string, heure: string, nom: string): string {
    return `Bativio: Rappel - RDV le ${date} a ${heure} avec ${nom}. A demain !`;
  },
  rdvAnnule(nom: string): string {
    return `Bativio: Le RDV avec ${nom} a ete annule. Connectez-vous pour plus de details.`;
  },
};
