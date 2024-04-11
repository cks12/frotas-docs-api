import "dotenv";
import { v1 as uuidv1 } from 'uuid';
import db from "../../db/db";

async function createBlob(data: Buffer) {
    const blobName = 'doc-tesponsabilidade-' + uuidv1() + '.pdf';
    const blockBlobClient = db.carDocsContainerBlob.getBlockBlobClient(blobName);
    const s = await blockBlobClient.upload(data, data.length);
    if (s.errorCode !== undefined)
        throw s.errorCode;
    return `${blobName}`;
}

async function updateBlob(data: Buffer, blob: string) {
    const blockBlobClient = db.carDocsContainerBlob.getBlockBlobClient(blob);
    const s = await blockBlobClient.upload(data, data.length);
    if (s.errorCode !== undefined)
        throw s.errorCode;
    return `${blockBlobClient}`;
}

async function getBlob(blob: string) {
    const blockBlobClient = db.carDocsContainerBlob.getBlockBlobClient(blob);
    const s = await blockBlobClient.download();
    if (s.errorCode !== undefined)
        throw s.errorCode;
    return s.readableStreamBody;
}


export {createBlob, updateBlob, getBlob};