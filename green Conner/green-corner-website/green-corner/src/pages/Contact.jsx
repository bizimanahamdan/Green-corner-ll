import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo, useMenu } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useCart } from "../lib/CartContext";
import {
  buildOrderMessage,
  displayPrice,
  formatPrice,
  isConfirmedPhone,
  isConfirmedWhatsApp,
  telHref,
  whatsappHref
} from "../lib/business";
import { requestBackgroundPush } from "../lib/notifyAdmin";

const emptyInquiry = { name: "", contact: "", message: "" };

function FormStatus({ status }) {
  if (!status) return null;
  return (
    <p className={`mt-3 text-sm ${status.ok ? "text-leaf-400" : "text-red-600"}`} role="status">
      {status.text}
    </p>
  );
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Contact() {
  const { t, language } = useLanguage();
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: menu } = useMenu();
  const { items, count, total, addItem, setQty, clear } = useCart();

  const [details, setDetails] = useState({ name: "", phone: "", date: todayISO(), time: "", notes: "" });
  const [orderStatus, setOrderStatus] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const [inquiry, setInquiry] = useState(emptyInquiry);
  const [inquiryStatus, setInquiryStatus] = useState(null);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  const hasWhatsApp = isConfirmedWhatsApp(b.whatsapp);
  const hasPhone = isConfirmedPhone(b.phone);
  const flatMenu = useMemo(() => (menu || []).flatMap((c) => c.items.filter((i) => i.available !== false)), [menu]);

  const composedMessage = buildOrderMessage({
    name: details.name,
    phone: details.phone,
    date: details.date,
    time: details.time,
    items,
    notes: details.notes,
    language
  });

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!details.name || !details.phone || !details.date || !details.time) {
      setOrderStatus({ ok: false, text: t("contact.needDetails") });
      return;
    }
    if (items.length === 0 && !details.notes.trim()) {
      setOrderStatus({ ok: false, text: t("contact.emptyOrder") });
      return;
    }

    setSubmittingOrder(true);
    setOrderStatus(null);

    const payload = {
      name: details.name.trim().slice(0, 80),
      phone: details.phone.trim().slice(0, 40),
      date: details.date,
      time: details.time,
      guests: count || 1,
      message: composedMessage.slice(0, 2000),
      status: "new"
    };

    try {
      if (!isSupabaseConfigured) {
        setOrderStatus({
          ok: false,
          text: t("contact.noBackend")
        });
        return;
      }

      let { error } = await supabase.from("reservations").insert([{ ...payload, order_items: items }]);
      if (error && /order_items|schema cache|column/i.test(error.message || "")) {
        ({ error } = await supabase.from("reservations").insert([payload]));
      }
      if (error) throw error;

      requestBackgroundPush({
        table: "reservations",
        name: payload.name,
        phone: payload.phone,
        date: payload.date,
        time: payload.time
      });

      setOrderStatus({ ok: true, text: t("contact.orderSaved") });
      setDetails({ name: "", phone: "", date: todayISO(), time: "", notes: "" });
      clear();
    } catch {
      setOrderStatus({ ok: false, text: t("contact.failed") });
    } finally {
      setSubmittingOrder(false);
    }
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    if (!inquiry.name || !inquiry.contact || !inquiry.message) {
      setInquiryStatus({ ok: false, text: t("contact.needAll") });
      return;
    }
    setSubmittingInquiry(true);
    setInquiryStatus(null);
    try {
      if (!isSupabaseConfigured) {
        setInquiryStatus({ ok: false, text: t("contact.noBackend") });
        return;
      }
      const { error } = await supabase.from("inquiries").insert([
        {
          name: inquiry.name.trim().slice(0, 80),
          contact: inquiry.contact.trim().slice(0, 80),
          message: inquiry.message.trim().slice(0, 2000),
          status: "new"
        }
      ]);
      if (error) throw error;
      requestBackgroundPush({
        table: "inquiries",
        name: inquiry.name.trim(),
        contact: inquiry.contact.trim()
      });
      setInquiryStatus({ ok: true, text: t("contact.messageSaved") });
      setInquiry(emptyInquiry);
    } catch {
      setInquiryStatus({ ok: false, text: t("contact.failed") });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const waOrderHref = hasWhatsApp ? whatsappHref(b.whatsapp, composedMessage) : null;

  return (
    <>
      <SEO
        title="Contact & Order Ahead"
        description="Order ahead or send a message to The Green Corner in Nyamirambo, Kigali."
        path="/contact"
      />
      <PageHeader eyebrow={t("pages.contactEyebrow")} title={t("pages.contactTitle")} />

      <section className="container-narrow py-10 sm:py-12 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submitOrder} className="card-surface p-5 sm:p-8 space-y-4" noValidate>
          <h2 className="font-display text-xl font-semibold">{t("contact.orderAheadHeading")}</h2>

          <div>
            <p className="text-sm font-medium mb-2">{t("contact.yourOrder")}</p>
            {items.length === 0 ? (
              <p className="text-sm text-mute mb-3">{t("cart.empty")}</p>
            ) : (
              <ul className="space-y-2 mb-3">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate">{item.name}</span>
                    <span className="flex items-center gap-2 flex-shrink-0">
                      <button type="button" className="h-8 w-8 rounded-full border border-line/15" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease">−</button>
                      <span className="w-5 text-center">{item.qty}</span>
                      <button type="button" className="h-8 w-8 rounded-full border border-line/15" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase">+</button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {count > 0 && (
              <p className="text-sm font-semibold text-leaf-400 mb-3">{formatPrice(total)}</p>
            )}
            <details className="rounded-xl border border-line/10 p-3">
              <summary className="cursor-pointer text-sm font-medium">{t("contact.addFromMenu")}</summary>
              <ul className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                {flatMenu.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate">{item.name}</span>
                      <span className="text-mute">{displayPrice(item.price)}</span>
                    </span>
                    <button type="button" onClick={() => addItem(item, { reveal: false })} className="text-leaf-400 font-semibold flex-shrink-0">
                      + {t("common.addToOrder")}
                    </button>
                  </li>
                ))}
              </ul>
              <Link to="/menu" className="mt-3 inline-block text-sm text-leaf-400">{t("home.fullMenu")}</Link>
            </details>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-mute" htmlFor="r-name">{t("contact.name")}</label>
              <input id="r-name" required value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className="field-input" />
            </div>
            <div>
              <label className="text-sm text-mute" htmlFor="r-phone">{t("contact.phone")}</label>
              <input id="r-phone" required type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} className="field-input" />
            </div>
            <div>
              <label className="text-sm text-mute" htmlFor="r-date">{t("contact.date")}</label>
              <input id="r-date" required type="date" min={todayISO()} value={details.date} onChange={(e) => setDetails({ ...details, date: e.target.value })} className="field-input" />
            </div>
            <div>
              <label className="text-sm text-mute" htmlFor="r-time">{t("contact.time")}</label>
              <input id="r-time" required type="time" value={details.time} onChange={(e) => setDetails({ ...details, time: e.target.value })} className="field-input" />
            </div>
          </div>

          <div>
            <label className="text-sm text-mute" htmlFor="r-message">{t("contact.orderDetails")}</label>
            <textarea
              id="r-message"
              rows={3}
              placeholder={t("contact.orderDetailsPlaceholder")}
              value={details.notes}
              onChange={(e) => setDetails({ ...details, notes: e.target.value })}
              className="field-input min-h-[88px]"
            />
          </div>

          <button type="submit" disabled={submittingOrder} className="btn-primary w-full disabled:opacity-60">
            {submittingOrder ? t("contact.sending") : t("contact.submitOrder")}
          </button>
          <FormStatus status={orderStatus} />

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {waOrderHref && (
              <a href={waOrderHref} target="_blank" rel="noopener noreferrer" className="btn-outline flex-1">
                {t("contact.sendWhatsApp")}
              </a>
            )}
            {hasPhone && (
              <a href={telHref(b.phone)} className="btn-outline flex-1">
                {t("common.call")}
              </a>
            )}
          </div>
        </form>

        <form onSubmit={submitInquiry} className="card-surface p-5 sm:p-8 space-y-4 h-fit" noValidate>
          <h2 className="font-display text-xl font-semibold">{t("contact.sendMessageHeading")}</h2>
          <div>
            <label className="text-sm text-mute" htmlFor="i-name">{t("contact.name")}</label>
            <input id="i-name" required value={inquiry.name} onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="text-sm text-mute" htmlFor="i-contact">Phone or Email</label>
            <input id="i-contact" required value={inquiry.contact} onChange={(e) => setInquiry({ ...inquiry, contact: e.target.value })} className="field-input" />
          </div>
          <div>
            <label className="text-sm text-mute" htmlFor="i-message">{t("contact.message")}</label>
            <textarea id="i-message" required rows={4} value={inquiry.message} onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })} className="field-input min-h-[112px]" />
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
