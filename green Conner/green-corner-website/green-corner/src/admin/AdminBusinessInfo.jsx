import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminBusinessInfo() {
  const [form, setForm] = useState(null);
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
        setLoading(false);
      });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setErr("");
    const { id, ...values } = form;
    const { error } = await supabase.from("business_info").update(values).eq("id", id);
    setSaving(false);
    if (error) setErr(error.message);
    else setSaved(true);
  };

  if (loading) return <p className="text-cream/50">Loading…</p>;
  if (!form) return <p className="text-ember-400 text-sm">{err || "No business info row found."}</p>;

  const field = (key, label, type = "text") => (
    <div>
      <label className="text-sm text-cream/70">{label}</label>
      <input
        type={type}
        value={form[key] || ""}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
      />
    </div>
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Business Info</h1>
      <form onSubmit={save} className="admin-card p-6 max-w-xl space-y-4">
        {field("name", "Business name")}
        {field("tagline", "Tagline")}
        <div>
          <label className="text-sm text-cream/70">Description</label>
          <textarea
            rows={3}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg bg-char-950 border border-cream/15 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("phone", "Phone")}
          {field("whatsapp", "WhatsApp (digits only, with country code)")}
          {field("instagram", "Instagram handle")}
          {field("facebook_url", "Facebook page URL")}
          {field("tiktok_url", "TikTok profile URL")}
          {field("neighborhood", "Neighborhood")}
          {field("city", "City")}
          {field("price_range", "Price range")}
          {field("google_rating", "Google rating")}
          {field("google_review_count", "Google review count")}
        </div>
        <button disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save Changes"}</button>
        {saved && <p className="text-sm text-corner-200">Saved.</p>}
        {err && <p className="text-sm text-ember-400">{err}</p>}
      </form>
    </div>
  );
}
