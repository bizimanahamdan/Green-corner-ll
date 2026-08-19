import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminTable } from "./useAdminTable";
import { useHours } from "../lib/useContent";
import {
  clampDateToTodayOrLater,
  dayWindow,
  formatSlotLabel,
  hoursArePosted,
  hoursSlotsForDate,
  kigaliTodayISO,
  listBookableDates,
  timeSlotsForDate
} from "../lib/bookingHours";
import { isConfirmedPhone, telHref, whatsappHref } from "../lib/business";

const STATUS = ["new", "confirmed", "cancelled"];

const statusClass = {
  new: "text-ember-400 border-ember-400/40 bg-ember-500/10",
  confirmed: "text-leaf-400 border-leaf-500/30 bg-leaf-500/10",
  cancelled: "text-cream/40 border-cream/15"
};

const emptyDraft = () => ({
  name: "",
  phone: "",
  date: kigaliTodayISO(),
  time: "",
  guests: 2,
  occasion: "",
  message: "",
  status: "confirmed"
});

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
  const when = [row.date, row.time ? formatSlotLabel(normalizeTime(row.time)) : ""]
    .filter(Boolean)
    .join(" at ");
  return `Hello ${row.name}, your table at Green Corner is confirmed${when ? ` for ${when}` : ""}${row.guests ? ` · ${row.guests} guest${row.guests === 1 ? "" : "s"}` : ""}.`;
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

function BookingForm({ draft, setDraft, hours, onSubmit, onCancel, busy, submitLabel }) {
  const posted = hoursArePosted(hours);
  const today = kigaliTodayISO();
  const dates = posted ? listBookableDates(hours) : [];
  const rawSlots = posted
    ? (draft.date === today ? timeSlotsForDate(hours, draft.date) : hoursSlotsForDate(hours, draft.date))
    : [];
  const slots = draft.time && !rawSlots.includes(draft.time) ? [draft.time, ...rawSlots] : rawSlots;
  const window = draft.date ? dayWindow(hours, draft.date) : { status: "none" };
  const lastDate = dates[dates.length - 1]?.iso || today;

  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  return (
    <form
      onSubmit={onSubmit}
      className="admin-card p-5 space-y-3 border-ember-400/30"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="admin-label" htmlFor="bk-name">Name</label>
          <input id="bk-name" required value={draft.name} onChange={(e) => set({ name: e.target.value })} className="admin-input" />
        </div>
        <div>
          <label className="admin-label" htmlFor="bk-phone">Phone</label>
          <input id="bk-phone" required type="tel" value={draft.phone} onChange={(e) => set({ phone: e.target.value })} className="admin-input" />
        </div>
        <div>
          <label className="admin-label" htmlFor="bk-date">Date</label>
          <input
            id="bk-date"
            required
            type="date"
            min={today}
            max={lastDate}
            value={draft.date}
            onChange={(e) => set({ date: clampDateToTodayOrLater(e.target.value), time: "" })}
            className="admin-input"
          />
          {posted && window.status === "closed" && (
            <p className="text-xs text-ember-400 mt-1">Closed that day.</p>
          )}
          {posted && window.status === "open" && (
            <p className="text-xs text-cream/50 mt-1">{window.open} – {window.close}</p>
          )}
        </div>
        <div>
          <label className="admin-label" htmlFor="bk-time">Time</label>
          {posted && slots.length > 0 ? (
            <select
              id="bk-time"
              required
              value={draft.time}
              onChange={(e) => set({ time: e.target.value })}
              className="admin-input"
            >
              <option value="">Pick a slot…</option>
              {slots.map((slot) => (
                <option key={slot} value={slot}>{formatSlotLabel(slot)}</option>
              ))}
            </select>
          ) : (
            <input
              id="bk-time"
              required
              type="time"
              value={draft.time}
              onChange={(e) => set({ time: e.target.value })}
              className="admin-input"
              disabled={posted && slots.length === 0}
            />
          )}
        </div>
        <div>
          <label className="admin-label" htmlFor="bk-guests">Guests</label>
          <input
            id="bk-guests"
            required
            type="number"
            min="1"
            max="30"
            value={draft.guests}
            onChange={(e) => set({ guests: Number(e.target.value) })}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="bk-status">Status</label>
          <select id="bk-status" value={draft.status} onChange={(e) => set({ status: e.target.value })} className="admin-input">
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="admin-label" htmlFor="bk-occasion">Occasion</label>
        <input id="bk-occasion" value={draft.occasion} onChange={(e) => set({ occasion: e.target.value })} className="admin-input" />
      </div>
      <div>
        <label className="admin-label" htmlFor="bk-note">Notes</label>
        <textarea id="bk-note" rows={2} value={draft.message} onChange={(e) => set({ message: e.target.value })} className="admin-input" />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={busy} className="btn-primary">{busy ? "Saving…" : submitLabel}</button>
        <button type="button" onClick={onCancel} className="admin-btn-outline">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminBookings() {
  const bookings = useAdminTable("table_bookings", { orderBy: "created_at", ascending: false });
  const { data: hours } = useHours();
  const liveHours = hours || [];
  const today = kigaliTodayISO();

  const [statusFilter, setStatusFilter] = useState("new");
  const [whenFilter, setWhenFilter] = useState("upcoming");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const counts = useMemo(() => ({
    new: bookings.rows.filter((r) => r.status === "new").length,
    today: bookings.rows.filter((r) => r.date === today && r.status !== "cancelled").length,
    upcoming: bookings.rows.filter((r) => r.date >= today && r.status !== "cancelled").length
  }), [bookings.rows, today]);

  const visible = useMemo(() => {
    return bookings.rows
      .filter((r) => (statusFilter === "all" ? true : r.status === statusFilter))
      .filter((r) => {
        if (whenFilter === "all") return true;
        if (whenFilter === "today") return r.date === today;
        if (whenFilter === "upcoming") return r.date >= today;
        return r.date < today;
      })
      .slice()
      .sort((a, b) => whenKey(a).localeCompare(whenKey(b)));
  }, [bookings.rows, statusFilter, whenFilter, today]);

  const run = async (fn) => {
    setBusy(true);
    setErr("");
    try {
      await fn();
    } catch (ex) {
      setErr(ex.message || "Could not save that booking.");
    } finally {
      setBusy(false);
    }
  };

  const addBooking = (e) => {
    e.preventDefault();
    const guests = Number(draft.guests);
    if (!draft.name.trim() || !draft.phone.trim() || !draft.date || !draft.time) {
      setErr("Name, phone, date and time are required.");
      return;
    }
    if (!Number.isFinite(guests) || guests < 1 || guests > 30) {
      setErr("Guests must be between 1 and 30.");
      return;
    }
    run(async () => {
      await bookings.insert({
        name: draft.name.trim().slice(0, 80),
        phone: draft.phone.trim().slice(0, 40),
        date: draft.date,
        time: draft.time,
        guests,
        occasion: draft.occasion.trim().slice(0, 80) || null,
        message: draft.message.trim().slice(0, 2000) || null,
        status: draft.status || "confirmed"
      });
      setDraft(emptyDraft());
      setAdding(false);
    });
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editingId) return;
    const guests = Number(editDraft.guests);
    run(async () => {
      await bookings.update(editingId, {
        name: editDraft.name.trim().slice(0, 80),
        phone: editDraft.phone.trim().slice(0, 40),
        date: editDraft.date,
        time: editDraft.time,
        guests,
        occasion: editDraft.occasion.trim().slice(0, 80) || null,
        message: editDraft.message.trim().slice(0, 2000) || null,
        status: editDraft.status
      });
      setEditingId(null);
    });
  };

  const startEdit = (row) => {
    setAdding(false);
    setEditingId(row.id);
    setEditDraft({
      name: row.name || "",
      phone: row.phone || "",
      date: row.date || today,
      time: normalizeTime(row.time),
      guests: row.guests || 2,
      occasion: row.occasion || "",
      message: row.message || "",
      status: row.status || "new"
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold mb-2">Table bookings</h1>
          <p className="text-sm text-cream/50">
            Confirm by phone or WhatsApp. These are requests, not a seating chart.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setAdding((v) => !v);
            setDraft(emptyDraft());
          }}
          className="btn-primary"
        >
          {adding ? "Close" : "Add booking"}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="admin-card p-4">
          <p className="font-display text-2xl text-ember-400">{counts.new}</p>
          <p className="text-xs text-cream/50 mt-1">New requests</p>
        </div>
        <div className="admin-card p-4">
          <p className="font-display text-2xl text-ember-400">{counts.today}</p>
          <p className="text-xs text-cream/50 mt-1">On the book today</p>
        </div>
        <div className="admin-card p-4">
          <p className="font-display text-2xl text-ember-400">{counts.upcoming}</p>
          <p className="text-xs text-cream/50 mt-1">Upcoming (not cancelled)</p>
        </div>
      </div>

      {bookings.missing && (
        <div className="admin-card p-5 mb-6 border-ember-400/30">
          <p className="font-medium mb-2">The bookings table is not in the database yet.</p>
          <p className="text-sm text-cream/60">
            In the Supabase SQL editor, run{" "}
            <code className="text-ember-400">supabase/009_table_bookings.sql</code>
            . Until then, guest requests may appear under{" "}
            <Link to="/admin/inquiries" className="text-ember-400 underline underline-offset-2">Inquiries</Link>.
          </p>
        </div>
      )}

      {err && <p className="text-sm text-ember-400 mb-4">{err}</p>}
      {bookings.error && <p className="text-sm text-ember-400 mb-4">{bookings.error}</p>}

      {adding && (
        <div className="mb-6">
          <h2 className="font-semibold mb-3">New booking</h2>
          <BookingForm
            draft={draft}
            setDraft={setDraft}
            hours={liveHours}
            onSubmit={addBooking}
            onCancel={() => setAdding(false)}
            busy={busy}
            submitLabel="Save booking"
          />
        </div>
      )}

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

      {bookings.loading && <p className="text-cream/50">Loading…</p>}
      {!bookings.loading && !bookings.missing && visible.length === 0 && (
        <p className="text-cream/50">No bookings in this view.</p>
      )}

      <div className="space-y-3">
        {visible.map((row) => {
          const time = normalizeTime(row.time);
          const call = telHref(row.phone);
          const wa = isConfirmedPhone(row.phone) ? whatsappHref(row.phone, confirmText(row)) : null;

          if (editingId === row.id) {
            return (
              <BookingForm
                key={row.id}
                draft={editDraft}
                setDraft={setEditDraft}
                hours={liveHours}
                onSubmit={saveEdit}
                onCancel={() => setEditingId(null)}
                busy={busy}
                submitLabel="Save changes"
              />
            );
          }

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
                    {row.date} · {time ? formatSlotLabel(time) : row.time}
                    {row.guests ? ` · ${row.guests} guest${row.guests === 1 ? "" : "s"}` : ""}
                    {row.occasion ? ` · ${row.occasion}` : ""}
                  </p>
                  <p className="text-sm text-cream/60 mt-1">
                    {call ? <a href={call} className="hover:text-ember-400">{row.phone}</a> : row.phone}
                  </p>
                  {row.message && <p className="text-sm text-cream/50 mt-2 whitespace-pre-line">{row.message}</p>}
                </div>

                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  {row.status !== "confirmed" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => bookings.update(row.id, { status: "confirmed" }))}
                      className="admin-btn-outline text-xs"
                    >
                      Confirm
                    </button>
                  )}
                  {row.status !== "cancelled" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => bookings.update(row.id, { status: "cancelled" }))}
                      className="admin-btn-outline text-xs"
                    >
                      Cancel
                    </button>
                  )}
                  {row.status === "cancelled" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => bookings.update(row.id, { status: "new" }))}
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
                  <button type="button" onClick={() => startEdit(row)} className="admin-btn-outline text-xs">
                    Edit
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (window.confirm(`Delete ${row.name}'s booking?`)) run(() => bookings.remove(row.id));
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
