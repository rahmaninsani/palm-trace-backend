import { Gateway, DefaultEventHandlerStrategies } from 'fabric-network';

import wallet from './wallet.js';
import util from '../utils/util.js';

const openTransactionConnection = async ({ userId, role, channelName, chaincodeName, chaincodeMethodName }) => {
  const { organizationName } = util.getAttributeName(role);
  const { connectionProfile } = await util.getOrganizationInfo(organizationName);
  const options = {
    wallet: wallet,
    identity: userId,
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

const submitTransaction = async ({ userId, role, channelName, chaincodeName, chaincodeMethodName }, payload) => {
  const transactionConnection = await openTransactionConnection({
    userId,
    role,
    channelName,
    chaincodeName,
    chaincodeMethodName,
  });

  let result;
  if (payload === undefined) {
    result = await transactionConnection.submit();
  } else if (Array.isArray(payload)) {
    result = await transactionConnection.submit(...payload);
  } else {
    result = await transactionConnection.submit(payload);
  }

  return result;
};

const evaluateTransaction = async ({ userId, role, channelName, chaincodeName, chaincodeMethodName }, payload) => {
  const transactionConnection = await openTransactionConnection({
    userId,
    role,
    channelName,
    chaincodeName,
    chaincodeMethodName,
  });

  let result;
  if (payload === undefined) {
    result = await transactionConnection.evaluate();
  } else if (Array.isArray(payload)) {
    result = await transactionConnection.evaluate(...payload);
  } else {
    result = await transactionConnection.evaluate(payload);
  }

  return result;
};

const fabricClient = { submitTransaction, evaluateTransaction };

export default fabricClient;
