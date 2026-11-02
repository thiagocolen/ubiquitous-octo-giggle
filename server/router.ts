import "server-only";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PAGE_SIZE, taskInput } from "@/lib/schemas";
import { createTask, deleteTask, getTask, listTasks, updateTask } from "./store";
import { publicProcedure, router } from "./trpc";

const idInput = z.object({ id: z.string().min(1) });

// The store returns undefined/false; turning that into a TRPCError here keeps
// the data layer independent of the transport.
function notFound(id: string): never {
  throw new TRPCError({ code: "NOT_FOUND", message: `Tarefa "${id}" não encontrada.` });
}

const taskRouter = router({
  // `cursor` is the name tRPC looks for to enable infiniteQueryOptions on the client.
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(PAGE_SIZE),
        cursor: z.number().int().min(0).nullish(),
      }),
    )
    .query(({ input }) => listTasks(input.cursor ?? 0, input.limit)),

  byId: publicProcedure.input(idInput).query(({ input }) => getTask(input.id) ?? notFound(input.id)),

  create: publicProcedure.input(taskInput).mutation(({ input }) => createTask(input)),

  update: publicProcedure
    .input(taskInput.extend({ id: z.string().min(1) }))
    .mutation(({ input: { id, ...data } }) => updateTask(id, data) ?? notFound(id)),

  delete: publicProcedure.input(idInput).mutation(({ input }) => {
    if (!deleteTask(input.id)) notFound(input.id);
    return { id: input.id };
  }),
});

export const appRouter = router({ task: taskRouter });

// Only the *type* is shared with the client: no server code goes to the browser.
export type AppRouter = typeof appRouter;