import {Router} from 'express';
import CarDocController from '../controller/car/create';

const carDocController = new CarDocController()

const carRoute = Router();

carRoute.put('/crlv', carDocController.createCrlv);
carRoute.put('/doc', carDocController.createDoc);
carRoute.get('/doc/:id', carDocController.download);
carRoute.put('/seguro', carDocController.createSeguro);
carRoute.get("/docs/:id", carDocController.getList);
carRoute.get("/crlv/:id/download", carDocController.downloadCrlv)

export default carRoute;