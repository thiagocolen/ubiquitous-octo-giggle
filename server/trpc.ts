import "server-only";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create({
  // Expose field-level validation errors so the form can show them next to each input.
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof z.ZodError ? z.flattenError(error.cause) : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;