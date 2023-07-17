import { Gateway, DefaultEventHandlerStrategies } from 'fabric-network';

import wallet from './wallet.js';
import util from '../utils/util.js';

const openTransactionConnection = async ({ email, role, channelName, chaincodeName, chaincodeMethodName }) => {
  const { organizationName } = util.getAttributeName(role);
  const { connectionProfile } = await util.getOrganizationInfo(organizationName);
  const options = {
    wallet: wallet,
    identity: email,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: DefaultEventHandlerStrategies.NONE,
  };

  const gateway = new Gateway();
  await gateway.connect(connectionProfile, options);

  const network = await gateway.getNetwork(channelName);
  const contract = network.getContract(chaincodeName);
  const transaction = contract.createTransaction(chaincodeMethodName);

  return transaction;
};

const submitTransaction = async ({ email, role, channelName, chaincodeName, chaincodeMethodName }, payload) => {
  const transactionConnection = await openTransactionConnection({
    email,
    role,
    channelName,
    chaincodeName,
    chaincodeMethodName,
  });

  const payloadJSON = JSON.stringify(payload);
  const result = await transactionConnection.submit(payloadJSON);
  return result;
};

const evaluateTransaction = async ({ email, role, channelName, chaincodeName, chaincodeMethodName }, values) => {
  const transactionConnection = await openTransactionConnection({
    email,
    role,
    channelName,
    chaincodeName,
    chaincodeMethodName,
  });

  const payloadJSON = JSON.stringify(payload);
  const result = await transactionConnection.evaluate(payloadJSON);
  return result;
};

const fabricClient = { submitTransaction, evaluateTransaction };

export default fabricClient;
