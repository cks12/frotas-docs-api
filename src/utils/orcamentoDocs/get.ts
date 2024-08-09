import db from "../../db/db";
import { getDocById } from "./schema";
import { Buffer } from 'buffer';

async function getBlob(blobName: string): Promise<string> {
    const blockBlobClient = db.solicitacaoBlob.getBlockBlobClient(blobName);
    const response = await blockBlobClient.download();
    
    if (response.errorCode !== undefined) {
        throw new Error(response.errorCode);
    }

    const readableStream = response.readableStreamBody;

    if(!readableStream) throw new Error("BLOB_NOT_FOUND");
    
    const chunks: Buffer[] = [];
    for await (const chunk of readableStream) {
        chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);
    return buffer.toString('base64');
}


export async function getDoc(raw: getDocById){
    const query = getDocById.parse(raw);
    const doc = await db.prisma.orcamentoVsDoc.findUniqueOrThrow({
        where: {
            id: query.id
        },
        select: {
            blob: true,
        }
    });

    return getBlob(doc.blob)
}