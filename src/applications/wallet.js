import { Wallet } from 'fabric-network';
import prismaClient from './database.js';

class WalletStore {
  constructor() {}

  async get(label) {
    const user = await prismaClient.akun.findUnique({
      where: {
        id: label,
      },
      select: {
        wallet: true,
      },
    });

    if (!user) {
      console.error('User not found');
      return null;
    }

    return user.wallet;
  }

  async list() {
    const wallets = await prismaClient.akun.findMany({
      select: {
        wallet: true,
      },
    });

    return wallets;
  }

  async put(label, data) {
    await prismaClient.akun.update({
      where: {
        id: label,
      },
      data: {
        wallet: data.toString('utf8'),
      },
    });
  }

  async remove(label) {
    await prismaClient.akun.update({
      where: {
        id: label,
      },
      data: {
        wallet: null,
      },
    });
  }
}

const store = new WalletStore();
const wallet = new Wallet(store);

export default wallet;
