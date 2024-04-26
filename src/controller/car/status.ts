import {Request, Response} from "express";
import StatusBlob from "../../db/status/status.blob";

const statusBlob = new StatusBlob();

class StatusController {

    async getImage(req: Request, res: Response) {
        try {
            const status = await statusBlob.getBase64(req.params.id);
            res.status(200).json(status);
        } catch (err: any) {
            res.status(500).json({
                message: err.message
            })
        }
    }

    async getListByStatusId(req: Request, res: Response) {
        res.status(200).json({})
    }

    async getLast(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const status = await statusBlob.getLast(id);
            return res.status(200).json(status);
        } catch (err: any) {
            console.log(err);
            return res.status(500).json({
                message: err.message
            })
        }

    }

    async uploadImage(req: Request, res: Response) {
        try {
            const status = await statusBlob.upload(req.body);
            res.status(200).json(status);
        } catch (err: any) {
            res.status(500).json({
                message: err.message
            })
        }
    }

}

export default StatusController;