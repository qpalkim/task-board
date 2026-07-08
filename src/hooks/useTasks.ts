import { useTaskFetch } from "./useTaskFetch";
import { useTaskMutation } from "./useTaskMutation";

export function useTasks() {
  const taskFetch = useTaskFetch();

  const taskMutation = useTaskMutation({
    tasks: taskFetch.tasks,
    setTasks: taskFetch.setTasks,
  });

  return {
    ...taskFetch,
    ...taskMutation,
  };
}
