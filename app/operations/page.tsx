"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { StaffSchedule } from "@/components/operations/staff-schedule";
import { TaskChecklist } from "@/components/operations/task-checklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, CheckSquare, Users, Plus } from "lucide-react";
import { tasks, staff } from "@/lib/mock-data";

export default function OperationsPage() {
  const [taskList, setTaskList] = useState(tasks);

  const toggleTask = (taskId: string) => {
    setTaskList((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedTasks = taskList.filter((t) => t.completed).length;
  const totalTasks = taskList.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <AppShell>
      <PageHeader title="Operaciones" description={today}>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva Tarea</span>
        </Button>
      </PageHeader>

      <div className="p-4 md:p-6 space-y-6">
        {/* Progress Overview */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <CheckSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedTasks}/{totalTasks}</p>
                  <p className="text-xs text-muted-foreground">Tareas del día</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success/10">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{progress}%</p>
                  <p className="text-xs text-muted-foreground">Completado</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{staff.length}</p>
                  <p className="text-xs text-muted-foreground">Personal hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium text-foreground">{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Tasks */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Tareas del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="apertura">
                  <TabsList className="mb-4">
                    <TabsTrigger value="apertura">Apertura</TabsTrigger>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="cierre">Cierre</TabsTrigger>
                  </TabsList>
                  <TabsContent value="apertura">
                    <TaskChecklist
                      tasks={taskList.filter((t) => t.category === "apertura")}
                      onToggle={toggleTask}
                    />
                  </TabsContent>
                  <TabsContent value="general">
                    <TaskChecklist
                      tasks={taskList.filter((t) => t.category === "general")}
                      onToggle={toggleTask}
                    />
                  </TabsContent>
                  <TabsContent value="cierre">
                    <TaskChecklist
                      tasks={taskList.filter((t) => t.category === "cierre")}
                      onToggle={toggleTask}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Staff Schedule */}
          <div>
            <StaffSchedule staff={staff} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
