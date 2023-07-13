import argon2 from 'argon2';
import prismaClient from '../src/applications/database.js';
import { createOrganizationAdminWallet } from '../src/applications/fabric-wallet.js';
import { identity } from '../src/config/constant.js';

const main = async () => {
  await prismaClient.akun.upsert({
    where: { email: 'dinas.admin@palmsafe.com' },
    update: {},
    create: {
      email: 'dinas.admin@palmsafe.com',
      password: await argon2.hash('Dinas@Palmsafe2023'),
      role: identity.dinas.databaseRole,
      [identity.dinas.tableName]: {
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
      role: identity.pks.databaseRole,
      [identity.pks.tableName]: {
        create: {
          nama: 'Pabrik Kelapa Sawit Admin',
          alamat: 'Bandung',
          nomorTelepon: '081234567890',
        },
      },
    },
  });

  const koperasi = await prismaClient.akun.upsert({
    where: { email: 'koperasi.admin@palmsafe.com' },
    update: {},
    create: {
      email: 'koperasi.admin@palmsafe.com',
      password: await argon2.hash('Koperasi@Palmsafe2023'),
      role: identity.koperasi.databaseRole,
      [identity.koperasi.tableName]: {
        create: {
          nama: 'Koperasi Admin',
          alamat: 'Bandung',
          nomorTelepon: '081234567890',
        },
      },
    },
    select: {
      [identity.koperasi.tableName]: {
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
      role: identity.petani.databaseRole,
      [identity.petani.tableName]: {
        create: {
          idKoperasi: koperasi.koperasi.id,
          nama: 'Petani Admin',
          alamat: 'Bandung',
          nomorTelepon: '081234567890',
        },
      },
    },
  });

  // Create a Fabric wallet for each organization
  await createOrganizationAdminWallet();
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
