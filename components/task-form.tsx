"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { taskInput } from "@/lib/schemas";
import { useTRPC } from "@/lib/trpc/client";
import type { AppRouter } from "@/server/router";
import type { Task } from "@/server/store";

type FieldErrors = Partial<Record<"titulo" | "descricao", string[]>>;

export function TaskForm({ task }: { task?: Task }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [values, setValues] = useState({
    titulo: task?.titulo ?? "",
    descricao: task?.descricao ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSuccess(status: "created" | "updated") {
    // Mark the cached list stale so it refetches when the list page mounts.
    await queryClient.invalidateQueries(trpc.task.list.pathFilter());
    router.push(`/?status=${status}`);
  }

  function handleError(err: TRPCClientErrorLike<AppRouter>) {
    const zodError = err.data?.zodError;
    if (zodError) {
      setFieldErrors(zodError.fieldErrors);
      setFormError("Verifique os campos destacados.");
    } else {
      setFormError(err.message);
    }
  }

  const create = useMutation(
    trpc.task.create.mutationOptions({ onSuccess: () => handleSuccess("created"), onError: handleError }),
  );
  const update = useMutation(
    trpc.task.update.mutationOptions({ onSuccess: () => handleSuccess("updated"), onError: handleError }),
  );
  const isPending = create.isPending || update.isPending;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const parsed = taskInput.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(z.flattenError(parsed.error).fieldErrors);
      return;
    }
    setFieldErrors({});

    if (task) update.mutate({ id: task.id, ...parsed.data });
    else create.mutate(parsed.data);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <p role="alert" className="rounded bg-red-100 p-2 text-red-800">{formError}</p>}

      <div className="space-y-1">
        <label htmlFor="titulo" className="block font-medium">Título *</label>
        <input
          id="titulo"
          value={values.titulo}
          onChange={(e) => setValues((v) => ({ ...v, titulo: e.target.value }))}
          aria-invalid={!!fieldErrors.titulo}
          className="w-full rounded border p-2"
        />
        {fieldErrors.titulo && <p className="text-sm text-red-600">{fieldErrors.titulo[0]}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="descricao" className="block font-medium">Descrição</label>
        <textarea
          id="descricao"
          rows={4}
          value={values.descricao}
          onChange={(e) => setValues((v) => ({ ...v, descricao: e.target.value }))}
          aria-invalid={!!fieldErrors.descricao}
          className="w-full rounded border p-2"
        />
        {fieldErrors.descricao && <p className="text-sm text-red-600">{fieldErrors.descricao[0]}</p>}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
           {isPending ? "Salvando…" : task ? "Salvar alterações" : "Criar tarefa"}
        </button>
        <Link href="/" className="px-4 py-2">Cancelar</Link>
      </div>
    </form>
  );
}
