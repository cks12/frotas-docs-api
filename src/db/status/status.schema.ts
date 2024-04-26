import {z} from "zod";
import {car_foto_tipo, PrismaClient} from "@prisma/client";

type acceptValues = "lado_direito" | "lado_esquerdo" | "traseira" | "frente" | "odometro"

export const sendNewPhoto = z.object({
    statusId: z.string(),
    tipo: z.string().refine((value):acceptValues => {
        const acepptValues:acceptValues[] = [
            car_foto_tipo.lado_direito,
            car_foto_tipo.lado_esquerdo,
            car_foto_tipo.traseira,
            car_foto_tipo.frente,
            car_foto_tipo.odometro,
        ]
        // @ts-ignore
        return acepptValues.includes(value);
    }),
    userName: z.string(),
    base64: z.string(),
    userId: z.string()
});

export type sendNewPhoto = z.infer<typeof sendNewPhoto>;