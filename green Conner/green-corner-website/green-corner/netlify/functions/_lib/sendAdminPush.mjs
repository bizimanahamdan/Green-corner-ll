import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

function envOf(extra = {}) {
  return {
    supabaseUrl: extra.VITE_SUPABASE_URL || extra.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    serviceKey: extra.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    vapidPublic: extra.VITE_VAPID_PUBLIC_KEY || extra.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY,
    vapidPrivate: extra.VAPID_PRIVATE_KEY || process.env.VAPID_PRIVATE_KEY,
    vapidSubject: extra.VAPID_SUBJECT || process.env.VAPID_SUBJECT || "mailto:hello@the-green-corner.netlify.app",
    webhookSecret: extra.PUSH_WEBHOOK_SECRET || process.env.PUSH_WEBHOOK_SECRET
  };
}

function adminClient(env) {
  if (!env.supabaseUrl || !env.serviceKey) return null;
  return createClient(env.supabaseUrl, env.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function reservationCopy(row) {
  const when = [row.date, row.time].filter(Boolean).join(" at ");
  const qty = row.guests ? `${row.guests} item${row.guests === 1 ? "" : "s"}` : "new order";
  return {
    title: "New order request",
    body: `${row.name || "A customer"} · ${qty}${when ? ` · pickup ${when}` : ""}`,
    url: "/admin/reservations",
    tag: `reservation-${row.id}`
  };
}

function inquiryCopy(row) {
  return {
    title: "New customer message",
    body: `${row.name || "A customer"}: ${String(row.message || "").slice(0, 90)}`,
    url: "/admin/inquiries",
    tag: `inquiry-${row.id}`
  };
}

function bookingCopy(row) {
  const when = [row.date, row.time].filter(Boolean).join(" at ");
  const qty = row.guests ? `${row.guests} guest${row.guests === 1 ? "" : "s"}` : "table request";
  return {
    title: "New table request",
    body: `${row.name || "A customer"} · ${qty}${when ? ` · ${when}` : ""}`,
    url: "/admin/bookings",
    tag: `booking-${row.id}`
  };
}

async function sendToAll(env, payload, { onlyUserId } = {}) {
  const supabase = adminClient(env);
  if (!supabase) return { ok: false, error: "Server is missing SUPABASE_SERVICE_ROLE_KEY." };
  if (!env.vapidPublic || !env.vapidPrivate) {
    return { ok: false, error: "Server is missing VAPID keys." };
  }

  webpush.setVapidDetails(env.vapidSubject, env.vapidPublic, env.vapidPrivate);

  let query = supabase.from("push_subscriptions").select("id, endpoint, p256dh, auth, user_id");
  if (onlyUserId) query = query.eq("user_id", onlyUserId);
  const { data: subs, error } = await query;
  if (error) return { ok: false, error: error.message };
  if (!subs?.length) return { ok: true, sent: 0, reason: "no-subscribers" };

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      );
      sent += 1;
    } catch (err) {
      const code = err?.statusCode;
      if (code === 404 || code === 410) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }
  return { ok: true, sent };
}

async function loadFreshRow(supabase, table, body) {
  if (body.record?.id) {
    const { data } = await supabase.from(table).select("*").eq("id", body.record.id).maybeSingle();
    return data;
  }
  if (body.id) {
    const { data } = await supabase.from(table).select("*").eq("id", body.id).maybeSingle();
    return data;
  }

  let query = supabase.from(table).select("*").order("created_at", { ascending: false }).limit(1);
  if (body.name) query = query.eq("name", body.name);
  if (table === "reservations" || table === "table_bookings") {
    if (body.phone) query = query.eq("phone", body.phone);
    if (body.date) query = query.eq("date", body.date);
    if (body.time) query = query.eq("time", body.time);
  } else if (body.contact) {
    query = query.eq("contact", body.contact);
  }
  const { data } = await query.maybeSingle();
  return data;
}

function isRecent(row) {
  if (!row?.created_at) return true;
  const age = Date.now() - new Date(row.created_at).getTime();
  return age < 5 * 60 * 1000;
}

export async function handlePushNotify({ body, headers = {}, env: extraEnv = {}, userId = null }) {
  const env = envOf(extraEnv);
  const supabase = adminClient(env);
  const type = body?.type;
  const table = body?.table || body?.record?.table || (type === "inquiry" ? "inquiries" : type === "booking" ? "table_bookings" : type === "reservation" ? "reservations" : body?.table);

  if (type === "test") {
    if (!userId) return { status: 401, json: { ok: false, error: "Sign in to send a test push." } };
    const result = await sendToAll(
      env,
      {
        title: "Test alert",
        body: "Background push is working. You will get this even if the admin tab is closed.",
        url: "/admin/settings",
        tag: `test-${Date.now()}`
      },
      { onlyUserId: userId }
    );
    return { status: result.ok ? 200 : 500, json: result };
  }

  const webhookSecret = headers["x-webhook-secret"] || headers["X-Webhook-Secret"];
  if (env.webhookSecret && webhookSecret && webhookSecret !== env.webhookSecret) {
    return { status: 401, json: { ok: false, error: "Bad webhook secret." } };
  }

  const resolvedTable =
    table === "inquiries" || body?.table === "inquiries"
      ? "inquiries"
      : table === "table_bookings" || body?.table === "table_bookings"
        ? "table_bookings"
        : table === "reservations" || body?.table === "reservations"
          ? "reservations"
          : table;

  if (!supabase) {
    return { status: 500, json: { ok: false, error: "Server is missing Supabase service credentials." } };
  }

  if (resolvedTable !== "reservations" && resolvedTable !== "inquiries" && resolvedTable !== "table_bookings") {
    return { status: 400, json: { ok: false, error: "Unknown table." } };
  }

  const row = body?.record?.id && body?.record?.name ? body.record : await loadFreshRow(supabase, resolvedTable, body);
  if (!row) return { status: 404, json: { ok: false, error: "Request not found." } };
  if (!isRecent(row)) return { status: 200, json: { ok: true, skipped: "stale" } };
  if (row.notified_at) return { status: 200, json: { ok: true, skipped: "already-notified" } };

  const copy =
    resolvedTable === "inquiries"
      ? inquiryCopy(row)
      : resolvedTable === "table_bookings"
        ? bookingCopy(row)
        : reservationCopy(row);
  const result = await sendToAll(env, copy);
  if (!result.ok) return { status: 500, json: result };

  await supabase.from(resolvedTable).update({ notified_at: new Date().toISOString() }).eq("id", row.id);
  return { status: 200, json: result };
}

export async function userIdFromAuthHeader(authHeader, extraEnv = {}) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const env = envOf(extraEnv);
  const supabase = adminClient(env);
  if (!supabase) return null;
  const token = authHeader.slice(7);
  const { data } = await supabase.auth.getUser(token);
  return data?.user?.id || null;
}
