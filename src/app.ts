import 'dotenv/config'
import express, {Application} from 'express';
import carRoute from './routes/car';
import termoRoute from './routes/termo';
import bodyParser from 'body-parser';
import {apiKeyMiddleware} from './middlewares/api-key';
import SolicitacaoRoutes from './routes/solicitacao';
import db from './db/db';
import * as swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger_output.json';
import status_router from "./routes/status";


class Server {
    app: Application
    db: db

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.db = new db();
    }

    config() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
        this.app.use(bodyParser.text({limit: '200mb'}));
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(apiKeyMiddleware)
    }

    routes() {
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))
        this.app.use("/car", carRoute);
        this.app.use("/solicitacao", SolicitacaoRoutes)
        this.app.use("/termo", termoRoute)
        this.app.use("/status", status_router)
    }

    async start() {
        await this.db.makeConnection();
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })
    }
}

const server = new Server();
server.start();