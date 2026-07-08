import { useRef } from "react";
import { Status, Task, TaskInput } from "../types";
import { useTaskFetch } from "./useTaskFetch";
import {
  ApiError,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from "../api/client";

export function useTasks() {
  const { tasks, setTasks, loading, error, fetchTasks } = useTaskFetch();

  const requestSeq = useRef(0);
  const latestRequest = useRef(new Map<string, number>());

  const moveTask = async (id: string, status: Status) => {
    const target = tasks.find((t) => t.id === id);
    if (!target || target.status === status) return;

    const requestId = ++requestSeq.current;
    latestRequest.current.set(id, requestId);

    const previousTasks = [...tasks];

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

    try {
      const updatedTask = await updateTaskApi(id, {
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

  // 태스크 생성 핸들러
  const handleCreateTask = async (input: TaskInput) => {
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

    try {
      const createdTask = await createTaskApi({
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

  // 태스크 수정 핸들러
  const handleUpdateTask = async (id: string, input: TaskInput) => {
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
      const updatedTask = await updateTaskApi(id, {
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

  // 태스크 삭제 핸들러
  const handleDeleteTask = async (id: string) => {
    const previousTasks = [...tasks];

    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await deleteTaskApi(id);
    } catch {
      setTasks(previousTasks);
      alert("태스크 삭제에 실패했습니다.");
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    moveTask,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
  };
}
