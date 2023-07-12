import { readFileSync } from 'fs';
import { DefaultEventHandlerStrategies, DefaultQueryHandlerStrategies, Gateway } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';

import wallet from './wallet';

const { orgs } = JSON.parse(readFileSync('src/config/env.json', 'utf8'));

const createDefaultWallet = async () => {
  for (const [key, value] of Object.entries(orgs)) {
    const identity = {
      credentials: {
        certificate: value.certificate,
        privateKey: value.privateKey,
      },
      mspId: value.msp,
      type: 'X.509',
    };

    await wallet.put(value.email, identity);
  }

  return wallet;
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

const createCa = (organizationName) => {
  const { certificateAuthorities } = JSON.parse(orgs[organizationName].connectionProfile);
  const { url, caName } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];

  return new FabricCAServices(url, undefined, caName);
};

const registerUserToFabric = async (email, userOrganization) => {
  const ca = createCa(userOrganization);
  const wallet = await createFabricWallet(userOrganization);

  const userIdentity = await wallet.get(email);
  if (userIdentity) {
    console.log(`Identity for email ${email} already exists in the wallet.`);
    return false;
  }

  // build a user object for authenticating with the CA
  const adminIdentity = await wallet.get('admin');

  console.log('CHILD WALLET: ', wallet);

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, 'admin');

  // Register the user, enroll the user, and import the new identity into the wallet.
  const secret = await ca.register(
    {
      enrollmentID: email,
      role: 'client',
      affiliation: '', // not supported yet
    },
    adminUser
  );

  const enrollment = await ca.enroll({
    enrollmentID: email,
    enrollmentSecret: secret,
  });

  for (const [key, value] of Object.entries(orgs)) {
    if (key == userOrganization) {
      const identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: data.msp,
        type: 'X.509',
      };

      await req.app.locals.wallet.put(email, identity);
    }
  }

  console.log(`Successfully registered and enrolled admin user ${email} and imported it into the wallet`);
  console.log(req.app.locals.wallet);

  return true;
};

export { createDefaultWallet, getContract, registerUserToFabric };
