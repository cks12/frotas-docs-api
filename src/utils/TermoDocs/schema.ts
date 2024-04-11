import { z } from "zod";

export const ShcemaTermoSchema = z.object({
    tecnicoId: z.string(),
    carroId: z.string(),
    usuarioId: z.string()
})

export const SchemaTermoGet = z.object({
    id: z.string(),
})

export const SchemaTermoUpdate = z.object({
    id: z.string(),
    usuarioId: z.string(),
    isAssinado:z.boolean(),
    base64: z.string(),
})

export const SchemaTermoCreate = z.object({
    cpf: z.string(),
    nome: z.string(),
    cnh: z.string(),
    rg: z.string(),
    cnhCategoria: z.string(),
    cnhValidade: z.date().or(z.string()),
    carChassi: z.string(),
    carMarca: z.string(),
    carAno: z.string(),
    carModelo: z.string(),
    carCor: z.string(),
    carPlaca: z.string(),
    carPlacaTag: z.string(),
})

export type TermoCreate = z.infer<typeof SchemaTermoCreate>