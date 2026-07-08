import { useMemo, useState } from "react";
import type { Status } from "./types";
import { Column } from "./components/Column";
import { useTasks } from "./hooks/useTasks";
import CreateTaskDialog from "./components/CreateTaskDialog";
import SkeletonColumn from "./components/SkeletonColumn";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";

const COLUMNS: { status: Status; title: string }[] = [
  { status: "todo", title: "To Do" },
  { status: "in-progress", title: "In Progress" },
  { status: "done", title: "Done" },
];

export default function Board() {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    moveTask,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === "todo"),
      "in-progress": tasks.filter((task) => task.status === "in-progress"),
      done: tasks.filter((task) => task.status === "done"),
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="board">
        {COLUMNS.map((col) => (
          <SkeletonColumn key={col.status} title={col.title} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState error={error} onRetry={fetchTasks} />;

  return (
    <>
      {tasks.length === 0 ? (
        <EmptyState onCreate={() => setIsCreateOpen(true)} />
      ) : (
        <>
          <button
            className="state-button"
            onClick={() => setIsCreateOpen(true)}
          >
            태스크 추가
          </button>
          <div className="board">
            {COLUMNS.map((col) => (
              <Column
                key={col.status}
                title={col.title}
                status={col.status}
                tasks={tasksByStatus[col.status]}
                onMove={moveTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </>
      )}

      {isCreateOpen && (
        <CreateTaskDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={createTask}
        />
      )}
    </>
  );
}
