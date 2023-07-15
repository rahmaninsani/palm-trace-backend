import argon2 from 'argon2';
import prismaClient from '../src/applications/database.js';
import walletService from '../src/services/wallet-service.js';
import util from '../src/utils/util.js';

const main = async () => {
  try {
    // Insert admin data to database for each organization
    await prismaClient.akun.upsert({
      where: { email: 'dinas.admin@palmsafe.com' },
      update: {},
      create: {
        email: 'dinas.admin@palmsafe.com',
        password: await argon2.hash('Dinas@Palmsafe2023'),
        role: util.getAttributeName('dinas').databaseRoleName,
        [util.getAttributeName('dinas').tableName]: {
          create: {
            nama: 'Dinas Admin',
            alamat: 'Bandung',
            nomorTelepon: '081234567890',
          },
        },
      },
    });

    await prismaClient.akun.upsert({
      where: { email: 'pks.admin@palmsafe.com' },
      update: {},
      create: {
        email: 'pks.admin@palmsafe.com',
        password: await argon2.hash('Pks@Palmsafe2023'),
        role: util.getAttributeName('pks').databaseRoleName,
        [util.getAttributeName('pks').tableName]: {
          create: {
            nama: 'Pabrik Kelapa Sawit Admin',
            alamat: 'Bandung',
            nomorTelepon: '081234567890',
          },
        },
      },
    });

    const { koperasi } = await prismaClient.akun.upsert({
      where: { email: 'koperasi.admin@palmsafe.com' },
      update: {},
      create: {
        email: 'koperasi.admin@palmsafe.com',
        password: await argon2.hash('Koperasi@Palmsafe2023'),
        role: util.getAttributeName('koperasi').databaseRoleName,
        [util.getAttributeName('koperasi').tableName]: {
          create: {
            nama: 'Koperasi Admin',
            alamat: 'Bandung',
            nomorTelepon: '081234567890',
          },
        },
      },
      select: {
        [util.getAttributeName('koperasi').tableName]: {
          select: {
            id: true,
          },
        },
      },
    });

    await prismaClient.akun.upsert({
      where: { email: 'petani.admin@palmsafe.com' },
      update: {},
      create: {
        email: 'petani.admin@palmsafe.com',
        password: await argon2.hash('Petani@Palmsafe2023'),
        role: util.getAttributeName('petani').databaseRoleName,
        [util.getAttributeName('petani').tableName]: {
          create: {
            idKoperasi: koperasi.id,
            nama: 'Petani Admin',
            alamat: 'Bandung',
            nomorTelepon: '081234567890',
          },
        },
      },
    });

    // Create a Fabric wallet for each admin organization
    await walletService.enrollAllAdmin();
  } catch (error) {
    console.error(error);
  }
};

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
