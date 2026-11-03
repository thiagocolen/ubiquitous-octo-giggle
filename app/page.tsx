import { connection } from "next/server";
import { TaskList } from "@/components/task-list";
import { PAGE_SIZE } from "@/lib/schemas";
import { caller } from "@/lib/trpc/server";

export default async function HomePage() {
  await connection();

  const firstPage = await caller.task.list({ limit: PAGE_SIZE });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tarefas</h1>
      <TaskList initialPage={firstPage} />
    </div>
  );
}