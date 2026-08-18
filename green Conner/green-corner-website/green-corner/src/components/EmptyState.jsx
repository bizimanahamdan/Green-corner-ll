export default function EmptyState({ title, body }) {
  return (
    <div className="card-surface px-6 py-12 text-center max-w-xl mx-auto">
      {title && <p className="font-display text-lg font-semibold text-paper">{title}</p>}
      <p className={`text-sm text-mute leading-relaxed ${title ? "mt-2" : ""}`}>{body}</p>
    </div>
  );
}
