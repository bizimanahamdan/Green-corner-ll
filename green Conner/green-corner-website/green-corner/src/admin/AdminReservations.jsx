import { useMemo, useState } from "react";
import { useAdminTable } from "./useAdminTable";
import { formatSlotLabel, kigaliTodayISO } from "../lib/bookingHours";
import { displayPrice, formatPrice, isConfirmedPhone, telHref, whatsappHref } from "../lib/business";

const statusClass = {
  new: "text-ember-400 border-ember-400/40 bg-ember-500/10",
  confirmed: "text-leaf-400 border-leaf-500/30 bg-leaf-500/10",
  cancelled: "text-cream/40 border-cream/15"
};

function normalizeTime(value) {
  if (!value) return "";
  const raw = String(value).trim();
  if (/^\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw.slice(0, 5);
  return raw;
}

function whenKey(row) {
  return `${row.date || ""}T${normalizeTime(row.time) || "99:99"}`;
}

function confirmText(row) {
  const time = normalizeTime(row.time);
  const when = [row.date, time ? formatSlotLabel(time) : row.time].filter(Boolean).join(" at ");
  const lines = [
    `Hello ${row.name || "there"}, your Green Corner order is confirmed${when ? ` for pickup ${when}` : ""}.`
  ];
  if (Array.isArray(row.order_items) && row.order_items.length) {
    lines.push("");
    row.order_items.forEach((item) => {
      lines.push(`- ${item.qty || 1}× ${item.name}${item.price ? ` · ${displayPrice(item.price)}` : ""}`);
    });
  }
  return lines.join("\n");
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold min-h-[36px] ${
        active ? "border-ember-400 text-ember-400 bg-ember-500/10" : "border-cream/15 text-cream/70"
      }`}
    >
      {children}
    </button>
  );
}

function itemTotal(items) {
  if (!Array.isArray(items) || !items.length) return null;
  const sum = items.reduce((acc, item) => {
    const n = Number(String(item.price || "").replace(/[^\d.]/g, ""));
    const qty = Number(item.qty) || 1;
    return acc + (Number.isFinite(n) ? n * qty : 0);
  }, 0);
  return sum ? formatPrice(sum) : null;
}

export default function AdminReservations() {
  const orders = useAdminTable("reservations", { orderBy: "created_at", ascending: false });
  const today = kigaliTodayISO();

  const [statusFilter, setStatusFilter] = useState("new");
  const [whenFilter, setWhenFilter] = useState("upcoming");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const counts = useMemo(() => ({
    new: orders.rows.filter((r) => r.status === "new").length,
    today: orders.rows.filter((r) => r.date === today && r.status !== "cancelled").length,
    upcoming: orders.rows.filter((r) => r.date >= today && r.status !== "cancelled").length
  }), [orders.rows, today]);

  const visible = useMemo(() => {
    return orders.rows
      .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
      .filter((r) => {
        if (whenFilter === "all") return true;
        if (whenFilter === "today") return r.date === today;
        if (whenFilter === "upcoming") return r.date >= today;
        return r.date < today;
      })
      .slice()
      .sort((a, b) => whenKey(a).localeCompare(whenKey(b)));
  }, [orders.rows, statusFilter, whenFilter, today]);

  const run = async (fn) => {
    setBusy(true);
    setErr("");
    try {
      await fn();
    } catch (ex) {
      setErr(ex.message || "Could not update that order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold mb-2">Orders</h1>
        <p className="text-sm text-cream/50">
          Confirm pickup by phone or WhatsApp before the guest comes through.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="admin-card p-4">
          <p className="font-display text-2xl text-ember-400">{counts.new}</p>
          <p className="text-xs text-cream/50 mt-1">New requests</p>
        </div>
        <div className="admin-card p-4">
          <p className="font-display text-2xl text-ember-400">{counts.today}</p>
          <p className="text-xs text-cream/50 mt-1">Pickup today</p>
        </div>
        <div className="admin-card p-4">
          <p className="font-display text-2xl text-ember-400">{counts.upcoming}</p>
          <p className="text-xs text-cream/50 mt-1">Upcoming (not cancelled)</p>
        </div>
      </div>

      {err && <p className="text-sm text-ember-400 mb-4">{err}</p>}
      {orders.error && <p className="text-sm text-ember-400 mb-4">{orders.error}</p>}

      <div className="flex flex-wrap gap-2 mb-3">
        {["new", "confirmed", "cancelled", "all"].map((key) => (
          <FilterChip key={key} active={statusFilter === key} onClick={() => setStatusFilter(key)}>
            {key === "all" ? "All statuses" : key}
            {key === "new" && counts.new ? ` · ${counts.new}` : ""}
          </FilterChip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["upcoming", "Upcoming"],
          ["today", "Today"],
          ["past", "Past"],
          ["all", "All dates"]
        ].map(([key, label]) => (
          <FilterChip key={key} active={whenFilter === key} onClick={() => setWhenFilter(key)}>
            {label}
          </FilterChip>
        ))}
      </div>

      {orders.loading && <p className="text-cream/50">Loading…</p>}
      {!orders.loading && visible.length === 0 && (
        <p className="text-cream/50">No orders in this view.</p>
      )}

      <div className="space-y-3">
        {visible.map((row) => {
          const time = normalizeTime(row.time);
          const call = telHref(row.phone);
          const wa = isConfirmedPhone(row.phone) ? whatsappHref(row.phone, confirmText(row)) : null;
          const total = itemTotal(row.order_items);

          return (
            <div key={row.id} className="admin-card p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium flex flex-wrap items-center gap-2">
                    <span>{row.name}</span>
                    <span className={`text-[11px] uppercase tracking-wide rounded-full border px-2 py-0.5 ${statusClass[row.status] || ""}`}>
                      {row.status}
                    </span>
                  </p>
                  <p className="text-sm text-cream/70 mt-1">
                    Pickup {row.date} · {time ? formatSlotLabel(time) : row.time}
                    {row.guests ? ` · ${row.guests} item${row.guests === 1 ? "" : "s"}` : ""}
                    {total ? ` · ${total}` : ""}
                  </p>
                  <p className="text-sm text-cream/60 mt-1">
                    {call ? <a href={call} className="hover:text-ember-400">{row.phone}</a> : row.phone}
                  </p>
                  {Array.isArray(row.order_items) && row.order_items.length > 0 && (
                    <ul className="mt-3 text-sm text-cream/70 space-y-0.5">
                      {row.order_items.map((item, index) => (
                        <li key={`${row.id}-${item.id || index}`}>
                          {item.qty || 1}× {item.name}
                          {item.price ? ` · ${displayPrice(item.price)}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                  {row.message && <p className="text-sm text-cream/50 mt-2 whitespace-pre-line">{row.message}</p>}
                </div>

                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  {row.status !== "confirmed" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => orders.update(row.id, { status: "confirmed" }))}
                      className="admin-btn-outline text-xs"
                    >
                      Confirm
                    </button>
                  )}
                  {row.status !== "cancelled" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => orders.update(row.id, { status: "cancelled" }))}
                      className="admin-btn-outline text-xs"
                    >
                      Cancel
                    </button>
                  )}
                  {row.status === "cancelled" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => orders.update(row.id, { status: "new" }))}
                      className="admin-btn-outline text-xs"
                    >
                      Reopen
                    </button>
                  )}
                  {call && (
                    <a href={call} className="admin-btn-outline text-xs">Call</a>
                  )}
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="admin-btn-outline text-xs">
                      WhatsApp
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Delete ${row.name}'s order?`)) run(() => orders.remove(row.id));
                    }}
                    className="text-xs text-ember-400 hover:underline px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
