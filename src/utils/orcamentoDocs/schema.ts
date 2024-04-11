import { z } from "zod";

export const upload = z.object({
    solicitacaoId: z.string(),
    base64: z.string(),
    ext: z.string(),
})

export const getDocById = z.object({
    id: z.string(),
});

export type getDocById = z.infer<typeof getDocById>

export type upload = z.infer<typeof upload>