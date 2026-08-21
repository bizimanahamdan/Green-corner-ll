import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useMenu } from "../lib/useContent";
import { useCart } from "../lib/CartContext";
import { isIllustration, isPlaceholderText } from "../lib/media";
import { displayPrice } from "../lib/business";

export default function Menu() {
  const { data: categories, loading } = useMenu();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const [active, setActive] = useState("all");

  const list = categories || [];
  const visibleCategories = useMemo(
    () => (active === "all" ? list : list.filter((c) => c.id === active)),
    [active, list]
  );

  return (
    <>
      <SEO
        title="Menu"
        description="Fire-grilled fish, goat and beef brochettes, and cold drinks at The Green Corner in Nyamirambo, Kigali."
        path="/menu"
      />
      <PageHeader
        eyebrow={t("pages.menuEyebrow")}
        title={t("pages.menuTitle")}
        description={t("menu.priceNote")}
      />

      <section className="container-narrow py-10 sm:py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive("all")}
            className={`rounded-full px-4 py-2 text-sm border min-h-[40px] ${
              active === "all" ? "bg-leaf-500 border-leaf-500 text-white" : "border-line/15 text-mute"
            }`}
          >
            {t("menu.all")}
          </button>
          {list.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full px-4 py-2 text-sm border min-h-[40px] ${
                active === c.id ? "bg-leaf-500 border-leaf-500 text-white" : "border-line/15 text-mute"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-mute">{t("common.loading")}</p>
        ) : (
          <div className="space-y-14">
            {visibleCategories.map((cat) => (
              <div key={cat.id}>
                <h2 className="font-display text-2xl font-semibold mb-6 text-leaf-400">{cat.name}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cat.items.map((item) => {
                    const unavailable = item.available === false;
                    return (
                      <article
                        key={item.id}
                        className={`card-surface p-4 sm:p-5 flex gap-4 ${unavailable ? "opacity-50" : ""}`}
                      >
                        {item.image && (
                          <div className={`h-20 w-20 rounded-lg flex-shrink-0 overflow-hidden ${isIllustration(item.image) ? "bg-char-800 p-2" : ""}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className={isIllustration(item.image) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="font-semibold leading-snug">
                              {item.name}
                              {unavailable && (
                                <span className="ml-2 text-xs font-normal text-mute/70">({t("menu.unavailable")})</span>
                              )}
                            </h3>
                            <span className="text-leaf-400 text-sm whitespace-nowrap">
                              {isPlaceholderText(item.price) || !displayPrice(item.price) ? t("common.askStaff") : displayPrice(item.price)}
                            </span>
                          </div>
                          {!isPlaceholderText(item.description) && item.description && (
                            <p className="mt-1 text-sm text-mute">{item.description}</p>
                          )}
                          {!unavailable && (
                            <button type="button" onClick={() => addItem(item)} className="mt-3 text-sm font-semibold text-leaf-400 hover:text-leaf-300">
                              + {t("common.addToOrder")}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
