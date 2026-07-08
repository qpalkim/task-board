import type { Task } from "../types";

export function rollbackTaskUpdate(
  currentTasks: Task[],
  previousTasks: Task[],
  taskId: string,
): Task[] {
  const previousTask = previousTasks.find((task) => task.id === taskId);

  if (!previousTask) return currentTasks;

  return currentTasks.map((task) => (task.id === taskId ? previousTask : task));
}
