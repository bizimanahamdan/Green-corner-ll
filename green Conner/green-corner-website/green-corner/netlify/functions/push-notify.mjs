import { handlePushNotify, userIdFromAuthHeader } from "./_lib/sendAdminPush.mjs";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: "Method not allowed" };
  }

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ ok: false, error: "Invalid JSON" }) };
  }

  const headers = event.headers || {};
  const userId = await userIdFromAuthHeader(headers.authorization || headers.Authorization);
  const result = await handlePushNotify({ body, headers, userId });

  return {
    statusCode: result.status,
    headers: { ...cors, "Content-Type": "application/json" },
    body: JSON.stringify(result.json)
  };
}
