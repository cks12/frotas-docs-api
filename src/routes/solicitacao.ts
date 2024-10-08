import { Router } from "express";
import SolicitacaoPhoto from "../controller/solicitacao/SolicitacaoPhoto";
import OrcamentoController from "../controller/orcamento/orcamentoDoc";

const SolicitacaoRoutes = Router();
const solicitacaoController = new SolicitacaoPhoto();
const orcamento = new OrcamentoController();

SolicitacaoRoutes.get("/list/:id", solicitacaoController.getBySolicitacaoId)
// SolicitacaoRoutes.post("/upload", solicitacaoController.);
SolicitacaoRoutes.post("/documento/upload", (req, res) => orcamento.upload(req, res));
SolicitacaoRoutes.get("/orcamento/:id", orcamento.getById);
// SolicitacaoRoutes.put("/:id/add/docs")
SolicitacaoRoutes.get("/orcamento/list/:id", orcamento.list);
SolicitacaoRoutes.get("/download/:id", orcamento.download);
SolicitacaoRoutes.get("/:type/:id", solicitacaoController.getBase64ById);

export default SolicitacaoRoutes;