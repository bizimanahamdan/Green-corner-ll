import { useState } from "react";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useMenu } from "../lib/useContent";
import { isIllustration, isPlaceholderText } from "../lib/media";

export default function Menu() {
  const { data: categories, loading } = useMenu();
  const { t } = useLanguage();
  const [active, setActive] = useState("all");

  const visibleCategories =
    active === "all" ? categories : categories.filter((c) => c.id === active);

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
        description="Prices are in Rwandan Francs (RF)."
      />

      <section className="container-narrow py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive("all")}
            className={`rounded-full px-4 py-2 text-sm border ${
              active === "all" ? "bg-leaf-500 border-leaf-500 text-white" : "border-ink-900/15 text-ink-700/70"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`rounded-full px-4 py-2 text-sm border ${
                active === c.id ? "bg-leaf-500 border-leaf-500 text-white" : "border-ink-900/15 text-ink-700/70"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-ink-700/50">Loading menu…</p>
        ) : (
          <div className="space-y-14">
            {visibleCategories.map((cat) => (
              <div key={cat.id}>
                <h2 className="font-display text-2xl font-semibold mb-6 text-leaf-600">{cat.name}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.id}
                      className={`card-surface p-5 flex gap-4 ${item.available === false ? "opacity-50" : ""}`}
                    >
                      {item.image && (
                        <div className={`h-20 w-20 rounded-lg flex items-center justify-center flex-shrink-0 ${isIllustration(item.image) ? "bg-mint p-2" : ""}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={isIllustration(item.image) ? "h-full w-full object-contain" : "h-full w-full rounded-lg object-cover"}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-semibold">
                            {item.name}
                            {item.available === false && (
                              <span className="ml-2 text-xs font-normal text-ink-700/40">(currently unavailable)</span>
                            )}
                          </h3>
                          <span className="text-leaf-600 text-sm whitespace-nowrap">
                            {isPlaceholderText(item.price) ? "Ask staff" : `RF ${item.price}`}
                          </span>
                        </div>
                        {!isPlaceholderText(item.description) && item.description && (
                          <p className="mt-1 text-sm text-ink-700/60">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
