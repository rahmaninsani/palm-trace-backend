import dotenv from 'dotenv';
import { Web3Storage } from 'web3.storage';

dotenv.config();

const WEB3STORAGE_TOKEN = process.env.WEB3STORAGE_TOKEN;

if (!WEB3STORAGE_TOKEN) {
  throw new Error('Missing WEB3STORAGE_TOKEN');
}

const web3StorageClient = new Web3Storage({ token: WEB3STORAGE_TOKEN });

export default web3StorageClient;
