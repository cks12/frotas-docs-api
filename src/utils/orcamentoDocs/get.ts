import db from "../../db/db";
import { getDocById } from "./schema";


async function getBlob(blobName: string) {
    const blockBlobClient = db.solicitacaoBlob.getBlockBlobClient(blobName);
    const s = await blockBlobClient.download();
    if (s.errorCode !== undefined)
        throw s.errorCode;
    return s.readableStreamBody;
}

export async function getDoc(raw: getDocById){
    const query = getDocById.parse(raw);
    const doc = await db.prisma.orcamentoDoc.findUniqueOrThrow({
        where: {
            id: query.id
        },
        select: {
            blob: true,
        }
    });

    return getBlob(doc.blob)
}