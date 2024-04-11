import "dotenv"
import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.CONTAINER_NAME
if(!connectionString || !containerName) process.exit(0)

export const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
const containerCarClient = blobServiceClient.getContainerClient(containerName);
containerCarClient.createIfNotExists();

export const blobCarContainerClient = containerCarClient;

export const carContainerName = containerName;

export const carContainerUrl = containerCarClient.url;
