"use client";

import Link from "next/link";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/lib/format";
import { PAGE_SIZE } from "@/lib/schemas";
import { useTRPC } from "@/lib/trpc/client";
import type { AppRouter } from "@/server/router";

type TaskPage = inferRouterOutputs<AppRouter>["task"]["list"];
type Message = { type: "success" | "error"; text: string };

const STATUS_MESSAGES: Record<string, string> = {
  created: "Tarefa criada com sucesso.",
  updated: "Tarefa atualizada com sucesso.",
};

export function TaskList({ initialPage, status }: { initialPage: TaskPage; status?: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(
    status && STATUS_MESSAGES[status] ? { type: "success", text: STATUS_MESSAGES[status] } : null,
  );

  useEffect(() => {
    if (status) router.replace("/", { scroll: false });
  }, [status, router]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.task.list.infiniteQueryOptions(
      { limit: PAGE_SIZE },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialPage], pageParams: [null] },
      },
    ),
  );

  const deleteTask = useMutation(
    trpc.task.delete.mutationOptions({
      onSuccess: () => {
        setMessage({ type: "success", text: "Tarefa excluída com sucesso." });
        return queryClient.invalidateQueries(trpc.task.list.pathFilter());
      },
      onError: (err) => setMessage({ type: "error", text: err.message }),
    }),
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const tasks = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-3">
      {message && (
        <p
          role="status"
          className={`rounded p-2 ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </p>
      )}
      {error && <p className="text-red-600">Erro ao carregar tarefas: {error.message}</p>}
      {tasks.length === 0 && <p className="text-gray-500">Nenhuma tarefa cadastrada.</p>}

      <ul className="space-y-2">
        {tasks.map((task) => {
          const isDeleting = deleteTask.isPending && deleteTask.variables?.id === task.id;
          return (
            <li key={task.id} className="rounded border p-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold">{task.titulo}</h2>
                  {task.descricao && <p className="text-sm text-gray-600">{task.descricao}</p>}
                  <time className="text-xs text-gray-400">{formatDate(task.dataCriacao)}</time>
                </div>
                <div className="flex shrink-0 gap-2 text-sm">
                  <Link
                    href={`/tasks/${task.id}/edit`}
                    className="text-blue-600"
                  >
                    Editar
                  </Link>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      if (confirm(`Excluir "${task.titulo}"?`)) deleteTask.mutate({ id: task.id });
                    }}
                    className="text-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? "Excluindo…" : "Excluir"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div ref={sentinelRef} />

      {isFetchingNextPage && <p className="text-center text-gray-500">Carregando mais…</p>}

      {!hasNextPage && tasks.length > 0 && (
        <p className="text-center text-xs text-gray-400">Fim da lista.</p>
      )}
    </div>
  );
}