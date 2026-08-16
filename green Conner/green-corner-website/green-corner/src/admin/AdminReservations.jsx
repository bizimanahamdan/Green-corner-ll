import { useAdminTable } from "./useAdminTable";

const statusColors = {
  new: "text-ember-400",
  confirmed: "text-corner-200",
  cancelled: "text-cream/40"
};

export default function AdminReservations() {
  const { rows, loading, update, remove } = useAdminTable("reservations", {
    orderBy: "created_at",
    ascending: false
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Reservation Requests</h1>
      {loading && <p className="text-cream/50">Loading…</p>}
      {!loading && rows.length === 0 && <p className="text-cream/50">No reservation requests yet.</p>}

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="admin-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium">
                {r.name} <span className={`text-xs ml-2 ${statusColors[r.status] || ""}`}>{r.status}</span>
              </p>
              <p className="text-sm text-cream/60">
                {r.date} at {r.time} · {r.guests} guests · <a href={`tel:${r.phone}`} className="hover:text-ember-400">{r.phone}</a>
              </p>
              {r.message && <p className="text-sm text-cream/50 mt-1">"{r.message}"</p>}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <select
                value={r.status}
                onChange={(e) => update(r.id, { status: e.target.value })}
                className="rounded-lg bg-char-950 border border-cream/15 px-2 py-1 text-sm"
              >
                <option value="new">New</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => remove(r.id)} className="text-xs text-ember-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
