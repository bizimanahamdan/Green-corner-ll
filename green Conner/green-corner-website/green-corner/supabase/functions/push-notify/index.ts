// Optional Supabase Edge Function — same contract as the Netlify function.
// Deploy only if you want Database Webhooks to call this URL instead of Netlify.
// Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, PUSH_WEBHOOK_SECRET (optional)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret"
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json(405, { ok: false, error: "Method not allowed" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY") || Deno.env.get("VITE_VAPID_PUBLIC_KEY") || "";
  const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY") || "";
  const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:hello@the-green-corner.netlify.app";
  const webhookSecret = Deno.env.get("PUSH_WEBHOOK_SECRET") || "";

  if (!supabaseUrl || !serviceKey) return json(500, { ok: false, error: "Missing Supabase secrets." });
  if (!vapidPublic || !vapidPrivate) return json(500, { ok: false, error: "Missing VAPID secrets." });

  const incomingSecret = req.headers.get("x-webhook-secret") || "";
  if (webhookSecret && incomingSecret && incomingSecret !== webhookSecret) {
    return json(401, { ok: false, error: "Bad webhook secret." });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const table =
    body.table === "inquiries" || (body.type === "INSERT" && body.table === "inquiries")
      ? "inquiries"
      : "reservations";

  const record = (body.record || {}) as Record<string, unknown>;
  let row = record.id ? record : null;
  if (!row) {
    const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
    row = data;
  }
  if (!row) return json(404, { ok: false, error: "Request not found." });
  if (row.notified_at) return json(200, { ok: true, skipped: "already-notified" });

  const payload =
    table === "inquiries"
      ? {
          title: "New customer message",
          body: `${row.name || "A customer"}: ${String(row.message || "").slice(0, 90)}`,
          url: "/admin/inquiries",
          tag: `inquiry-${row.id}`
        }
      : {
          title: "New order request",
          body: `${row.name || "A customer"} · pickup ${row.date || ""} ${row.time || ""}`.trim(),
          url: "/admin/reservations",
          tag: `reservation-${row.id}`
        };

  const { data: subs } = await supabase.from("push_subscriptions").select("id, endpoint, p256dh, auth");
  if (!subs?.length) {
    await supabase.from(table).update({ notified_at: new Date().toISOString() }).eq("id", row.id);
    return json(200, { ok: true, sent: 0 });
  }

  const webpush = await import("npm:web-push@3.6.7");
  webpush.setVapidDetails(vapidSubject, vapidPublic, vapidPrivate);

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      );
      sent += 1;
    } catch (err) {
      const code = (err as { statusCode?: number })?.statusCode;
      if (code === 404 || code === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  await supabase.from(table).update({ notified_at: new Date().toISOString() }).eq("id", row.id);
  return json(200, { ok: true, sent });
});
