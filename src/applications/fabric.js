import { Gateway, DefaultEventHandlerStrategies } from 'fabric-network';

import wallet from './wallet.js';
import util from '../utils/util.js';

const fabricTransaction = async ({ email, role, channelName, chaincodeName, chaincodeMethodName }) => {
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

export default fabricTransaction;
