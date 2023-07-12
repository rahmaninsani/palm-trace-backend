import { getContract } from '../applications/fabric-wallet.js';
import { submitTransaction } from '../applications/fabric.js';

const submit = async (request) => {
  const { organizationName, channelName, chaincodeName, transactionName, values, wallet } = request;
  const contract = await getContract(wallet, organizationName, channelName, chaincodeName);
  const data = await submitTransaction(contract, transactionName, values);
  let assets = [];
  if (data.length > 0) {
    assets = JSON.parse(data.toString());
  }
  return assets;
};

export default { submit };
