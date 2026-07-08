import { CircleAlertIcon } from "lucide-react";

interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="state error-state">
      <CircleAlertIcon size={36} />
      <h2>태스크를 불러오는 데 실패했습니다.</h2>
      <p>{error.message}</p>

      <button className="state-button" onClick={onRetry}>
        다시 시도
      </button>
    </div>
  );
}
