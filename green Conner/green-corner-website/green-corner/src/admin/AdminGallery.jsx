import { useState } from "react";
import { useAdminTable } from "./useAdminTable";
import { uploadMedia, MAX_IMAGE_MB } from "../lib/storage";
import { isIllustration } from "../lib/media";

const empty = { url: "", caption: "", category: "Smoothies", sort_order: 0 };
const categories = ["Smoothies", "Juices", "Salads", "Bowls", "Ingredients", "Interior", "Atmosphere"];

export default function AdminGallery() {
  const gallery = useAdminTable("gallery");
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
      const url = await uploadMedia(file, "gallery");
      setForm((f) => ({ ...f, url }));
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.url) {
      setErr("Upload an image or paste an image URL first.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await gallery.insert(form);
      setForm(empty);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Gallery</h1>
      {err && <p className="text-ember-400 text-sm mb-4">{err}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {gallery.rows.map((img) => (
          <div key={img.id} className="admin-card overflow-hidden">
            <div className={`h-32 w-full bg-char-950 flex items-center justify-center ${isIllustration(img.url) ? "p-3" : ""}`}>
              <img
                src={img.url}
                alt={img.caption}
                className={isIllustration(img.url) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-cream/60 truncate">{img.caption}</p>
              <button onClick={() => gallery.remove(img.id)} className="text-xs text-ember-400 hover:underline mt-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="admin-card p-6 space-y-3 max-w-md">
        <p className="font-semibold">Add image</p>

        {form.url && (
          <div className={`h-32 w-full bg-char-950 rounded-lg flex items-center justify-center ${isIllustration(form.url) ? "p-3" : ""}`}>
            <img
              src={form.url}
              alt="Preview"
              className={isIllustration(form.url) ? "h-full w-full object-contain" : "h-full w-full object-cover rounded-lg"}
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
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          className="admin-input"
        />
        <input
          placeholder="Caption"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="admin-input"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="admin-input"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button disabled={busy} className="btn-primary w-full">{busy ? "Adding…" : "Add Image"}</button>
      </form>
    </div>
  );
}
