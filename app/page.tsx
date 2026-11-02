import { connection } from "next/server";
import { formatDate } from "@/lib/format";
import { PAGE_SIZE } from "@/lib/schemas";
import { caller } from "@/lib/trpc/server";

export default async function HomePage() {
  // The store is a synchronous in-memory read. Without this, Cache Components
  // would prerender the list at build time and serve stale data.
  await connection();

  const { items } = await caller.task.list({ limit: PAGE_SIZE });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tarefas</h1>
      {items.length === 0 && <p className="text-gray-500">Nenhuma tarefa cadastrada.</p>}
      <ul className="space-y-2">
        {items.map((task) => (
          <li key={task.id} className="rounded border p-3">
            <h2 className="font-semibold">{task.titulo}</h2>
            {task.descricao && <p className="text-sm text-gray-600">{task.descricao}</p>}
            <time className="text-xs text-gray-400">{formatDate(task.dataCriacao)}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}
