import { useEffect, useState } from "react";
import { getTasks } from "../api/client";
import { Task } from "../types";

export function useTaskFetch() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  return {
    tasks,
    setTasks,
    loading,
    error,
    fetchTasks,
  };
}
