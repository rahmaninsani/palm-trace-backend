import { readFileSync } from 'fs';
import { Gateway, DefaultEventHandlerStrategies } from 'fabric-network';

import wallet from '../applications/wallet.js';
import util from '../utils/util.js';

const { orgs } = JSON.parse(readFileSync('src/config/fabric-config.json', 'utf8'));

const submit = async (req) => {
  const { body: request, user } = req;

  const organizationName = util.getAttributeName(user.role).organizationName;
  const channelName = 'transaksi-channel';
  const chaincodeName = 'transaksi-chaincode';
  const transactionName = 'CreateAsset';
  const values = [
    'K0001',
    'D0001',
    'TRX0001',
    request.namaPks,
    request.namaKoperasi,
    request.namaPetani,
    request.hargaA,
    request.hargaB,
    request.tanggalA,
    request.tanggalB,
    request.status,
  ];
  const userWallet = await wallet.get(user.email);

  const connectOptions = {
    wallet: userWallet,
    identity: request.email,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: DefaultEventHandlerStrategies.NONE,
  };

  const gateway = new Gateway();
  const connectionProfile = JSON.parse(orgs[organizationName].connectionProfile);
  console.log(connectionProfile);
  await gateway.connect(connectionProfile, connectOptions);

  console.log(gateway);

  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);

  const transaction = contract.createTransaction(transactionName);
  const payload = await transaction.submit(...values);

  return JSON.parse(payload.toString());
};

export default { submit };
