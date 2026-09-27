// Cloudflare Worker: zajednički popis čitateljstva za rubriku "Kol'ko nas ima".
// Stanje se čuva u Workers KV-u (binding POPIS, ključ "popis") kao JSON { visits, emigration }.
// GET vraća trenutno stanje bez promjene; POST ga povećava (visits +1, emigration +3..5)
// i vraća novo stanje. Zadnji upis pobjeđuje — kod istodobnih posjeta poneki se može izgubiti,
// što je, gle čuda, u skladu s našom metodologijom.

const SEED = { visits: 7, emigration: 1258 };
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://govno.si",
  "Access-Control-Allow-Methods": "GET, POST",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

function json(data) {
  return new Response(JSON.stringify(data), { headers: CORS_HEADERS });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
    if (request.method !== "GET" && request.method !== "POST") {
      return new Response("popis se ne vodi na taj nacin", { status: 405, headers: CORS_HEADERS });
    }
    let popis = null;
    try {
      popis = JSON.parse(await env.POPIS.get("popis"));
    } catch (error) {
      popis = null;
    }
    if (!popis || typeof popis.visits !== "number" || typeof popis.emigration !== "number") {
      popis = { ...SEED };
    }
    if (request.method === "POST") {
      popis.visits += 1;
      popis.emigration += 3 + Math.floor(Math.random() * 3);
      await env.POPIS.put("popis", JSON.stringify(popis));
    }
    return json(popis);
  },
};
