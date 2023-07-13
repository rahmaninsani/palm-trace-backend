import { readFileSync } from 'fs';
import { DefaultEventHandlerStrategies, DefaultQueryHandlerStrategies, Gateway } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';

import wallet from './wallet.js';

const { orgs } = JSON.parse(readFileSync('src/config/env.json', 'utf8'));

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

// Rifqi

const createCa = (organizationName) => {
  const { certificateAuthorities } = JSON.parse(orgs[organizationName].connectionProfile);
  const { url, caName } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];

  return new FabricCAServices(url, undefined, caName);
};

const getAdminEmail = (organizationName) => {
  for (const [key, value] of Object.entries(orgs)) {
    if (key == organizationName) {
      return value.email;
    }
  }
};

const getTlsCACerts = (organizationName) => {
  const { certificateAuthorities } = JSON.parse(orgs[organizationName].connectionProfile);
  const data = certificateAuthorities[Object.keys(certificateAuthorities)[0]];
  return data;
};

const enrollAdmin = async (organizationName, email, password) => {
  const { url, tlsCACerts, caName } = getTlsCACerts(organizationName);
  const ca = new FabricCAServices(url, { trustedRoots: tlsCACerts, verify: true }, caName);

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(email);
  if (identity) {
    console.log('An identity for the admin user "admin" already exists in the wallet');
    return;
  }

  // Enroll the admin user, and import the new identity into the wallet.
  const enrollment = await ca.enroll({
    enrollmentID: email,
    enrollmentSecret: password,
  });

  for (const [key, value] of Object.entries(orgs)) {
    if (key == organizationName) {
      const identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: value.msp,
        type: 'X.509',
      };
      await wallet.put(email, identity);
      console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
    }
  }
};

const registerUserToFabric = async (email, userOrganization) => {
  // Ccp done from env.json
  // CA URL done from env.json

  const ca = createCa(userOrganization);

  const userIdentity = await wallet.get(email);
  if (userIdentity) {
    console.log(`Identity for email ${email} already exists in the wallet.`);
    return false;
  }

  // Check if admin identity exists in the wallet
  const adminEmail = getAdminEmail(userOrganization);
  let adminIdentity = await wallet.get(adminEmail);

  if (!adminIdentity) {
    console.log('An identity for the admin user "admin" does not exist in the wallet');
    await enrollAdmin(userOrganization, adminEmail, 'adminpw');
    adminIdentity = await wallet.get(adminEmail);
    console.log('Admin Enrolled Successfully');
  }

  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
  const adminUser = await provider.getUserContext(adminIdentity, adminEmail);

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
        mspId: value.msp,
        type: 'X.509',
      };

      await wallet.put(email, identity);
    }
  }

  return true;
};

export { createOrganizationAdminWallet, getContract, registerUserToFabric };
