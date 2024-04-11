import db from "../../db/db";
import { getBlob } from "./blob";
import { SchemaTermoGet } from "./schema";

class GetDocument{
    async termo(d: any){
        const data = SchemaTermoGet.parse(d);
        const termo = await db.prisma.termo.findFirstOrThrow({
            where: {
                id: data.id
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

export default GetDocument;