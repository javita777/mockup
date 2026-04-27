"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type Task } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TaskChecklistProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
}

export function TaskChecklist({ tasks, onToggle }: TaskChecklistProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay tareas en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer",
            task.completed
              ? "bg-muted/50 border-muted"
              : "bg-card border-border hover:border-primary/50"
          )}
          onClick={() => onToggle(task.id)}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="flex-shrink-0"
          />
          <span
            className={cn(
              "text-sm transition-all",
              task.completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            )}
          >
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );
}
