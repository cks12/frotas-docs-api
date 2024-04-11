import { z } from "zod";

export const CrlvDoc = z.object({
    dataPagamento: z.string(),
    dataVencimento: z.string(),
    base64: z.string(),
    valor: z.string(),
    carroId: z.string(),
})

export const SeguroComprovante = z.object({
    dataPagamento: z.date(),
    dataVencimento: z.date(),
    base64: z.string(),
    valor: z.number(),
    carroId: z.string(),
})