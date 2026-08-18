import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import SEO from "../components/SEO";
import { useAdminNotifications } from "../lib/useAdminNotifications";
import { useAdminTable } from "./useAdminTable";
import { isBackgroundPushEnabled, refreshBackgroundPush } from "../lib/push";
import AdminErrorBoundary from "./AdminErrorBoundary";

const items = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/reservations", label: "Orders", badge: "orders" },
  { to: "/admin/inquiries", label: "Inquiries", badge: "inquiries" },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/specials", label: "Specials" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/hours", label: "Hours" },
  { to: "/admin/business-info", label: "Business Info" },
  { to: "/admin/media", label: "Logo & Hero Media" },
  { to: "/admin/settings", label: "Notifications" }
];

export default function AdminLayout() {
  const { signOut, session } = useAuth();
  const [open, setOpen] = useState(false);
  useAdminNotifications();

  const [pushOn, setPushOn] = useState(isBackgroundPushEnabled());

  useEffect(() => {
    if (!session?.user?.id) return undefined;
    refreshBackgroundPush(session.user.id).catch(() => {});
    return undefined;
  }, [session?.user?.id]);

  useEffect(() => {
    const sync = () => setPushOn(isBackgroundPushEnabled());
    window.addEventListener("green-corner:push", sync);
    return () => window.removeEventListener("green-corner:push", sync);
  }, []);

  const showPushHint = !pushOn;
  const { rows: reservations } = useAdminTable("reservations", { orderBy: "created_at", ascending: false });
  const { rows: inquiries } = useAdminTable("inquiries", { orderBy: "created_at", ascending: false });
  const newOrders = reservations.filter((r) => r.status === "new").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const badgeFor = (key) => {
    if (key === "orders" && newOrders) return newOrders;
    if (key === "inquiries" && newInquiries) return newInquiries;
    return 0;
  };

  const NavItems = ({ onClick }) => (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center justify-between rounded-lg px-3 py-2 text-sm min-h-[40px] ${
              isActive ? "bg-ember-500 text-char-950 font-semibold" : "text-cream/70 hover:bg-char-800"
            }`
          }
        >
          <span>{item.label}</span>
          {badgeFor(item.badge) > 0 && (
            <span className="ml-2 rounded-full bg-ember-400 text-char-950 text-[11px] font-bold px-1.5">
              {badgeFor(item.badge)}
            </span>
          )}
        </NavLink>
      ))}
    </>
  );

  return (
    <div data-theme="dark" className="min-h-screen bg-[#0b0a08] text-cream flex flex-col md:flex-row">
      <SEO title="Admin Dashboard" path="/admin" noindex />
      <div className="md:hidden flex items-center justify-between p-4 border-b border-cream/10">
        <p className="font-display font-semibold">
          <span className="text-ember-400">Green</span> Corner Admin
        </p>
        <button onClick={() => setOpen((v) => !v)} className="p-2" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-b border-cream/10 p-3 space-y-1">
          <NavItems onClick={() => setOpen(false)} />
          <button onClick={signOut} className="w-full text-left rounded-lg px-3 py-2 text-sm text-ember-400 hover:bg-char-800">
            Sign Out
          </button>
        </div>
      )}

      <aside className="hidden md:flex md:flex-col w-64 border-r border-cream/10 p-5">
        <p className="font-display font-semibold mb-6">
          <span className="text-ember-400">Green</span> Corner Admin
        </p>
        <nav className="space-y-1 flex-1">
          <NavItems />
        </nav>
        <button onClick={signOut} className="mt-6 w-full text-left rounded-lg px-3 py-2 text-sm text-ember-400 hover:bg-char-800">
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-5 sm:p-8 overflow-x-hidden">
        {showPushHint && (
          <div className="mb-5 rounded-xl border border-ember-400/30 bg-ember-500/10 px-4 py-3 text-sm text-cream/80">
            Background alerts are off on this device.{" "}
            <NavLink to="/admin/settings" className="text-ember-400 underline underline-offset-2">
              Enable push
            </NavLink>{" "}
            so a new order reaches you after you close this tab.
          </div>
        )}
        <AdminErrorBoundary>
          <Outlet />
        </AdminErrorBoundary>
      </main>
    </div>
  );
}
