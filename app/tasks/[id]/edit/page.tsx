import { TRPCError } from "@trpc/server";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { caller } from "@/lib/trpc/server";

export default async function EditTaskPage({ params }: PageProps<"/tasks/[id]/edit">) {
  const { id } = await params;

  let task;
  
  try {
    task = await caller.task.byId({ id });
  } catch (err) {
    if (err instanceof TRPCError && err.code === "NOT_FOUND") notFound();
    throw err;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar tarefa</h1>
      <TaskForm task={task} />
    </div>
  );
}