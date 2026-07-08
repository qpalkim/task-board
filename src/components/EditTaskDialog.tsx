import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Priority, Task } from "../types";
import "./TaskDialog.css";

interface EditTaskDialogProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onUpdate: (input: {
    title: string;
    priority: Priority;
    description?: string;
  }) => void;
}

export default function EditTaskDialog({
  open,
  task,
  onClose,
  onUpdate,
}: EditTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setPriority(task.priority);
    setDescription(task.description ?? "");
  }, [task]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }

    onUpdate({
      title,
      priority,
      description: description.trim() || undefined,
    });

    setTitle("");
    setPriority("medium");
    setDescription("");
    onClose();
  };

  return createPortal(
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>태스크 수정</h2>

        <label>
          제목
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          우선순위
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
        </label>

        <label>
          설명
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="dialog-actions">
          <button className="state-button" onClick={onClose}>
            취소
          </button>
          <button className="state-button" onClick={handleSubmit}>
            수정
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
