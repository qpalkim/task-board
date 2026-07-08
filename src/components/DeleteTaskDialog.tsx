import { createPortal } from "react-dom";
import "./TaskDialog.css";

interface DeleteTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteTaskDialog({
  open,
  onClose,
  onDelete,
}: DeleteTaskDialogProps) {
  if (!open) return null;

  return createPortal(
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>태스크 삭제</h2>

        <p>태스크를 삭제하시겠습니까?</p>

        <div className="dialog-actions">
          <button className="state-button" onClick={onClose}>
            취소
          </button>
          <button className="state-button" onClick={onDelete}>
            삭제
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
