import { readFileSync } from 'fs';
import { Wallets } from 'fabric-network';

const createFabricWallet = async () => {
  const { orgs } = JSON.parse(readFileSync('src/config/env.json', 'utf8'));
  const wallet = await Wallets.newInMemoryWallet();

  for (const [key, value] of Object.entries(orgs)) {
    const identity = {
      credentials: {
        certificate: value.certificate,
        privateKey: value.privateKey,
      },
      mspId: value.msp,
      type: 'X.509',
    };

    await wallet.put(value.msp, identity);
  }

  return wallet;
};

export { createFabricWallet };
