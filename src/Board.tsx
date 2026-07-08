import { useEffect, useMemo, useRef, useState } from "react";
import type { Task, Status, Priority } from "./types";
import {
  ApiError,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./api/client";
import { Column } from "./components/Column";
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const requestSeq = useRef(0);
  const latestRequest = useRef(new Map<string, number>());

  const fetchTasks = async () => {
    setError(null);
    setLoading(true);

    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("알 수 없는 오류가 발생했습니다."));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveTask = async (id: string, status: Status) => {
    const target = tasks.find((t) => t.id === id);
    if (!target || target.status === status) return;

    const requestId = ++requestSeq.current;
    latestRequest.current.set(id, requestId);

    const previousTasks = [...tasks];

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

    try {
      const updatedTask = await updateTask(id, {
        status,
        version: target.version,
      });

      if (latestRequest.current.get(id) !== requestId) return;

      setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        if (latestRequest.current.get(id) !== requestId) return;

        setTasks(previousTasks);

        const current = (error.payload as { current: Task }).current;

        setTasks((prev) =>
          prev.map((t) => (t.id === current.id ? current : t)),
        );

        alert("다른 곳에서 먼저 수정된 카드입니다.");
        return;
      }

      setTasks(previousTasks);
      alert("카드 이동에 실패했습니다.");
    }
  };

  const handleCreateTask = async (input: {
    title: string;
    priority: Priority;
    description?: string;
  }) => {
    const tempId = `temp-${Date.now()}`;

    const optimisticTask: Task = {
      id: tempId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: "todo",
      tags: [],
      assignee: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 0,
    };

    setTasks((prev) => [...prev, optimisticTask]);
    setIsCreateOpen(false);

    try {
      const createdTask = await createTask({
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: "todo",
      });

      setTasks((prev) =>
        prev.map((task) => (task.id === tempId ? createdTask : task)),
      );
    } catch {
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      alert("태스크 생성에 실패했습니다.");
    }
  };

  const handleUpdateTask = async (
    id: string,
    input: {
      title: string;
      priority: Priority;
      description?: string;
    },
  ) => {
    const target = tasks.find((task) => task.id === id);

    if (!target) return;

    const requestId = ++requestSeq.current;
    latestRequest.current.set(id, requestId);

    const previousTasks = [...tasks];

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: input.title,
              priority: input.priority,
              description: input.description?.trim() || undefined,
            }
          : task,
      ),
    );

    try {
      const updatedTask = await updateTask(id, {
        title: input.title,
        priority: input.priority,
        description: input.description,
        version: target.version,
      });

      if (latestRequest.current.get(id) !== requestId) return;

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        if (latestRequest.current.get(id) !== requestId) return;

        setTasks(previousTasks);

        const current = (error.payload as { current: Task }).current;

        setTasks((prev) =>
          prev.map((task) => (task.id === current.id ? current : task)),
        );

        alert("다른 곳에서 먼저 수정된 카드입니다.");
        return;
      }

      setTasks(previousTasks);
      alert("태스크 수정에 실패했습니다.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    const previousTasks = [...tasks];

    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await deleteTask(id);
    } catch {
      setTasks(previousTasks);
      alert("태스크 삭제에 실패했습니다.");
      throw error;
    }
  };

  const byStatus = useMemo(() => {
    const map: Record<Status, Task[]> = {
      todo: [],
      "in-progress": [],
      done: [],
    };
    for (const t of tasks) map[t.status].push(t);
    return map;
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

  if (tasks.length === 0)
    return <EmptyState onCreate={() => setIsCreateOpen(true)} />;

  return (
    <>
      <button className="state-button" onClick={() => setIsCreateOpen(true)}>
        태스크 추가
      </button>
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={byStatus[col.status]}
            onMove={moveTask}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      {isCreateOpen && (
        <CreateTaskDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateTask}
        />
      )}
    </>
  );
}
