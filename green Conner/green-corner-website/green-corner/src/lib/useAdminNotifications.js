import { useEffect, useRef } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { notifyAdminEvent } from "./notifications";
import { isBackgroundPushEnabled } from "./push";

function reservationBody(row) {
  const when = [row.date, row.time].filter(Boolean).join(" at ");
  const qty = row.guests ? `${row.guests} item${row.guests === 1 ? "" : "s"}` : "new order";
  return `${row.name || "A customer"} · ${qty}${when ? ` · pickup ${when}` : ""}`;
}

function bookingBody(row) {
  const when = [row.date, row.time].filter(Boolean).join(" at ");
  const qty = row.guests ? `${row.guests} guest${row.guests === 1 ? "" : "s"}` : "table request";
  return `${row.name || "A customer"} · ${qty}${when ? ` · ${when}` : ""}`;
}

export function useAdminNotifications() {
  const ready = useRef(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    const channel = supabase
      .channel("admin-live-inbox")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reservations" },
        (payload) => {
          if (!ready.current) return;
          const row = payload.new || {};
          const pageOpen = typeof document !== "undefined" && document.visibilityState === "visible";
          if (pageOpen || !isBackgroundPushEnabled()) {
            notifyAdminEvent({
              id: `reservation-${row.id}`,
              title: "New order request",
              body: reservationBody(row),
              url: "/admin/reservations",
              tag: `reservation-${row.id}`
            });
          }
          window.dispatchEvent(new CustomEvent("green-corner:inbox", { detail: { table: "reservations", row } }));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "table_bookings" },
        (payload) => {
          if (!ready.current) return;
          const row = payload.new || {};
          const pageOpen = typeof document !== "undefined" && document.visibilityState === "visible";
          if (pageOpen || !isBackgroundPushEnabled()) {
            notifyAdminEvent({
              id: `booking-${row.id}`,
              title: "New table request",
              body: bookingBody(row),
              url: "/admin/bookings",
              tag: `booking-${row.id}`
            });
          }
          window.dispatchEvent(new CustomEvent("green-corner:inbox", { detail: { table: "table_bookings", row } }));
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inquiries" },
        (payload) => {
          if (!ready.current) return;
          const row = payload.new || {};
          const pageOpen = typeof document !== "undefined" && document.visibilityState === "visible";
          if (pageOpen || !isBackgroundPushEnabled()) {
            notifyAdminEvent({
              id: `inquiry-${row.id}`,
              title: "New customer message",
              body: `${row.name || "A customer"}: ${(row.message || "").slice(0, 90)}`,
              url: "/admin/inquiries",
              tag: `inquiry-${row.id}`
            });
          }
          window.dispatchEvent(new CustomEvent("green-corner:inbox", { detail: { table: "inquiries", row } }));
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          // Ignore the backlog that can arrive as the socket connects.
          window.setTimeout(() => {
            ready.current = true;
          }, 400);
        }
      });

    return () => {
      ready.current = false;
      supabase.removeChannel(channel);
    };
  }, []);
}
