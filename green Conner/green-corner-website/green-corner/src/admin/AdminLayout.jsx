import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import SEO from "../components/SEO";

const items = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/menu", label: "Menu" },
  { to: "/admin/gallery", label: "Gallery" },
  { to: "/admin/specials", label: "Specials" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/hours", label: "Hours" },
  { to: "/admin/business-info", label: "Business Info" },
  { to: "/admin/media", label: "Logo & Hero Media" },
  { to: "/admin/reservations", label: "Orders" },
  { to: "/admin/inquiries", label: "Inquiries" }
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const NavItems = ({ onClick }) => (
    <>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onClick}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm ${
              isActive ? "bg-ember-500 text-char-950 font-semibold" : "text-cream/70 hover:bg-char-800"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-char-950 text-cream flex flex-col md:flex-row">
      <SEO title="Admin Dashboard" path="/admin" noindex />
      {/* Mobile top bar */}
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

      {/* Desktop sidebar */}
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
        <Outlet />
      </main>
    </div>
  );
}
