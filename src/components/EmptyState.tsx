interface EmptyStateProps {
  onCreate: () => void;
}

export default function EmptyState({ onCreate }: EmptyStateProps) {
  return (
    <div className="state empty-state">
      <h2>태스크가 없습니다.</h2>
      <p>새로운 태스크를 추가해 보세요.</p>

      <button className="state-button" onClick={onCreate}>
        태스크 추가
      </button>
    </div>
  );
}
