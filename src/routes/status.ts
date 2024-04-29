import { Router } from 'express';
import StatusBlob from "../db/status/status.blob";
import StatusController from "../controller/car/status";

const status_router = Router();
const statusController = new StatusController();

status_router.post("/upload", (req, res) => statusController.uploadImage(req, res));
status_router.get("/getLast/:id", (req, res) => statusController.getLast(req, res));
status_router.get("/getImage/:id", (req, res) => statusController.getImage(req, res));
status_router.delete("/getImage/:id", (req, res) => statusController.getImage(req, res));

export default status_router;