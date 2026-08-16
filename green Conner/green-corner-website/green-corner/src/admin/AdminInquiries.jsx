import { useAdminTable } from "./useAdminTable";

export default function AdminInquiries() {
  const { rows, loading, update, remove } = useAdminTable("inquiries", {
    orderBy: "created_at",
    ascending: false
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Customer Inquiries</h1>
      {loading && <p className="text-cream/50">Loading…</p>}
      {!loading && rows.length === 0 && <p className="text-cream/50">No messages yet.</p>}

      <div className="space-y-3">
        {rows.map((i) => (
          <div key={i.id} className="admin-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-medium">
                {i.name} <span className="text-xs text-cream/40 ml-2">{i.contact}</span>
              </p>
              <p className="text-sm text-cream/60 mt-1">{i.message}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <select
                value={i.status}
                onChange={(e) => update(i.id, { status: e.target.value })}
                className="rounded-lg bg-char-950 border border-cream/15 px-2 py-1 text-sm"
              >
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
              <button onClick={() => remove(i.id)} className="text-xs text-ember-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
