import {DefaultAzureCredential} from "@azure/identity";
import {SecretClient} from "@azure/keyvault-secrets";
import {BlobServiceClient, ContainerClient} from "@azure/storage-blob";
import {Prisma, PrismaClient} from "@prisma/client";

const keyVaultName = process.env["KEY_VAULT_NAME"];
const credential = new DefaultAzureCredential();

class db {
    static prisma: PrismaClient;
    environment: string;
    static KEY_VAULT_URL = "https://" + keyVaultName + ".vault.azure.net";
    static keyVaultClient = new SecretClient(db.KEY_VAULT_URL, credential);
    static blobService: BlobServiceClient;
    static pneuBlobService: ContainerClient;
    static odometroBlob: ContainerClient;
    static pecaBlob: ContainerClient;
    static solicitacaoBlob: ContainerClient;
    static statusBlob: ContainerClient;
    static carDocsContainerBlob: ContainerClient;
    static solicaoBlob: ContainerClient;

    constructor() {
        this.environment = "dev";
        if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");
    }

    async makeConnection() {
        const secret = await db.keyVaultClient.getSecret(`url-mongo-${this.environment}`);
        db.prisma = new PrismaClient({datasources: {db: {url: secret.value}}});
        const pecasFotosName = await db.keyVaultClient.getSecret(`pecasFotosName`);
        const blobServiceName = await db.keyVaultClient.getSecret(`blob`);
        const pneuFotoName = await db.keyVaultClient.getSecret(`pneuFotoName`);
        const odometroFotoName = await db.keyVaultClient.getSecret(`odometroFotoName`);
        const solicitacaoDocName = await db.keyVaultClient.getSecret(`solicitacaoDocName`);
        const statusFotoName = await db.keyVaultClient.getSecret(`statusFotoName`);
        

        db.blobService = BlobServiceClient.fromConnectionString(blobServiceName.value || "");
        if (!pneuFotoName.value || !odometroFotoName.value || !pecasFotosName.value || !blobServiceName.value || !solicitacaoDocName.value || !statusFotoName.value)
            throw "Err";

        db.carDocsContainerBlob = db.blobService.getContainerClient("car-docs");
        db.pecaBlob = db.blobService.getContainerClient(pecasFotosName.value);
        db.odometroBlob = db.blobService.getContainerClient(odometroFotoName.value);
        db.pneuBlobService = db.blobService.getContainerClient(pneuFotoName.value);
        db.solicitacaoBlob = db.blobService.getContainerClient(solicitacaoDocName.value);
        db.statusBlob = db.blobService.getContainerClient(statusFotoName.value);
        db.solicaoBlob = db.blobService.getContainerClient("solicitacao-blob");


        await db.pneuBlobService.createIfNotExists();
        await db.odometroBlob.createIfNotExists();
        await db.carDocsContainerBlob.createIfNotExists();
        await db.solicitacaoBlob.createIfNotExists();
        await db.pecaBlob.createIfNotExists();
        await db.statusBlob.createIfNotExists();
        await db.solicaoBlob.createIfNotExists();
    }
}

export default db;