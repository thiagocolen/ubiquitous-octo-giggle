import "server-only";
import { createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server/router";

// Lets Server Components call procedures directly (no HTTP), with the same validation.
export const caller = createCallerFactory(appRouter)({});