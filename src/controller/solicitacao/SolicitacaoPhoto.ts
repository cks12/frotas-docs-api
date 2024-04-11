import { Request, Response } from "express";
import SolicitacaoPhotos from "../../utils/SolicitacaoPhotos/get";

const solicitacaoPhotos = new SolicitacaoPhotos();

class SolicitacaoPhoto {
    async getBySolicitacaoId(req: Request, res: Response) {
        const id = req.params.id;
        if (!id)
            return res.status(400).json({ "ERROR": "ID_NOT_FOUND" });
        try {
            const solicitacao = await solicitacaoPhotos.list(id)
            return res.json(solicitacao)
        }
        catch (err) {
            return res.status(400).json({ "ERROR": err })
        }
    }

    async getBase64ById(req: Request, res: Response) {
        const id = req.params.id;
        const type = req.params.type
        if (!id)
            return res.status(400).json({ "ERROR": "ID_NOT_FOUND" });

        if (!type)
            return res.status(400).json({ "ERROR": "TYPE_NOT_FOUND" });

        try {
            const solicitacao = await solicitacaoPhotos.getBase64(id, type)
            return res.json(solicitacao)
        }
        catch (err) {
            return res.status(400).json({ "ERROR": err })
        }
    }
}

export default SolicitacaoPhoto;