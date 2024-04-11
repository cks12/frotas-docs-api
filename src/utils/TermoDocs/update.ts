import db from "../../db/db";
import { updateBlob } from "./blob";
import { SchemaTermoUpdate } from "./schema";

class UpdateTermo{
    async responsabilidade(d:any){
        const data = SchemaTermoUpdate.parse(d);
        const termo = await db.prisma.termo.findUniqueOrThrow({where: {id:data.id}})
        const buffer = Buffer.from(data.base64, 'base64');
        if(!termo.blob)
            throw "Termo não possui blob"
        console.log("> cheguei até aqui")
        await updateBlob(buffer, termo.blob);
        return await db.prisma.termo.update({
            where: {id:data.id},
            data:{isAssinado: data.isAssinado, status: data.isAssinado? "Ativo" :"Pendente"  }
        })
    }
}

export default UpdateTermo;