import argon2 from 'argon2';
import prismaClient from '../src/applications/database.js';
import { createDefaultWallet } from '../src/applications/fabric-wallet.js';
import { identity } from '../src/config/constant.js';

const main = async () => {
  await prismaClient.akun.upsert({
    where: { email: 'dinas.ca@palmsafe.com' },
    update: {},
    create: {
      email: 'dinas.ca@palmsafe.com',
      password: await argon2.hash('Dinas_CA#2023'),
      role: identity.dinas.databaseRole,
      [identity.dinas.tableName]: {
        create: {
          nama: 'Dinas Certificate Authority',
          alamat: 'Bandung',
          nomorTelepon: '081234567890',
        },
      },
    },
  });

  await prismaClient.akun.upsert({
    where: { email: 'pks.ca@palmsafe.com' },
    update: {},
    create: {
      email: 'pks.ca@palmsafe.com',
      password: await argon2.hash('PKS_CA#2023'),
      role: identity.pks.databaseRole,
      [identity.pks.tableName]: {
        create: {
          nama: 'Pabrik Kelapa Sawit Certificate Authority',
          alamat: 'Bandung',
          nomorTelepon: '081234567890',
        },
      },
    },
  });

  const koperasi = await prismaClient.akun.upsert({
    where: { email: 'koperasi.ca@palmsafe.com' },
    update: {},
    create: {
      email: 'koperasi.ca@palmsafe.com',
      password: await argon2.hash('Koperasi_CA#2023'),
      role: identity.koperasi.databaseRole,
      [identity.koperasi.tableName]: {
        create: {
          nama: 'Koperasi Certificate Authority',
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
    where: { email: 'petani.ca@palmsafe.com' },
    update: {},
    create: {
      email: 'petani.ca@palmsafe.com',
      password: await argon2.hash('Petani_CA#2023'),
      role: identity.petani.databaseRole,
      [identity.petani.tableName]: {
        create: {
          idKoperasi: koperasi.koperasi.id,
          nama: 'Petani Certificate Authority',
          alamat: 'Bandung',
          nomorTelepon: '081234567890',
        },
      },
    },
  });

  // Create a Fabric wallet for each organization
  await createDefaultWallet();
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
