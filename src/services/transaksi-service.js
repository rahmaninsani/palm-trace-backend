import { readFileSync } from 'fs';
import { Gateway, DefaultEventHandlerStrategies } from 'fabric-network';

import wallet from '../applications/wallet.js';
import util from '../utils/util.js';

import walletService from './wallet-service.js';

const submit = async (req) => {
  const { body: request, user } = req;

  const organizationName = util.getAttributeName(user.role).organizationName;
  const channelName = 'transaksi-channel';
  const chaincodeName = 'transaksi-chaincode';
  const transactionName = 'CreateAsset';
  const values = [
    'K0001',
    'D0001',
    'TRX0002',
    request.namaPks,
    request.namaKoperasi,
    request.namaPetani,
    request.hargaA,
    request.hargaB,
    request.tanggalA,
    request.tanggalB,
    request.status,
  ];

  // const userWallet = await wallet.get(user.email);

  const connectOptions = {
    wallet,
    identity: user.email,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: DefaultEventHandlerStrategies.NONE,
  };

  const gateway = new Gateway();
  const { connectionProfile } = walletService.getOrganizationInfo(organizationName);
  await gateway.connect(connectionProfile, connectOptions);

  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);

  const transaction = contract.createTransaction(transactionName);
  const payload = await transaction.submit(...values);

  gateway.disconnect();

  return {
    result: payload.toString(),
  };
};

export default { submit };
