import "dotenv"
import express, { Request, Response, NextFunction } from 'express';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient, KeyVaultSecret } from '@azure/keyvault-secrets';

const keyVaultName = process.env.KEY_VAULT_NAME;

const credential = new DefaultAzureCredential();
const vaultUrl = `https://${keyVaultName}.vault.azure.net`;
const apiSecretName = process.env.API_KEY_NAME || "";
export const secretClient = new SecretClient(vaultUrl, credential);

export const apiKeyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;
    try {
        if (!apiKey) {
            return res.status(401).json({ error: 'API key não fornecida' });
        }
        const secret = await secretClient.getSecret(apiSecretName);
        if (apiKey === secret.value) {
            return next();
        } else {
            res.status(401).json({ error: 'Acesso não autorizado' });
        }
    } catch (error: any) {
        console.error('Erro ao verificar a API key:', error);
        res.status(500).json({ error: 'Erro interno do servidor', cause: error });
    }
    // next()
}