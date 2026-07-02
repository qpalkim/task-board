interface SkeletonColumnProps {
  title: string;
}

export default function SkeletonColumn({ title }: SkeletonColumnProps) {
  return (
    <section className="column">
      <h2 className="column-title">
        {title} <span className="count">...</span>
      </h2>

      <div className="column-body">
        {Array.from({ length: 6 }).map((_, index) => (
          <article key={index} className="card skeleton-card">
            <div className="skeleton skeleton-title" />

            <div className="card-meta">
              <div className="skeleton skeleton-badge" />
              <div className="skeleton skeleton-date" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
