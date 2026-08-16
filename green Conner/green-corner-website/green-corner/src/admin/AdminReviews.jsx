import { useState } from "react";
import { useAdminTable } from "./useAdminTable";

const empty = { author_name: "", rating: 5, quote: "", visible: true, sort_order: 0 };

export default function AdminReviews() {
  const reviews = useAdminTable("reviews", { orderBy: "sort_order" });
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!form.author_name || !form.quote) return;
    setBusy(true);
    setErr("");
    try {
      await reviews.insert(form);
      setForm(empty);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-2">Reviews</h1>
      <p className="text-sm text-cream/50 mb-6">
        Only add reviews you have permission to publish — a real customer's words, with their
        name. Don't copy text verbatim from Google without checking that's okay first.
      </p>
      {err && <p className="text-ember-400 text-sm mb-4">{err}</p>}

      <div className="space-y-3 mb-8">
        {reviews.rows.map((r) => (
          <div key={r.id} className="admin-card p-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">
                {r.author_name}{" "}
                <span className="text-citrus-400 text-sm">{"★".repeat(r.rating)}</span>
                {!r.visible && <span className="text-cream/40 text-xs ml-2">(hidden)</span>}
              </p>
              <p className="text-sm text-cream/60 mt-1">"{r.quote}"</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => reviews.update(r.id, { visible: !r.visible })}
                className="text-xs text-ember-400 hover:underline"
              >
                {r.visible ? "Hide" : "Show"}
              </button>
              <button onClick={() => reviews.remove(r.id)} className="text-xs text-ember-400 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="admin-card p-6 space-y-3 max-w-md">
        <p className="font-semibold">Add review</p>
        <input
          placeholder="Customer name"
          value={form.author_name}
          onChange={(e) => setForm({ ...form, author_name: e.target.value })}
          className="admin-input"
        />
        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          className="admin-input"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
          ))}
        </select>
        <textarea
          placeholder="What they said"
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          className="admin-input"
          rows={3}
        />
        <button disabled={busy} className="btn-primary w-full">{busy ? "Adding…" : "Add Review"}</button>
      </form>
    </div>
  );
}
