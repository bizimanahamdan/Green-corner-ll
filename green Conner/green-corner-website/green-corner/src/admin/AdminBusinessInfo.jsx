import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminBusinessInfo() {
  const [form, setForm] = useState(null);
  const [serviceText, setServiceText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase
      .from("business_info")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        setForm(data);
        const opts = data?.service_options;
        setServiceText(Array.isArray(opts) ? opts.join(", ") : "");
        setLoading(false);
      });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErr("");
    const { id, ...values } = form;
    const service_options = serviceText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      ...values,
      phone: values.phone || "",
      whatsapp: (values.whatsapp || "").replace(/\D/g, ""),
      instagram: values.instagram || "",
      facebook_url: values.facebook_url || "",
      tiktok_url: values.tiktok_url || "",
      price_range: values.price_range || "",
      google_rating: values.google_rating || null,
      google_review_count: values.google_review_count || null
    };
    let { error } = await supabase.from("business_info").update({ ...payload, service_options }).eq("id", id);
    if (error && /service_options/i.test(error.message || "")) {
      ({ error } = await supabase.from("business_info").update(payload).eq("id", id));
    }
    setSaving(false);
    if (error) setErr(error.message);
    else setSaved(true);
  };

  if (loading) return <p className="text-cream/50">Loading…</p>;
  if (!form) return <p className="text-ember-400 text-sm">{err || "No business info row found."}</p>;

  const field = (key, label, type = "text", hint) => (
    <div>
      <label className="text-sm text-cream/70" htmlFor={key}>{label}</label>
      <input
        id={key}
        type={type}
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
      />
      {hint && <p className="text-xs text-cream/40 mt-1">{hint}</p>}
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Business Info</h1>
      <p className="text-sm text-cream/50 mb-6">
        Leave phone, WhatsApp and social links empty until they are real. Empty fields stay hidden on the public site.
      </p>
      <form onSubmit={save} className="admin-card p-6 max-w-xl space-y-4">
        {field("name", "Business name")}
        {field("tagline", "Tagline")}
        <div>
          <label className="text-sm text-cream/70" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("phone", "Phone", "tel", "Shown only when this looks like a real number.")}
          {field("whatsapp", "WhatsApp (digits only, with country code)", "text", "Example: 2507XXXXXXX. The WhatsApp button stays hidden until this is set.")}
          {field("instagram", "Instagram handle")}
          {field("facebook_url", "Facebook page URL")}
          {field("tiktok_url", "TikTok profile URL")}
          {field("neighborhood", "Neighborhood")}
          {field("city", "City")}
          {field("maps_query", "Google Maps search query", "text", "Used for the map embed and directions link.")}
          {field("price_range", "Price range")}
          {field("google_rating", "Google rating")}
          {field("google_review_count", "Google review count")}
        </div>
        <div>
          <label className="text-sm text-cream/70" htmlFor="service_options">Service chips (comma separated)</label>
          <input
            id="service_options"
            value={serviceText}
            onChange={(e) => setServiceText(e.target.value)}
            className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
            placeholder="Grilled Fish, Brochettes, Cold Drinks"
          />
        </div>
        <button disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Changes"}</button>
        {saved && <p className="text-sm text-corner-200">Saved.</p>}
        {err && <p className="text-sm text-ember-400">{err}</p>}
      </form>
    </div>
  );
}
