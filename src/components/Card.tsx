import { useState } from "react";
import { Pencil, Trash } from "lucide-react";
import type { Priority, Task } from "../types";
import EditTaskDialog from "./EditTaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
import "./Card.css";

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

interface CardProps {
  task: Task;
  onUpdate: (
    id: string,
    input: {
      title: string;
      priority: Priority;
      description?: string;
    },
  ) => void;
  onDelete: (id: string) => void;
}

export function Card({ task, onUpdate, onDelete }: CardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <article
        className={`card priority-${task.priority}`}
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
      >
        <div className="card-actions">
          <button
            className="icon-button"
            aria-label="태스크 수정"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(true);
            }}
          >
            <Pencil size={14} />
          </button>

          <button
            className="icon-button"
            aria-label="태스크 삭제"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <Trash size={14} />
          </button>
        </div>

        <div className="card-title">{task.title}</div>
        <div className="card-meta">
          <span className={`badge badge-${task.priority}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
          <span className="date">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </article>

      <EditTaskDialog
        open={isEditOpen}
        task={task}
        onClose={() => setIsEditOpen(false)}
        onUpdate={(input) => {
          onUpdate(task.id, input);
          setIsEditOpen(false);
        }}
      />

      <DeleteTaskDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={() => {
          onDelete(task.id);
          setIsDeleteOpen(false);
        }}
      />
    </>
  );
}
