import { useState } from "react";
import type { Priority, Task } from "../types";
import EditTaskDialog from "./EditTaskDialog";
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
}

export function Card({ task, onUpdate }: CardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <article
        className={`card priority-${task.priority}`}
        draggable
        onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
      >
        <button
          className="edit-button"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditOpen(true);
          }}
        >
          수정
        </button>

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
    </>
  );
}
