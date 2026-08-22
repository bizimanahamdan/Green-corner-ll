import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo, useHours } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";
import {
  buildBookingInquiryMessage,
  buildBookingMessage,
  isConfirmedPhone,
  isConfirmedWhatsApp,
  kigaliTodayISO,
  telHref,
  whatsappHref
} from "../lib/business";
import {
  bookingSelectionError,
  chipDateParts,
  clampDateToTodayOrLater,
  dayWindow,
  formatSlotLabel,
  hoursArePosted,
  listBookableDates,
  timeSlotsForDate
} from "../lib/bookingHours";
import { requestBackgroundPush } from "../lib/notifyAdmin";

const OCCASIONS = [
  { id: "friends", en: "Friends", rw: "Inshuti" },
  { id: "afterWork", en: "After work", rw: "Nyuma y'akazi" },
  { id: "birthday", en: "Birthday", rw: "Isabukuru" },
  { id: "other", en: "Other", rw: "Ikindi" }
];

function FormStatus({ status }) {
  if (!status) return null;
  return (
    <p className={`mt-3 text-sm ${status.ok ? "text-leaf-400" : "text-red-500"}`} role="status">
      {status.text}
    </p>
  );
}

const emptyForm = (date = "") => ({
  name: "",
  phone: "",
  date,
  time: "",
  guests: 2,
  occasion: "",
  notes: ""
});

export default function Book() {
  const { t, language } = useLanguage();
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: hours } = useHours();
  const liveHours = hours || [];
  const posted = hoursArePosted(liveHours);
  const today = kigaliTodayISO();

  const bookableDates = useMemo(() => listBookableDates(liveHours), [liveHours]);
  const firstOpen = bookableDates[0]?.iso || "";

  const [form, setForm] = useState(() => emptyForm(today));
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const hasWhatsApp = isConfirmedWhatsApp(b.whatsapp);
  const hasPhone = isConfirmedPhone(b.phone);
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!posted) return;
    setForm((prev) => {
      const nextDate = bookableDates.some((d) => d.iso === prev.date) ? prev.date : firstOpen;
      if (!nextDate) return prev.date === "" ? prev : { ...prev, date: "", time: "" };
      const slots = timeSlotsForDate(liveHours, nextDate);
      const nextTime = slots.includes(prev.time) ? prev.time : "";
      if (nextDate === prev.date && nextTime === prev.time) return prev;
      return { ...prev, date: nextDate, time: nextTime };
    });
  }, [posted, firstOpen, liveHours, bookableDates]);

  const slots = useMemo(
    () => (form.date ? timeSlotsForDate(liveHours, form.date) : []),
    [liveHours, form.date]
  );
  const window = form.date ? dayWindow(liveHours, form.date) : { status: "none" };
  const lastDate = bookableDates[bookableDates.length - 1]?.iso || today;
  const selectionError = bookingSelectionError(liveHours, form.date, form.time);

  const composedMessage = buildBookingMessage({ ...form, language });
  const waHref = hasWhatsApp ? whatsappHref(b.whatsapp, composedMessage) : null;

  const pickDate = (iso) => {
    const next = clampDateToTodayOrLater(iso);
    const nextSlots = timeSlotsForDate(liveHours, next);
    set({ date: next, time: nextSlots.includes(form.time) ? form.time : "" });
    setStatus(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus({ ok: false, text: t("book.needDetails") });
      return;
    }
    const guests = Number(form.guests);
    if (!Number.isFinite(guests) || guests < 1 || guests > 30) {
      setStatus({ ok: false, text: t("book.needGuests") });
      return;
    }
    const whenError = bookingSelectionError(liveHours, form.date, form.time);
    if (whenError) {
      setStatus({ ok: false, text: t(`book.${whenError}`) });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    const payload = {
      name: form.name.trim().slice(0, 80),
      phone: form.phone.trim().slice(0, 40),
      date: form.date,
      time: form.time,
      guests,
      occasion: form.occasion.trim().slice(0, 80) || null,
      message: form.notes.trim().slice(0, 2000) || null,
      status: "new"
    };

    try {
      if (!isSupabaseConfigured) {
        setStatus({ ok: false, text: t("book.noBackend") });
        return;
      }

      let usedTable = "table_bookings";
      let { error } = await supabase.from("table_bookings").insert([payload]);

      if (error && /schema cache|does not exist|relation|table_bookings/i.test(error.message || "")) {
        usedTable = "inquiries";
        ({ error } = await supabase.from("inquiries").insert([
          {
            name: payload.name,
            contact: payload.phone,
            message: buildBookingInquiryMessage(payload, language),
            status: "new"
          }
        ]));
      }
      if (error) throw error;

      requestBackgroundPush({
        table: usedTable,
        name: payload.name,
        phone: payload.phone,
        contact: payload.phone,
        date: payload.date,
        time: payload.time,
        guests: payload.guests
      });

      setStatus({ ok: true, text: t("book.saved") });
      setForm(emptyForm(firstOpen || today));
    } catch {
      setStatus({ ok: false, text: t("book.failed") });
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = posted && !selectionError && !submitting;

  return (
    <>
      <SEO
        title="Book a Table"
        description="Request a table at The Green Corner grill pub in Nyamirambo, Kigali. We'll confirm by phone or WhatsApp."
        path="/book"
      />
      <PageHeader
        eyebrow={t("pages.bookEyebrow")}
        title={t("pages.bookTitle")}
        description={t("book.intro")}
      />

      <section className="container-narrow py-8 sm:py-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start min-w-0">
        <form onSubmit={submit} className="card-surface p-4 sm:p-8 space-y-5 overflow-hidden min-w-0" noValidate>
          <div>
            <h2 className="font-display text-xl font-semibold">{t("book.formHeading")}</h2>
            <p className="text-sm text-mute mt-1 leading-relaxed">{t("book.requestNote")}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className="text-sm text-mute" htmlFor="b-name">{t("contact.name")}</label>
              <input
                id="b-name"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="min-w-0">
              <label className="text-sm text-mute" htmlFor="b-phone">{t("contact.phone")}</label>
              <input
                id="b-phone"
                required
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                className="field-input"
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-mute" id="b-date-label">{t("book.date")}</p>
            <p className="text-xs text-mute mt-1 mb-3">{t("book.dateHint")}</p>
            {posted && bookableDates.length > 0 && (
              <div className="-mx-4 sm:-mx-8 mb-3">
                <div className="date-scroller px-4 sm:px-8" role="listbox" aria-labelledby="b-date-label">
                  {bookableDates.map((day) => {
                    const on = form.date === day.iso;
                    const parts = chipDateParts(day.iso);
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        role="option"
                        aria-selected={on}
                        onClick={() => pickDate(day.iso)}
                        className={`date-chip border ${
                          on ? "border-ember-400 text-ember-400 bg-ember-500/10" : "border-line/15 text-paper"
                        }`}
                      >
                        <span className="block text-[11px] uppercase tracking-wide text-mute">
                          {day.isToday ? t("book.today") : parts.weekday}
                        </span>
                        <span className="block font-display text-lg leading-none mt-1">{parts.day}</span>
                        <span className="block text-[11px] text-mute mt-1">{parts.month}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <label className="sr-only" htmlFor="b-date">{t("book.date")}</label>
            <input
              id="b-date"
              required
              type="date"
              min={today}
              max={lastDate}
              value={form.date}
              disabled={!posted}
              onChange={(e) => pickDate(e.target.value)}
              className="field-input hidden sm:block"
            />
            {posted && window.status === "closed" && (
              <p className="text-sm text-ember-400 mt-2">{t("book.closedDay")}</p>
            )}
            {posted && window.status === "open" && (
              <p className="text-sm text-mute mt-2 leading-relaxed">
                {t("book.hoursThisDay")} {window.open} – {window.close}
              </p>
            )}
            {!posted && <p className="text-sm text-ember-400 mt-2">{t("book.noHours")}</p>}
          </div>

          <div>
            <p className="text-sm text-mute mb-2">{t("book.time")}</p>
            {!posted ? (
              <p className="text-sm text-mute">{t("book.hoursOnly")}</p>
            ) : slots.length === 0 ? (
              <p className="text-sm text-ember-400">{t("book.noSlots")}</p>
            ) : (
              <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const on = form.time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        set({ time: slot });
                        setStatus(null);
                      }}
                      className={`rounded-full border px-2 py-2 text-xs sm:text-sm min-h-[44px] ${
                        on ? "border-ember-400 text-ember-400 bg-ember-500/10" : "border-line/15"
                      }`}
                    >
                      {formatSlotLabel(slot)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-mute mb-2" id="b-guests-label">{t("book.guests")}</p>
            <div className="flex items-center gap-3" role="group" aria-labelledby="b-guests-label">
              <button
                type="button"
                className="h-11 w-11 rounded-full border border-line/15 text-lg"
                onClick={() => set({ guests: Math.max(1, Number(form.guests) - 1) })}
                aria-label={t("book.fewer")}
              >
                −
              </button>
              <span className="min-w-[3.5rem] text-center font-display text-2xl">{form.guests}</span>
              <button
                type="button"
                className="h-11 w-11 rounded-full border border-line/15 text-lg"
                onClick={() => set({ guests: Math.min(30, Number(form.guests) + 1) })}
                aria-label={t("book.more")}
              >
                +
              </button>
            </div>
            {Number(form.guests) >= 8 && (
              <p className="text-sm text-mute mt-2">{t("book.largeGroup")}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-mute mb-2">{t("book.occasion")}</p>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((opt) => {
                const label = language === "rw" ? opt.rw : opt.en;
                const on = form.occasion === label;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => set({ occasion: on ? "" : label })}
                    className={`chip ${on ? "border-ember-400 text-ember-400 hover:border-ember-400 hover:bg-ember-500/10" : ""}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-sm text-mute" htmlFor="b-notes">{t("book.notes")}</label>
            <textarea
              id="b-notes"
              rows={3}
              placeholder={t("book.notesPlaceholder")}
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              className="field-input min-h-[88px]"
            />
          </div>

          <button type="submit" disabled={!canSubmit} className="btn-primary w-full disabled:opacity-60">
            {submitting ? t("contact.sending") : t("book.submit")}
          </button>
          <FormStatus status={status} />

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1">
                {t("book.sendWhatsApp")}
              </a>
            )}
            {hasPhone && (
              <a href={telHref(b.phone)} className="btn-outline flex-1">
                {t("common.call")}
              </a>
            )}
          </div>
        </form>

        <aside className="space-y-5">
          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold">{t("book.whatNext")}</h2>
            <ol className="mt-4 space-y-3 text-sm text-mute">
              <li>1. {t("book.step1")}</li>
              <li>2. {t("book.step2")}</li>
              <li>3. {t("book.step3")}</li>
            </ol>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold mb-3">{t("book.hoursHeading")}</h2>
            {liveHours.length === 0 ? (
              <p className="text-sm text-mute">{t("empty.hours")}</p>
            ) : (
              <ul className="divide-y divide-line/10">
                {liveHours.map((h) => (
                  <li key={h.day} className="flex justify-between py-2 text-sm text-mute gap-3 min-w-0">
                    <span className="shrink-0">{h.day}</span>
                    <span className="text-right break-words">
                      {h.open && h.close ? `${h.open} – ${h.close}` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card-surface p-6">
            <p className="text-sm text-mute">{t("book.pickupInstead")}</p>
            <Link to="/contact" className="btn-outline mt-4 w-full">
              {t("common.orderAhead")}
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
