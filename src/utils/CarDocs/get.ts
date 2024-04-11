import db from "../../db/db";
import { getBlob } from "../TermoDocs/blob";

interface response {
    dataValidade: string;
    dataRegistro: string,
    blob: string,
    status: string,
    id: string,
    type: string,
}

class GetCarDocs {
    async getAll(carroId: string): Promise<response[]> {
        const response: response[] = []
        const crlv = db.prisma.cRLV_DOC.findMany({
            where: {
                carroId: carroId,
            },
            orderBy: {
                dataVencimento: "desc",
            }
        });
        const seguro = db.prisma.cERT_PAG_SEGURO_DOC.findMany({
            where: {
                carroId: carroId,
            },
            orderBy: {
                dataVencimento: "desc",
            }
        })

        const termo = await db.prisma.termo.findMany({
            where: {
                carroId: carroId,
            },
            orderBy: {
                createdAt: "desc",
            }
        })

        const promises = [crlv, seguro];
        const result = await Promise.all([...promises]);
        result[0].forEach(doc => {
            response.push({
                dataRegistro: toLocaleString(doc.createAt?.toISOString()) || "",
                dataValidade: doc.dataVencimento && toLocaleString(doc.dataVencimento?.toISOString()) || "",
                blob: doc.blob,
                id: doc.id,
                status: doc.status,
                type: "crlv"
            })
        })

        result[1].forEach(doc => {
            response.push({
                dataRegistro: doc.dataVencimento && toLocaleString(doc.createAt.toISOString()) || "",
                dataValidade: doc.dataVencimento && toLocaleString(doc.dataVencimento?.toISOString()) || "",
                blob: doc.blob,
                id: doc.id,
                status: doc.status,
                type: "seguro"
            })
        })

        termo.forEach(doc=> {
            response.push({
                dataRegistro: toLocaleString(doc.createdAt) || "",
                status: doc.status,
                blob: doc.blob || "",
                dataValidade: (doc.status == "Ativo" || doc.status == "Pendente") ? "-" : toLocaleString(doc.updateAt),
                type: "termo",
                id: doc.id
            })
        })

        return response
    }

    async download(id: string){
        const termo = await db.prisma.cRLV_DOC.findFirstOrThrow({
            where: {
                id: id
            },
            select: {
                blob: true,
            }
        })
        if(!termo.blob) throw "Blob not provied"
        const blob = await getBlob(termo.blob);
        return blob
    }

    async getAllTermo(){
        const termos = await db.prisma.termo.findMany({})
        return termos
    }

    
}


function toLocaleString(str: string | Date) {
    const date = new Date(str);
    return date.toLocaleDateString("pt-br", {
        year: "2-digit",
        day: "2-digit",
        month: "2-digit"
    })
}

export default GetCarDocs;