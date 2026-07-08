import { memo } from "react";
import type { Task, Status, TaskInput } from "../types";
import { Card } from "./Card";

interface ColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
  onMove: (id: string, status: Status) => void;
  onUpdate: (id: string, input: TaskInput) => void;
  onDelete: (id: string) => void;
}

export const Column = memo(function Column({
  title,
  status,
  tasks,
  onMove,
  onUpdate,
  onDelete,
}: ColumnProps) {
  return (
    <section
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const id = e.dataTransfer.getData("text/plain");
        if (id) onMove(id, status);
      }}
    >
      <h2 className="column-title">
        {title} <span className="count">{tasks.length}</span>
      </h2>
      <div className="column-body">
        {tasks.map((t) => (
          <Card key={t.id} task={t} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
});
