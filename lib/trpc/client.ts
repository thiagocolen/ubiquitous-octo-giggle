import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/server/router";

// Import this only from client components.
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();