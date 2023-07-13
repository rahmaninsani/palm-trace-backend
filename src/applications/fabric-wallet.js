import { readFileSync } from 'fs';
import { DefaultEventHandlerStrategies, DefaultQueryHandlerStrategies, Gateway } from 'fabric-network';

const { orgs } = JSON.parse(readFileSync('src/config/fabric-config.json', 'utf8'));

const createOrganizationAdminWallet = async () => {
  for (const [organizationName, value] of Object.entries(orgs)) {
    await enrollAdmin(organizationName, value.email, value.password);
  }
};

const createGateway = async (connectionProfile, identity, wallet) => {
  const gateway = new Gateway();

  const options = {
    wallet,
    identity,
    discovery: { enabled: true, asLocalhost: true },
    eventHandlerOptions: {
      commitTimeout: 300,
      endorseTimeout: 30,
      strategy: DefaultEventHandlerStrategies.PREFER_MSPID_SCOPE_ANYFORTX,
    },
    queryHandlerOptions: {
      timeout: 4,
      strategy: DefaultQueryHandlerStrategies.PREFER_MSPID_SCOPE_ROUND_ROBIN,
    },
  };

  await gateway.connect(connectionProfile, options);

  return gateway;
};

const getNetwork = async (gateway, channelName) => {
  const network = await gateway.getNetwork(channelName);
  return network;
};

const getContracts = async (network, chaincodeName) => {
  const contract = network.getContract(chaincodeName);
  const qsccContract = network.getContract('qscc');
  return { contract, qsccContract };
};

const getContract = async (wallet, organizationName, channelName, chaincodeName) => {
  for (const [key, value] of Object.entries(orgs)) {
    if (key == organizationName) {
      const connectionProfile = JSON.parse(value.connectionProfile);
      const MSPID = value.msp;
      const gateway = await createGateway(connectionProfile, MSPID, wallet);

      const network = await getNetwork(gateway, channelName);

      return (await getContracts(network, chaincodeName)).contract;
    }
  }

  throw Error('Organization not found');
};

export { getContract };
