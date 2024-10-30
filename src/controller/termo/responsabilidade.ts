import { Request, Response } from "express";
import CreateTermo from "../../utils/TermoDocs/create";
import UpdateTermo from "../../utils/TermoDocs/update";
import GetDocument from "../../utils/TermoDocs/get";

class TermoController {
    async create(req: Request, res: Response) {
        try {
            const createTermo = new CreateTermo();
            return await createTermo.responsabilidade(res, req.body)
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
    };

    async devolucao(req: Request, res: Response) {
        try {
            const createTermo = new CreateTermo();
            return await createTermo.devolucao(res, req.body)
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
    };

    async update(req: Request, res: Response) {
        try {
            const updateTermo = new UpdateTermo();
            const termo = await updateTermo.responsabilidade(req.body)
            return res.status(202).json(termo)
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
    }

    async get(req: Request, res: Response) {
        try {
            const getDocument = new GetDocument();
            const termo = await getDocument.termo(req.params)
            const { isDowload } = req.query
            if (Boolean(isDowload == "S")) {
                res.setHeader('Content-Disposition', 'attachment; filename=termo.pdf');
                res.setHeader('Content-Transfer-Encoding', 'binary');
            }else{
                res.setHeader('Content-Disposition', 'inline; filename=termo.pdf');
                res.setHeader('Content-Type', 'application/pdf');
            }
           
            termo?.pipe(res);
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
    }
    async getAll(req: Request, res: Response) {
        try {
            const getDocument = new GetDocument();
            const termos = await getDocument.getAllTermo()
            return res.status(202).json(termos)
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: err });
        }
    }

}

export default TermoController;