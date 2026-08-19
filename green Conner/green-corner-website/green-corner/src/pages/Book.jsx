import { useState } from "react";
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

const emptyForm = () => ({
  name: "",
  phone: "",
  date: kigaliTodayISO(),
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

  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const hasWhatsApp = isConfirmedWhatsApp(b.whatsapp);
  const hasPhone = isConfirmedPhone(b.phone);
  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const composedMessage = buildBookingMessage({ ...form, language });
  const waHref = hasWhatsApp ? whatsappHref(b.whatsapp, composedMessage) : null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.date || !form.time) {
      setStatus({ ok: false, text: t("book.needDetails") });
      return;
    }
    const guests = Number(form.guests);
    if (!Number.isFinite(guests) || guests < 1 || guests > 30) {
      setStatus({ ok: false, text: t("book.needGuests") });
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
      setForm(emptyForm());
    } catch {
      setStatus({ ok: false, text: t("book.failed") });
    } finally {
      setSubmitting(false);
    }
  };

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

      <section className="container-narrow py-10 sm:py-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <form onSubmit={submit} className="card-surface p-5 sm:p-8 space-y-4" noValidate>
          <h2 className="font-display text-xl font-semibold">{t("book.formHeading")}</h2>
          <p className="text-sm text-mute">{t("book.requestNote")}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
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
            <div>
              <label className="text-sm text-mute" htmlFor="b-phone">{t("contact.phone")}</label>
              <input
                id="b-phone"
                required
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label className="text-sm text-mute" htmlFor="b-date">{t("book.date")}</label>
              <input
                id="b-date"
                required
                type="date"
                min={kigaliTodayISO()}
                value={form.date}
                onChange={(e) => set({ date: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label className="text-sm text-mute" htmlFor="b-time">{t("book.time")}</label>
              <input
                id="b-time"
                required
                type="time"
                value={form.time}
                onChange={(e) => set({ time: e.target.value })}
                className="field-input"
              />
            </div>
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
                    className={`chip ${on ? "border-ember-400 text-ember-400" : ""}`}
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

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
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
                  <li key={h.day} className="flex justify-between py-2 text-sm text-mute gap-3">
                    <span>{h.day}</span>
                    <span className="text-right">{h.open} – {h.close}</span>
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
