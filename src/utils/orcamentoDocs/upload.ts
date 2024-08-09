import db from "../../db/db";
import { upload } from "./schema";
import "dotenv";
import { v1 as uuidv1 } from 'uuid';

async function createBlob(data: Buffer, ext: string) {
    const blobName = 'doc-orçamento-' + uuidv1() + `.${ext}`;
    const blockBlobClient = db.solicitacaoBlob.getBlockBlobClient(blobName);
    const s = await blockBlobClient.upload(data, data.length);
    if (s.errorCode !== undefined)
        throw s.errorCode;
    return `${blobName}`;
}

export async function UploadOrcamento(raw: upload){
    const query = upload.parse(raw);
    const buffer = Buffer.from(query.base64, 'base64');
    const blob = await createBlob(buffer, query.ext);
    const doc = await db.prisma.orcamentoVsDoc.create({
        data: {
            blob: blob,
            SolicitacaoId: query.solicitacaoId,
        }
    });

    return doc;
} 

export async function listBySolicitacaoId(id: string){
    const docs = await db.prisma.orcamentoVsDoc.findMany({
        where: {
            SolicitacaoId: id
        }
    });
    return docs;
}