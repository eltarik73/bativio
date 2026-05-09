import { NextRequest, NextResponse } from "next/server";

// Cron du soir (19h Paris). Re-utilise la même logique que indexnow-daily
// via un fetch interne. Permet 2 pings/jour pour amplifier le signal Bing/Yandex.
// vercel.json : schedule "0 17 * * *" (= 19h Paris)
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bativio.fr";
  try {
    const res = await fetch(`${baseUrl}/api/cron/indexnow-daily`, {
      headers: secret ? { Authorization: `Bearer ${secret}` } : {},
    });
    const data = await res.json();
    return NextResponse.json({
      ok: res.ok,
      delegatedTo: "/api/cron/indexnow-daily",
      result: data,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e).slice(0, 200) }, { status: 500 });
  }
}
