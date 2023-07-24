import FabricCAServices from 'fabric-ca-client';

import prismaClient from '../applications/database.js';
import wallet from '../applications/wallet.js';
import util from '../utils/util.js';

const enrollAdmin = async (organizationName) => {
  const { email, password, msp, certificateAuthority } = await util.getOrganizationInfo(organizationName);
  const { id } = await prismaClient.akun.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  // Check if the admin is already enrolled
  const adminWallet = await wallet.get(id);
  if (adminWallet) {
    console.log(`${email} already exists in the ${organizationName} admin wallet`);
    return false;
  }

  // If admin not enrolled, enroll the admin user
  const { url, caName, httpOptions, tlsCACerts } = certificateAuthority;
  const ca = new FabricCAServices(url, { trustedRoots: tlsCACerts.pem, verify: httpOptions.verify }, caName);

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

  await wallet.put(id, identity);
  console.log(`Successfully enrolled ${email} of ${organizationName} admin and imported it into the wallet`);
};

const registerEnrollUser = async (userId, affiliationName, organizationName) => {
  const userWallet = await wallet.get(userId);
  if (userWallet) {
    console.log(`${userId} already exists in the ${organizationName} user wallet`);
    return false;
  }

  const { email: adminEmail, msp, certificateAuthority } = await util.getOrganizationInfo(organizationName);
  const { id: adminId } = await prismaClient.akun.findUnique({
    where: {
      email: adminEmail,
    },
    select: {
      id: true,
    },
  });

  // Check if admin identity exists in the wallet
  let adminWallet = await wallet.get(adminId);
  if (!adminWallet) {
    await enrollAdmin(organizationName);
    adminWallet = await wallet.get(adminId);
  }

  const { url, caName, httpOptions, tlsCACerts } = certificateAuthority;
  const ca = new FabricCAServices(url, { trustedRoots: tlsCACerts.pem, verify: httpOptions.verify }, caName);
  const provider = wallet.getProviderRegistry().getProvider(adminWallet.type);
  const adminUser = await provider.getUserContext(adminWallet, adminId);

  // Register user
  const secret = await ca.register(
    {
      enrollmentID: userId,
      role: 'client',
      affiliation: affiliationName,
    },
    adminUser
  );

  // Enroll user
  const enrollment = await ca.enroll({
    enrollmentID: userId,
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

  await wallet.put(userId, identity);
  console.log(`Successfully registered and enrolled ${userId} of ${organizationName} user and imported it into the wallet`);
};

const enrollAllAdmin = async () => {
  const fabricConfig = await util.readFile('src/config/fabric-config.json');
  const { orgs } = JSON.parse(fabricConfig);

  Object.keys(orgs).map(async (organizationName) => {
    await enrollAdmin(organizationName);
  });
};

const walletService = { registerEnrollUser, enrollAllAdmin };
export default walletService;
