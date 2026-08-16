import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { uploadMedia, MAX_IMAGE_MB, MAX_VIDEO_MB } from "../lib/storage";

function UploadField({ label, currentUrl, accept, maxMb, folder, onUploaded, isVideo }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) {
      setErr(`File is too large. Max ${maxMb}MB.`);
      return;
    }
    setErr("");
    setBusy(true);
    try {
      const url = await uploadMedia(file, folder);
      onUploaded(url);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-cream/10 rounded-xl p-4">
      <p className="text-sm font-medium mb-2">{label}</p>
      {currentUrl ? (
        isVideo ? (
          <video src={currentUrl} className="h-32 w-full object-cover rounded-lg mb-3" muted loop autoPlay playsInline />
        ) : (
          <img src={currentUrl} alt={label} className="h-32 w-full object-cover rounded-lg mb-3" />
        )
      ) : (
        <div className="h-32 w-full rounded-lg bg-char-950 border border-dashed border-cream/15 flex items-center justify-center text-xs text-cream/40 mb-3">
          Nothing uploaded yet
        </div>
      )}
      <label className="admin-btn-outline text-xs cursor-pointer inline-flex">
        {busy ? "Uploading…" : "Upload file"}
        <input type="file" accept={accept} onChange={handleFile} className="hidden" disabled={busy} />
      </label>
      {err && <p className="text-xs text-ember-400 mt-2">{err}</p>}
    </div>
  );
}

export default function AdminMedia() {
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

  const patch = (values) => setForm((f) => ({ ...f, ...values }));

  const save = async () => {
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

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Logo & Hero Media</h1>
      <p className="text-sm text-cream/60 mb-6">
        Upload the business logo and the images or short video shown on the homepage hero.
        Changes go live as soon as you hit Save.
      </p>

      {err && <p className="text-ember-400 text-sm mb-4">{err}</p>}

      <div className="grid gap-6 sm:grid-cols-2 mb-8">
        <UploadField
          label="Logo"
          currentUrl={form.logo_url}
          accept="image/*"
          maxMb={MAX_IMAGE_MB}
          folder="logo"
          onUploaded={(url) => patch({ logo_url: url })}
        />
      </div>

      <div className="admin-card p-6 mb-8">
        <p className="font-semibold mb-3">Hero style</p>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={form.hero_media_type !== "video"}
              onChange={() => patch({ hero_media_type: "images" })}
            />
            Photo collage (3 images)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={form.hero_media_type === "video"}
              onChange={() => patch({ hero_media_type: "video" })}
            />
            Short video
          </label>
        </div>
      </div>

      {form.hero_media_type === "video" ? (
        <div className="mb-8">
          <UploadField
            label="Hero video (short, muted-autoplay loop — a few seconds works best)"
            currentUrl={form.hero_video_url}
            accept="video/*"
            maxMb={MAX_VIDEO_MB}
            folder="hero"
            isVideo
            onUploaded={(url) => patch({ hero_video_url: url })}
          />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-3 mb-8">
          <UploadField
            label="Hero image 1 (top right)"
            currentUrl={form.hero_image_1}
            accept="image/*"
            maxMb={MAX_IMAGE_MB}
            folder="hero"
            onUploaded={(url) => patch({ hero_image_1: url })}
          />
          <UploadField
            label="Hero image 2 (bottom left, featured dish)"
            currentUrl={form.hero_image_2}
            accept="image/*"
            maxMb={MAX_IMAGE_MB}
            folder="hero"
            onUploaded={(url) => patch({ hero_image_2: url })}
          />
          <UploadField
            label="Hero image 3 (small corner card)"
            currentUrl={form.hero_image_3}
            accept="image/*"
            maxMb={MAX_IMAGE_MB}
            folder="hero"
            onUploaded={(url) => patch({ hero_image_3: url })}
          />
        </div>
      )}

      <button onClick={save} disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Save Changes"}
      </button>
      {saved && <p className="text-sm text-corner-200 mt-2">Saved — check the homepage.</p>}
    </div>
  );
}
