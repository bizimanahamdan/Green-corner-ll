import { handlePushNotify, userIdFromAuthHeader } from "./netlify/functions/_lib/sendAdminPush.mjs";

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Local stand-in for /.netlify/functions/push-notify so background
 * push can be tested with `npm run dev` when server secrets are set.
 */
export function pushDevPlugin(env) {
  return {
    name: "green-corner-push-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/.netlify/functions/push-notify")) return next();
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }
        try {
          const body = await readBody(req);
          const userId = await userIdFromAuthHeader(req.headers.authorization, env);
          const result = await handlePushNotify({ body, headers: req.headers, env, userId });
          res.statusCode = result.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.json));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: err.message || "Push failed" }));
        }
      });
    }
  };
}
