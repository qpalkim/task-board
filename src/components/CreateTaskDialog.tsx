import { useEffect, useState } from "react";
import { Priority } from "../types";
import "./TaskDialog.css";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    title: string;
    priority: Priority;
    description?: string;
  }) => void;
}

export default function CreateTaskDialog({
  open,
  onClose,
  onCreate: onUpdate,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setPriority("medium");
      setDescription("");
    }
  }, [open]);

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

  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>태스크 추가</h2>

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
          <button onClick={onClose}>취소</button>
          <button onClick={handleSubmit}>생성</button>
        </div>
      </div>
    </div>
  );
}
