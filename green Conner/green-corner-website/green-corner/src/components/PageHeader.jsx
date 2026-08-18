export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="border-b border-ink-900/8 bg-white pt-20">
      <div className="container-narrow py-12 sm:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 leading-tight">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-ink-700/65">{description}</p>}
      </div>
    </section>
  );
}
