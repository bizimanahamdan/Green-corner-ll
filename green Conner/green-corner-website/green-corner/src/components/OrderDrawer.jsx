import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../lib/CartContext";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { displayPrice, formatPrice } from "../lib/business";

export default function OrderDrawer() {
  const { items, count, total, open, closeCart, setQty, clear } = useCart();
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeCart]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-ink-900/40" onClick={closeCart}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-drawer-heading"
        className="h-full w-full max-w-md bg-cream shadow-2xl flex flex-col animate-modalIn motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-900/10">
          <h2 id="order-drawer-heading" className="font-display text-lg font-semibold">
            {t("cart.title")}
            {count > 0 ? ` · ${count}` : ""}
          </h2>
          <button
            onClick={closeCart}
            className="h-10 w-10 rounded-full hover:bg-ink-900/5"
            aria-label={t("common.close")}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-sm text-ink-700/60">{t("cart.empty")}</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-leaf-600 mt-0.5">{displayPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-ink-900/15"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      className="h-9 w-9 rounded-full border border-ink-900/15"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-ink-900/10 p-5 space-y-3">
          {items.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-700/60">{t("cart.total")}</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
          )}
          <div className="flex gap-2">
            {items.length > 0 && (
              <button type="button" onClick={clear} className="btn-outline flex-1">
                {t("cart.clear")}
              </button>
            )}
            <Link to="/contact" onClick={closeCart} className="btn-primary flex-1">
              {t("cart.checkout")}
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
