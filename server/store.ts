import "server-only";
import type { TaskInput } from "@/lib/schemas";

export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number; // Unix ms: serializes as plain JSON, no transformer needed
};

// Keep the array on globalThis so it survives dev hot reloads and is shared
// between the route handler and Server Component bundles.
const globalForStore = globalThis as unknown as { tasks?: Task[] };
const tasks: Task[] = (globalForStore.tasks ??= seed());

// Fictitious seed data with deterministic ids/dates, enough to demo infinite scroll.
function seed(): Task[] {
  const base = Date.UTC(2026, 0, 1);
  return Array.from({ length: 25 }, (_, i) => ({
    id: `seed-${i + 1}`,
    titulo: `Tarefa de exemplo ${i + 1}`,
    descricao: i % 3 === 0 ? undefined : `Descrição fictícia da tarefa ${i + 1}.`,
    dataCriacao: base + i * 60 * 60 * 1000,
  }));
}

export function listTasks(cursor: number, limit: number) {
  const sorted = [...tasks].sort((a, b) => b.dataCriacao - a.dataCriacao); // newest first
  const items = sorted.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < sorted.length ? cursor + limit : null;
  return { items, nextCursor };
}

export function createTask(input: TaskInput): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    titulo: input.titulo,
    descricao: input.descricao || undefined, // treat "" as "no description"
    dataCriacao: Date.now(),
  };
  tasks.push(task);
  return task;
}