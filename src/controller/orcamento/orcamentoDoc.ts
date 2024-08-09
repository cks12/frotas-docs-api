import { Request, Response } from "express";
import { UploadOrcamento, listBySolicitacaoId } from "../../utils/orcamentoDocs/upload";
import { getDoc } from "../../utils/orcamentoDocs/get";

class OrcamentoController {
    async list(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if(!id)
                return res.status(400).json({ "ERROR": "ID_NOT_FOUND" });
            const response = await listBySolicitacaoId(id as string);
            return res.json(response)
        }
        catch (err) {
            return res.status(400).json({ "ERROR": err })
        }
    }
    async upload(req: Request, res: Response) {
        try {
            const response = await UploadOrcamento(req.body);
            return res.json(response)
        }
        catch (err) {
            return res.status(400).json({ "ERROR": err })
        }
    }
    async getById(req: Request, res: Response) {
        const id = req.params.id;
        if (!id)
        return res.status(400).json({ "ERROR": "ID_NOT_FOUND" });
    try {
            const response = await getDoc({id});
            return res.json(response)
        }
        catch (err) {
            return res.status(400).json({ "ERROR": err })
        }
    }
}

export default OrcamentoController;