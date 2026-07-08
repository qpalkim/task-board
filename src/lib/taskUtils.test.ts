import { describe, expect, it } from "vitest";
import { rollbackTaskUpdate } from "./taskUtils";
import type { Task } from "../types";

const createTask = (status: Task["status"]): Task => ({
  id: "1",
  title: "테스트 태스크",
  status,
  priority: "medium",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  version: 1,
});

describe("rollbackTaskUpdate", () => {
  it("업데이트 실패 시, 이전 상태로 롤백한다", () => {
    const previousTasks = [createTask("todo")];
    const currentTasks = [createTask("done")];

    const result = rollbackTaskUpdate(currentTasks, previousTasks, "1");

    expect(result[0].status).toBe("todo");
  });
});
