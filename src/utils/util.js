const getAttributeName = (type) => {
  type = type.toLowerCase();

  if (type === 'dinas') {
    return {
      roleName: 'dinas',
      tableName: 'dinas',
      databaseRoleName: 'DINAS',
      organizationName: 'Dinas',
    };
  }

  if (type === 'pabrikkelapasawit' || type === 'pabrik_kelapa_sawit' || type === 'pks') {
    return {
      roleName: 'pks',
      tableName: 'pabrikKelapaSawit',
      databaseRoleName: 'PABRIK_KELAPA_SAWIT',
      organizationName: 'PabrikKelapaSawit',
    };
  }

  if (type === 'koperasi') {
    return {
      roleName: 'koperasi',
      tableName: 'koperasi',
      databaseRoleName: 'KOPERASI',
      organizationName: 'Koperasi',
    };
  }

  if (type === 'petani') {
    return {
      roleName: 'petani',
      tableName: 'petani',
      databaseRoleName: 'PETANI',
      organizationName: 'Petani',
    };
  }

  throw new Error('Invalid type');
};

export default { getAttributeName };
