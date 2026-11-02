import "server-only";
import { z } from "zod";
import { PAGE_SIZE, taskInput } from "@/lib/schemas";
import { createTask, listTasks } from "./store";
import { publicProcedure, router } from "./trpc";

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
  create: publicProcedure
    .input(taskInput).mutation(({ input }) => createTask(input)),
});

export const appRouter = router({ task: taskRouter });

// Only the *type* is shared with the client: no server code goes to the browser.
export type AppRouter = typeof appRouter;
