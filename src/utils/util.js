import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const readFile = async (pathFilename) => {
  try {
    const result = await fs.readFile(pathFilename, 'utf8');
    return result;
  } catch (error) {
    console.error(error);
  }
};

const getAttributeName = (type) => {
  type = type.toLowerCase();

  if (type === 'dinas') {
    return {
      roleName: 'dinas',
      tableName: 'dinas',
      databaseRoleName: 'DINAS',
      organizationName: 'Dinas',
      affiliationName: 'dinas.user',
    };
  }

  if (type === 'pabrikkelapasawit' || type === 'pabrik_kelapa_sawit' || type === 'pks') {
    return {
      roleName: 'pks',
      tableName: 'pabrikKelapaSawit',
      databaseRoleName: 'PABRIK_KELAPA_SAWIT',
      organizationName: 'PabrikKelapaSawit',
      affiliationName: 'pabrikkelapasawit.user',
    };
  }

  if (type === 'koperasi') {
    return {
      roleName: 'koperasi',
      tableName: 'koperasi',
      databaseRoleName: 'KOPERASI',
      organizationName: 'Koperasi',
      affiliationName: 'koperasi.user',
    };
  }

  if (type === 'petani') {
    return {
      roleName: 'petani',
      tableName: 'petani',
      databaseRoleName: 'PETANI',
      organizationName: 'Petani',
      affiliationName: 'petani.user',
    };
  }

  throw new Error('Invalid type');
};

const getOrganizationInfo = async (organizationName) => {
  const fabricConfig = await readFile('src/config/fabric-config.json');
  const { email, password, msp, connectionProfile } = JSON.parse(fabricConfig).orgs[organizationName];
  const { certificateAuthorities } = connectionProfile;
  const { url, caName, httpOptions, tlsCACerts } = certificateAuthorities[Object.keys(certificateAuthorities)[0]];

  return {
    email,
    password,
    msp,
    certificateAuthority: {
      url,
      caName,
      httpOptions,
      tlsCACerts,
    },
    connectionProfile,
  };
};

const generateFileName = (file) => {
  const { fieldName, originalName } = file;
  const random = uuidv4();
  const extension = originalName.split('.').pop();
  const fileName = `${fieldName}_${random}.${extension}`;
  return fileName;
};

const util = { readFile, getAttributeName, getOrganizationInfo, generateFileName };
export default util;
