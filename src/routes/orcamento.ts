import { Router } from "express";
import SolicitacaoPhoto from "../controller/solicitacao/SolicitacaoPhoto";

const SolicitacaoRoutes = Router();
const solicitacaoController = new SolicitacaoPhoto(); 

// SolicitacaoRoutes.get("/list/:id", solicitacaoController.getBySolicitacaoId)
// SolicitacaoRoutes.get("/:type/:id", solicitacaoController.getBase64ById)

export default SolicitacaoRoutes;