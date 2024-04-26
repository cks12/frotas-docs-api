import {Router} from "express";
import SolicitacaoPhoto from "../controller/solicitacao/SolicitacaoPhoto";
import OrcamentoController from "../controller/orcamento/orcamentoDoc";

const SolicitacaoRoutes = Router();
const solicitacaoController = new SolicitacaoPhoto();
const orcamento = new OrcamentoController();

SolicitacaoRoutes.get("/list/:id", solicitacaoController.getBySolicitacaoId)
SolicitacaoRoutes.get("/:type/:id", solicitacaoController.getBase64ById);
// SolicitacaoRoutes.post("/upload", solicitacaoController.);
SolicitacaoRoutes.post("/orcamento/upload", orcamento.upload);
SolicitacaoRoutes.get("/orcamento/:id", orcamento.getById);

export default SolicitacaoRoutes;