import { readFileSync } from 'fs';
import FabricCAServices from 'fabric-ca-client';

import wallet from '../applications/wallet.js';

const { orgs } = JSON.parse(readFileSync('src/config/fabric-config.json', 'utf8'));

const getOrganizationInfo = (organizationName) => {
  const { email, password, msp, connectionProfile, certificate, privateKey } = orgs[organizationName];
  const { certificateAuthorities } = JSON.parse(connectionProfile);
  const { url, caName, httpOptions, tlsCACerts } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];

  return {
    email,
    password,
    msp,
    connectionProfile: {
      certificateAuthority: {
        url,
        caName,
        httpOptions,
        tlsCACerts,
      },
    },
    certificate,
    privateKey,
  };
};

const enrollAdmin = async (organizationName) => {
  const { email, password, msp, connectionProfile } = getOrganizationInfo(organizationName);

  // Check if the admin is already enrolled
  const adminWallet = await wallet.get(email);
  if (adminWallet) {
    console.log(`${email} already exists in the ${organizationName} admin wallet`);
    return false;
  }

  // If admin not enrolled, enroll the admin user
  const { url, caName, httpOptions, tlsCACerts } = connectionProfile.certificateAuthority;
  const ca = new FabricCAServices(url, { trustedRoots: tlsCACerts, verify: httpOptions.verify }, caName);

  // Enroll admin
  const enrollment = await ca.enroll({
    enrollmentID: email,
    enrollmentSecret: password,
  });

  // Import admin identity into the wallet
  const identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: msp,
    type: 'X.509',
  };

  await wallet.put(email, identity);
  console.log(`Successfully enrolled ${email} of ${organizationName} admin and imported it into the wallet`);
};

const registerEnrollUser = async (email, organizationName) => {
  const { email: adminEmail, msp, connectionProfile } = getOrganizationInfo(organizationName);

  const userWallet = await wallet.get(email);
  if (userWallet) {
    console.log(`${email} already exists in the ${organizationName} user wallet`);
    return false;
  }

  // Check if admin identity exists in the wallet
  let adminWallet = await wallet.get(adminEmail);
  if (!adminWallet) {
    await enrollAdmin(organizationName);
    adminWallet = await wallet.get(adminEmail);
  }

  const { url, caName, httpOptions, tlsCACerts } = connectionProfile.certificateAuthority;
  const ca = new FabricCAServices(url, { trustedRoots: tlsCACerts, verify: httpOptions.verify }, caName);
  const provider = wallet.getProviderRegistry().getProvider(adminWallet.type);
  const adminUser = await provider.getUserContext(adminWallet, adminEmail);

  // Register user
  const secret = await ca.register(
    {
      enrollmentID: email,
      role: 'client',
      affiliation: '',
    },
    adminUser
  );

  // Enroll user
  const enrollment = await ca.enroll({
    enrollmentID: email,
    enrollmentSecret: secret,
  });

  // Import user identity into the wallet
  const identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: msp,
    type: 'X.509',
  };

  await wallet.put(email, identity);
  console.log(`Successfully registered and enrolled ${email} of ${organizationName} user and imported it into the wallet`);
};

const enrollAllAdmin = async () => {
  Object.keys(orgs).map(async (organizationName) => {
    await enrollAdmin(organizationName);
  });
};

export default { registerEnrollUser, enrollAllAdmin, getOrganizationInfo };
