import "server-only";
import { createCallerFactory } from "@/server/trpc";
import { appRouter } from "@/server/router";

export const caller = createCallerFactory(appRouter)({});