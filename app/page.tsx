import Link from "next/link";
import { connection } from "next/server";
import { TaskList } from "@/components/task-list";
import { PAGE_SIZE } from "@/lib/schemas";
import { caller } from "@/lib/trpc/server";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  await connection();

  const { status } = await searchParams;
  const firstPage = await caller.task.list({ limit: PAGE_SIZE });

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Link href="/tasks/new" className="rounded bg-blue-600 px-3 py-1.5 text-white">
          Nova tarefa
        </Link>
      </header>
      <TaskList initialPage={firstPage} status={typeof status === "string" ? status : undefined} />
    </div>
  );
}