import {Router} from 'express';
import TermoController from '../controller/termo/responsabilidade';

const termoDocController = new TermoController()

const termoRoute = Router();

termoRoute.post('/responsabilidade', termoDocController.create);
termoRoute.get("/responsabilidade/:id", termoDocController.get);
termoRoute.get('/responsabilidade', termoDocController.getAll);
termoRoute.put('/responsabilidade', termoDocController.update);

export default termoRoute;