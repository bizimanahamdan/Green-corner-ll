import { Link } from "react-router-dom";
import { useAdminTable } from "./useAdminTable";

function StatCard({ label, value, to }) {
  return (
    <Link to={to} className="admin-card p-6 block hover:border-ember-400/40 transition-colors">
      <p className="text-3xl font-display font-semibold text-ember-400">{value}</p>
      <p className="mt-1 text-sm text-cream/60">{label}</p>
    </Link>
  );
}

export default function AdminOverview() {
  const { rows: reservations } = useAdminTable("reservations", { orderBy: "created_at", ascending: false });
  const { rows: inquiries } = useAdminTable("inquiries", { orderBy: "created_at", ascending: false });
  const { rows: menuItems } = useAdminTable("menu_items");
  const { rows: gallery } = useAdminTable("gallery");

  const newReservations = reservations.filter((r) => r.status === "new");
  const newInquiries = inquiries.filter((i) => i.status === "new");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard label="New order requests" value={newReservations.length} to="/admin/reservations" />
        <StatCard label="New inquiries" value={newInquiries.length} to="/admin/inquiries" />
        <StatCard label="Menu items" value={menuItems.length} to="/admin/menu" />
        <StatCard label="Gallery images" value={gallery.length} to="/admin/gallery" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <h2 className="font-semibold mb-4">Latest order requests</h2>
          {newReservations.length === 0 && <p className="text-sm text-cream/50">No new requests.</p>}
          <ul className="space-y-3">
            {newReservations.slice(0, 5).map((r) => (
              <li key={r.id} className="text-sm border-b border-cream/10 pb-2">
                <span className="font-medium">{r.name}</span>
                {" · "}
                {r.date} at {r.time}
                {r.guests ? ` · ${r.guests} item${r.guests === 1 ? "" : "s"}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card p-6">
          <h2 className="font-semibold mb-4">Latest inquiries</h2>
          {newInquiries.length === 0 && <p className="text-sm text-cream/50">No new messages.</p>}
          <ul className="space-y-3">
            {newInquiries.slice(0, 5).map((i) => (
              <li key={i.id} className="text-sm border-b border-cream/10 pb-2">
                <span className="font-medium">{i.name}</span> — {i.message?.slice(0, 60)}
                {i.message?.length > 60 ? "…" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
