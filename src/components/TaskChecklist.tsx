"use client";

import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import type { Task } from "@/lib/tasks";

export default function TaskChecklist({
  tasks,
  completed,
  onToggle,
  onAdd,
  onRemove,
}: {
  tasks: Task[];
  completed: string[];
  onToggle: (key: string) => void;
  onAdd?: (label: string) => void;
  onRemove?: (key: string) => void;
}) {
  const [newTask, setNewTask] = useState("");

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {tasks.map((task) => {
          const done = completed.includes(task.key);
          return (
            <div
              key={task.key}
              className="group flex items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-3 py-2.5 transition-colors hover:border-[#F7941D]/30"
            >
              <button
                type="button"
                onClick={() => onToggle(task.key)}
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-all ${
                  done
                    ? "border-[#F7941D] bg-[#F7941D] text-[#111111]"
                    : "border-[#D4D4D4] bg-white text-transparent hover:border-[#F7941D]"
                }`}
              >
                <Check className="h-4 w-4" />
              </button>
              <span
                className={`flex-1 text-sm font-medium ${
                  done ? "text-[#A3A3A3] line-through" : "text-[#111111]"
                }`}
              >
                {task.label}
              </span>
              {onRemove && tasks.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(task.key)}
                  className="text-[#D4D4D4] opacity-0 transition-opacity hover:text-[#111111] group-hover:opacity-100"
                  aria-label={`Remove ${task.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {onAdd && (
        <div className="flex items-center gap-2 pt-1">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTask.trim()) {
                onAdd(newTask.trim());
                setNewTask("");
              }
            }}
            placeholder="Add a custom task…"
            className="flex-1 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20"
          />
          <button
            type="button"
            onClick={() => {
              if (newTask.trim()) {
                onAdd(newTask.trim());
                setNewTask("");
              }
            }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#111111] text-white hover:bg-[#2E2E2E]"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
