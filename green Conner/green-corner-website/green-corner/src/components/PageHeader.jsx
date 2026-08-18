export default function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="border-b border-line/10 bg-char-950 pt-20">
      <div className="container-narrow py-12 sm:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-paper leading-tight tracking-tight">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-mute">{description}</p>}
      </div>
    </section>
  );
}
