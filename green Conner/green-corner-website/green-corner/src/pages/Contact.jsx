import { useState } from "react";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { businessInfo } from "../lib/demoData";
import { useLanguage } from "../lib/i18n/LanguageContext";

const emptyReservation = { name: "", phone: "", date: "", time: "", guests: 2, message: "" };
const emptyInquiry = { name: "", contact: "", message: "" };

function FormStatus({ status }) {
  if (!status) return null;
  return (
    <p className={`mt-3 text-sm ${status.ok ? "text-leaf-600" : "text-red-600"}`} role="status">
      {status.text}
    </p>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const [reservation, setReservation] = useState(emptyReservation);
  const [reservationStatus, setReservationStatus] = useState(null);
  const [submittingReservation, setSubmittingReservation] = useState(false);

  const [inquiry, setInquiry] = useState(emptyInquiry);
  const [inquiryStatus, setInquiryStatus] = useState(null);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const submitReservation = async (e) => {
    e.preventDefault();
    if (!reservation.name || !reservation.phone || !reservation.date || !reservation.time) {
      setReservationStatus({ ok: false, text: "Please fill in your name, phone, pickup date and pickup time." });
      return;
    }
    setSubmittingReservation(true);
    setReservationStatus(null);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("reservations").insert([
          {
            name: reservation.name,
            phone: reservation.phone,
            date: reservation.date,
            time: reservation.time,
            guests: Number(reservation.guests) || 1,
            message: reservation.message,
            status: "new"
          }
        ]);
        if (error) throw error;
      }
      setReservationStatus({ ok: true, text: "Order request received! We'll confirm by phone or WhatsApp before your pickup time." });
      setReservation(emptyReservation);
    } catch (err) {
      setReservationStatus({ ok: false, text: "Something went wrong. Please try WhatsApp or call us directly." });
    } finally {
      setSubmittingReservation(false);
    }
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.contact || !inquiry.message) {
      setInquiryStatus({ ok: false, text: "Please fill in all fields." });
      return;
    }
    setSubmittingInquiry(true);
    setInquiryStatus(null);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("inquiries").insert([
          { name: inquiry.name, contact: inquiry.contact, message: inquiry.message, status: "new" }
        ]);
        if (error) throw error;
      }
      setInquiryStatus({ ok: true, text: "Message sent! We'll get back to you soon." });
      setInquiry(emptyInquiry);
    } catch (err) {
      setInquiryStatus({ ok: false, text: "Something went wrong. Please try WhatsApp or call us directly." });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const waMessage = encodeURIComponent("Hi Green Corner! I'd like to place an order for pickup.");

  return (
    <>
      <SEO
        title="Contact & Order Ahead"
        description="Order ahead or send a message to The Green Corner in Nyamirambo, Kigali."
        path="/contact"
      />
      <PageHeader eyebrow={t("pages.contactEyebrow")} title={t("pages.contactTitle")} />

      <section className="container-narrow py-12 grid gap-10 lg:grid-cols-2">
        {/* Reservation */}
        <form onSubmit={submitReservation} className="card-surface p-6 sm:p-8 space-y-4" noValidate>
          <h2 className="font-display text-xl font-semibold">{t("contact.orderAheadHeading")}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-ink-700/70" htmlFor="r-name">{t("contact.name")}</label>
              <input
                id="r-name"
                required
                value={reservation.name}
                onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700/70" htmlFor="r-phone">{t("contact.phone")}</label>
              <input
                id="r-phone"
                required
                type="tel"
                value={reservation.phone}
                onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700/70" htmlFor="r-date">{t("contact.date")}</label>
              <input
                id="r-date"
                required
                type="date"
                value={reservation.date}
                onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700/70" htmlFor="r-time">{t("contact.time")}</label>
              <input
                id="r-time"
                required
                type="time"
                value={reservation.time}
                onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
              />
            </div>
            <div>
              <label className="text-sm text-ink-700/70" htmlFor="r-guests">{t("contact.people")}</label>
              <input
                id="r-guests"
                type="number"
                min={1}
                max={30}
                value={reservation.guests}
                onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-ink-700/70" htmlFor="r-message">{t("contact.orderDetails")}</label>
            <textarea
              id="r-message"
              rows={3}
              placeholder={t("contact.orderDetailsPlaceholder")}
              value={reservation.message}
              onChange={(e) => setReservation({ ...reservation, message: e.target.value })}
              className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
            />
          </div>

          <button type="submit" disabled={submittingReservation} className="btn-primary w-full disabled:opacity-60">
            {submittingReservation ? t("contact.sending") : t("contact.submitOrder")}
          </button>
          <FormStatus status={reservationStatus} />

          <div className="flex gap-3 pt-2">
            <a href={`https://wa.me/${businessInfo.whatsapp}?text=${waMessage}`} target="_blank" rel="noreferrer" className="btn-outline flex-1">
              {t("common.whatsapp")}
            </a>
            {!businessInfo.phone.startsWith("PLACEHOLDER") && (
              <a href={`tel:${businessInfo.phone.replace(/\s/g, "")}`} className="btn-outline flex-1">
                {t("common.call")}
              </a>
            )}
          </div>
        </form>

        {/* General inquiry */}
        <form onSubmit={submitInquiry} className="card-surface p-6 sm:p-8 space-y-4 h-fit" noValidate>
          <h2 className="font-display text-xl font-semibold">{t("contact.sendMessageHeading")}</h2>
          <div>
            <label className="text-sm text-ink-700/70" htmlFor="i-name">{t("contact.name")}</label>
            <input
              id="i-name"
              required
              value={inquiry.name}
              onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
              className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
            />
          </div>
          <div>
            <label className="text-sm text-ink-700/70" htmlFor="i-contact">Phone or Email</label>
            <input
              id="i-contact"
              required
              value={inquiry.contact}
              onChange={(e) => setInquiry({ ...inquiry, contact: e.target.value })}
              className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
            />
          </div>
          <div>
            <label className="text-sm text-ink-700/70" htmlFor="i-message">{t("contact.message")}</label>
            <textarea
              id="i-message"
              required
              rows={4}
              value={inquiry.message}
              onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
              className="mt-1 w-full rounded-lg bg-white border border-ink-900/15 px-3 py-2 text-sm outline-none focus:border-leaf-500"
            />
          </div>
          <button type="submit" disabled={submittingInquiry} className="btn-primary w-full disabled:opacity-60">
            {submittingInquiry ? t("contact.sending") : t("contact.submitMessage")}
          </button>
          <FormStatus status={inquiryStatus} />
        </form>
      </section>
    </>
  );
}
