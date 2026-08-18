import { Link } from "react-router-dom";
import { businessInfo as demo, hours as demoHours } from "../lib/demoData";
import { useBusinessInfo, useHours } from "../lib/useContent";
import OpenStatusBadge from "./OpenStatusBadge";

function LeafBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-leaf-100 blur-2xl opacity-70" />
      <div className="absolute top-40 -right-16 h-64 w-64 rounded-full bg-citrus-400/20 blur-2xl" />
      <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-leaf-50 blur-2xl" />
    </div>
  );
}

export default function Hero() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: hours } = useHours();

  return (
    <section className="relative overflow-hidden bg-mint">
      <LeafBlobs />

      <div className="container-narrow relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        {/* Left: copy */}
        <div className="relative z-10 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <p className="eyebrow inline-flex items-center gap-2">
              <span>{b.neighborhood}, {b.city}</span>
            </p>
            <OpenStatusBadge hours={hours || demoHours} />
          </div>

          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-ink-900">
            Fire-grilled,
            <br />
            <span className="italic text-leaf-600">made the Rwandan way.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-ink-700/75 mx-auto lg:mx-0">
            {b.description}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link to="/menu" className="btn-primary">View Menu</Link>
            <Link to="/contact" className="btn-citrus">Order Ahead</Link>
            <Link to="/location" className="btn-outline">Get Directions</Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start">
            {b.serviceOptions?.map((opt) => (
              <span key={opt} className="rounded-full border border-ink-900/10 bg-white px-4 py-1.5 text-xs text-ink-700/80">
                {opt}
              </span>
            ))}
          </div>
        </div>

        {/* Right: floating illustrations, or an admin-uploaded hero video */}
        <div className="relative z-10 mx-auto h-[360px] w-full max-w-md sm:h-[420px] lg:h-[460px]">
          {b.heroMediaType === "video" && b.heroVideoUrl ? (
            <video
              src={b.heroVideoUrl}
              className="absolute inset-0 h-full w-full rounded-[2rem] object-cover shadow-xl shadow-ink-900/10"
              autoPlay
              muted
              loop
              playsInline
              aria-label="The Green Corner, short video"
            />
          ) : (
            <>
              <div className="absolute inset-6 rounded-[2.5rem] bg-white shadow-xl shadow-ink-900/5 border border-ink-900/5" />

              <div className="absolute left-4 top-2 w-2/5 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg animate-float">
                <img
                  src={b.heroImage1}
                  alt="Fire-grilled fish at The Green Corner"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute right-2 top-20 w-2/5 aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-lg animate-floatSlow">
                <img
                  src={b.heroImage2}
                  alt="Goat brochettes grilling over an open flame"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1/3 aspect-square rounded-full overflow-hidden border-4 border-white shadow-lg animate-bob">
                <img
                  src={b.heroImage3}
                  alt="Ice-cold local beer"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </>
          )}

          <div className="absolute -bottom-4 right-4 rounded-xl bg-white border border-leaf-500/20 px-4 py-2 text-xs text-ink-700 shadow-md">
            <span className="text-leaf-600 font-semibold">Fire-grilled</span> · to order
          </div>
        </div>
      </div>
    </section>
  );
}
