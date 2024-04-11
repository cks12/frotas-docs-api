import { z } from "zod";
import { response } from "express";
import db from "../../db/db";

interface Photo {
    id: string,
}

interface SolicitacaoPhotos {
    pnenus: Photo[],
    odometro: Photo | null,
    pecas: Photo[],
}

class SolicitacaoPhotos {
    async list(RawId: string): Promise<SolicitacaoPhotos> {
        const id = z.string().parse(RawId);
        const response = {} as SolicitacaoPhotos;

        const solicitcao = await db.prisma.solicitacoes.findUniqueOrThrow({
            where: {
                id
            },
            select: {
                carroId: true,
                SolicitacaoVsPneus: {
                    select: {
                        id: true,
                        pneu: {
                            select: {
                                photoId: true,
                            }
                        }
                    }
                }
            }
        });

        const odometro = await db.prisma.odometro.findFirst({
            where: {
                carroId: solicitcao.carroId
            }
        });

        response.odometro = odometro ? { id: odometro.id } : null;
        response.pnenus = solicitcao.SolicitacaoVsPneus.map(pneu => ({ id: pneu.pneu.photoId || "" }));
        return response;
    }

    async getBase64(RawId: string, rawType: string): Promise<string | null> {
        const id = z.string().parse(RawId);
        const type = z.string(
            {
                required_error: "TYPE_NOT_FOUND",
                invalid_type_error: "TYPE_NOT_FOUND"
            },

        ).refine(value => ["odometro", "pneus", "pecas"].includes(value), {
            message: "TYPE_NOT_VALID"
        }).parse(rawType);
        switch (type) {
            case "odometro":
                return this.getBase64Odometro(id);
            case "pneus":
                return this.getBase64Pneus(id);
            case "pecas":
                return this.getBase64Pecas(id)
            default: 
                return null;
        }
    }

    async getBase64Pecas(id: string): Promise<string | null> {
        const peca = await db.prisma.peca_photo.findFirst({
            where: {
                id: id
            }
        });
        if (!peca) throw "NOT_FOUND";
        const exists = await db.pecaBlob.getBlobClient(peca.blob).exists();
        if(!exists) throw "NOT_FOUND_IN_BLOB_SERVICE";
        const blob = await db.pecaBlob.getBlobClient(peca.blob).downloadToBuffer();
        return `data:image/png;base64,${blob.toString("base64")}`
    }

     async getBase64Pneus(id: string): Promise<string | null> {
        const pneu = await db.prisma.pneu_photo.findFirst({
            where: {
                id: id
            }
        });
        if (!pneu) throw "NOT_FOUND";
        const exists = await db.pneuBlobService.getBlobClient(pneu.blob).exists();
        if(!exists) throw "NOT_FOUND_IN_BLOB_SERVICE";
        const blob = await db.pneuBlobService.getBlobClient(pneu.blob).downloadToBuffer();
        return `data:image/png;base64,${blob.toString("base64")}`
    }

    async getBase64Odometro(id: string): Promise<string | null> {
        const odometro = await db.prisma.odometro.findFirst({
            where: {
                id
            },
        });
        if (!odometro) return null;
        console.log(odometro.blob);
        const exists = await db.odometroBlob.getBlobClient(odometro.blob).exists();
        if(!exists) throw "NOT_FOUND_IN_BLOB_SERVICE";
        const blob = await db.odometroBlob.getBlobClient(odometro.blob).downloadToBuffer();
        return `data:image/png;base64,${blob.toString("base64")}`
    }

}

export default SolicitacaoPhotos;