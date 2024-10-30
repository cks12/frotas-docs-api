import "dotenv";
import { CarDocument, CrlvDoc, SeguroComprovante } from "./schema"
import { v1 as uuidv1 } from 'uuid';
import { blobCarContainerClient } from "../../db/car/car.blob";
import db from "../../db/db";

class CreateDocsCar {

    async downloadDoc(id: string){
        const document = await db.prisma.carDocumentos.findFirstOrThrow(
            {
                where: {
                    id: id
                }
            }
        );
        const blockBlobClient = blobCarContainerClient.getBlockBlobClient(document.blob);
        const s = await blockBlobClient.download();
        if (s.errorCode !== undefined)
            throw s.errorCode;
        return s.readableStreamBody;
        
    }
    async createDoc(data: CarDocument){
        const documentInformations = CarDocument.parse(data);
        const blobName = uuidv1() + '.pdf';
        const blockBlobClient = blobCarContainerClient.getBlockBlobClient(blobName);
        const pdf = Buffer.from(documentInformations.base64, 'base64');
        const s = await blockBlobClient.upload(pdf, pdf.length);
        if (s.errorCode !== undefined)
            throw s.errorCode;
        await db.prisma.carDocumentos.create(
            {
                data: {
                    blob: blobName,
                    documentoTipo: documentInformations.tipo,
                    carroId: documentInformations.carroId,
                    createBy: documentInformations.userName || null,
                    creatorId: documentInformations.userId || null, 
                }
            }
        );
    }

    async createCRLV(data: any) {
        const documentInformations = CrlvDoc.parse(data);
        const blobName = 'doc-crlv-car-' + uuidv1() + '.pdf';
        const blockBlobClient = blobCarContainerClient.getBlockBlobClient(blobName);
        const pdf = Buffer.from(documentInformations.base64, 'base64');
        const s = await blockBlobClient.upload(pdf, pdf.length);
        if (s.errorCode !== undefined)
            throw s.errorCode;

        await db.prisma.cRLV_DOC.updateMany({
            where: {
                AND: {
                    carroId: documentInformations.carroId,
                    status: "Recente",
                }
            },
            data: {
                status: "Substituido"
            }
        })
        
        const crlv = await db.prisma.cRLV_DOC.create({
            data: {
                blob: blobName,
                dataPagamento: new Date(documentInformations.dataPagamento),
                dataVencimento: new Date(documentInformations.dataVencimento),
                carroId: documentInformations.carroId,
                valor: Number(documentInformations.valor),
            }
        })

        return crlv;
    }

    async createSeguro(d: any) {
        const documentInformations = SeguroComprovante.parse(d);
        const blobName = 'doc-seguro-car-' + uuidv1() + '.pdf';
        const blockBlobClient = blobCarContainerClient.getBlockBlobClient(blobName);
        const pdf = Buffer.from(documentInformations.base64, 'base64');
        const s = await blockBlobClient.upload(pdf, pdf.length);
        if (s.errorCode !== undefined)
            throw s.errorCode;
        await db.prisma.cERT_PAG_SEGURO_DOC.updateMany({
            where: {
                AND: {
                    carroId: documentInformations.carroId,
                    status: "Recente",
                }
            },
            data: {
                status: "Substituido"
            }
        })

        const crlv = await db.prisma.cERT_PAG_SEGURO_DOC.create({
            data: {
                blob: blobName,
                dataPagamento: documentInformations.dataPagamento,
                dataVencimento: documentInformations.dataVencimento,
                carroId: documentInformations.carroId,
                valor: Number(documentInformations.valor),
            }
        })

        return crlv;
    }
}

export default CreateDocsCar