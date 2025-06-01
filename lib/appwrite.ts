import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '') // Your Appwrite Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ''); // Your project ID

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);

export { client, account, databases, storage, avatars };
