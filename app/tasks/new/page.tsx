import { TaskForm } from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nova tarefa</h1>
      <TaskForm />
    </div>
  );
}