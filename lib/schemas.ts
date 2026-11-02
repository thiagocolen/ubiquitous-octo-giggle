import { z } from "zod";

export const PAGE_SIZE = 10;

// Shared by the form (client-side validation) and the tRPC procedures
// (server-side validation): one source of truth for the rules.
export const taskInput = z.object({
  titulo: z.string().trim().min(1, "O título é obrigatório.").max(100, "Máximo de 100 caracteres."),
  descricao: z.string().trim().max(500, "Máximo de 500 caracteres.").optional(),
});

export type TaskInput = z.infer<typeof taskInput>;