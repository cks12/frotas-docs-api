import {Request, Response} from "express"
import CreateDocsCar from "../../utils/CarDocs/create";
import GetCarDocs from "../../utils/CarDocs/get";

class CarDocController {

    async createCrlv(req: Request, res: Response) {
        const data = req.body;
        const docs = new CreateDocsCar();
        try {
            const crlv = await docs.createCRLV(data);
            return res.status(200).json({crlv})
        } catch (err) {
            return res.status(400).json({error: err})
        }
    }

    async downloadCrlv(req: Request, res: Response) {
        const {id} = req.params;
        const docs = new GetCarDocs();
        try {
            const crlv = await docs.download(id);
            res.setHeader('Content-Disposition', 'inline; filename=termo.pdf');
            res.setHeader('Content-Type', 'application/pdf');
            return crlv?.pipe(res)
        } catch (err) {
            return res.status(400).json({error: err})
        }
    }

    async createSeguro(req: Request, res: Response) {
        const data = req.body;
        const docs = new CreateDocsCar();
        try {
            docs.createSeguro(data)
        } catch (err) {
            return res.status(400).json({error: err})
        }
    }

    async getList(req: Request, res: Response) {
        const {id} = req.params;
        const docs = new GetCarDocs();
        try {
            const list = await docs.getAll(id);
            return res.status(200).send(list);
        } catch (err) {
            return res.status(400).json({error: err})
        }
    }

}

export default CarDocController;