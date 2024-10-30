import { z } from "zod";

export const CrlvDoc = z.object({
    dataPagamento: z.string(),
    dataVencimento: z.string(),
    base64: z.string(),
    valor: z.string(),
    carroId: z.string(),
});

export const CarDocument = z.object({
    base64: z.string(),
    tipo: z.string(),
    userId: z.string(),
    userName: z.string(),
    carroId: z.string(),
})

export type CarDocument  = z.infer<typeof CarDocument>;

export const SeguroComprovante = z.object({
    dataPagamento: z.date(),
    dataVencimento: z.date(),
    base64: z.string(),
    valor: z.number(),
    carroId: z.string(),
})