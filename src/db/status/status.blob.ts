import {sendNewPhoto} from "./status.schema";
import db from "../db";
import {v1 as uuidv1} from "uuid";

interface ICarSituacao {
    name: string,
    value: boolean,
}
class StatusBlob {

    async createBlob(data: Buffer, ext: string, type: string) {
        const blobName = 'status-' + type + uuidv1() + `.${ext}`;
        const blockBlobClient = db.statusBlob.getBlockBlobClient(blobName);
        const s = await blockBlobClient.upload(data, data.length);
        if (s.errorCode !== undefined)
            throw s.errorCode;
        return `${blobName}`;
    }

    async deleteImage(id: string){
        const blob = await db.prisma.statusPhoto.findUnique({
            where: {
                id: id,
            },
            select: {
                blob: true,
            }
        });

        if (!blob)
            throw "ERR: STATUS BLOB NOT FOUND";
        await db.statusBlob.getBlockBlobClient(blob.blob).delete();
        await db.prisma.statusPhoto.delete({
            where: {
                id: id,
            }
        })
    }
    
    async getLast(id: string) {
        const data =  await db.prisma.cAR_STATUS.findFirst({
            where: {
                AND: {
                    carroId:id,
                    is_recente: true,
                }

            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                statusPhoto: true,
                car_situacao: true,
            }
        });
        return data;

    }

    async upload(raw: sendNewPhoto) {
        const data = sendNewPhoto.parse(raw);
        const buffer = Buffer.from(data.base64, 'base64');
        const blobName = await this.createBlob(buffer, "jpg", data.tipo)
        return await db.prisma.statusPhoto.create({
            data: {
                blob: blobName,
                // @ts-ignore
                type: data.tipo,
                cAR_STATUSId: data.statusId,
                userId: data.userId,
                userName: data.userName,
            }
        });
    }

    async getBase64(id: string) {
        const blob = await db.prisma.statusPhoto.findUnique({
            where: {
                id: id,
            },
            select: {
                blob: true,
            }
        });

        if (!blob)
            throw "ERR: STATUS BLOB NOT FOUND";
        const base64 = await db.statusBlob.getBlockBlobClient(blob.blob).downloadToBuffer();
        return Buffer.from(base64).toString("base64");


    }
}

export default StatusBlob;