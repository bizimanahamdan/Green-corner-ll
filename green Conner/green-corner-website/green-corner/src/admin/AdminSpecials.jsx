import { useState } from "react";
import { useAdminTable } from "./useAdminTable";
import { uploadMedia, MAX_IMAGE_MB } from "../lib/storage";
import { isIllustration } from "../lib/media";

const empty = { title: "", description: "", tag: "", image_url: "", active: true, sort_order: 0 };

export default function AdminSpecials() {
  const specials = useAdminTable("specials");
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErr(`File is too large. Max ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setErr("");
    setUploading(true);
    try {
      const url = await uploadMedia(file, "specials");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    setBusy(true);
    setErr("");
    try {
      await specials.insert(form);
      setForm(empty);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Specials & Promotions</h1>
      {err && <p className="text-ember-400 text-sm mb-4">{err}</p>}

      <div className="space-y-3 mb-8">
        {specials.rows.map((s) => (
          <div key={s.id} className="admin-card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.title} {!s.active && <span className="text-cream/40 text-xs">(inactive)</span>}</p>
              <p className="text-sm text-cream/60">{s.description}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => specials.update(s.id, { active: !s.active })}
                className="text-xs text-ember-400 hover:underline"
              >
                {s.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => specials.remove(s.id)} className="text-xs text-ember-400 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="admin-card p-6 space-y-3 max-w-md">
        <p className="font-semibold">Add special</p>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="admin-input"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="admin-input"
        />
        <input
          placeholder="Tag (e.g. Tonight, Weekend)"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="admin-input"
        />

        {form.image_url && (
          <div className={`h-32 w-full bg-char-950 rounded-lg flex items-center justify-center ${isIllustration(form.image_url) ? "p-3" : ""}`}>
            <img
              src={form.image_url}
              alt="Preview"
              className={isIllustration(form.image_url) ? "h-full w-full object-contain" : "h-full w-full object-cover rounded-lg"}
            />
          </div>
        )}

        <label className="admin-btn-outline text-sm cursor-pointer inline-flex w-full justify-center">
          {uploading ? "Uploading…" : "Upload Photo"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>

        <p className="text-xs text-cream/40 text-center">— or paste an image URL below —</p>

        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="admin-input"
        />
        <button disabled={busy} className="btn-primary w-full">{busy ? "Adding…" : "Add Special"}</button>
      </form>
    </div>
  );
}
