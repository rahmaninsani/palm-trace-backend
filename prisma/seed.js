import argon2 from 'argon2';
import prismaClient from '../src/applications/database.js';
import { createDefaultWallet } from '../src/applications/fabric-wallet.js';
import { identity } from '../src/config/constant.js';

const main = async () => {
  await prismaClient.akun.upsert({
    where: { email: 'admin_dinas' },
    update: {},
    create: {
      email: 'admin_dinas',
      password: await argon2.hash('admin_dinas'),
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
    where: { email: 'admin_pks' },
    update: {},
    create: {
      email: 'admin_pks',
      password: await argon2.hash('admin_pks'),
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
    where: { email: 'admin_koperasi' },
    update: {},
    create: {
      email: 'admin_koperasi',
      password: await argon2.hash('admin_koperasi'),
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
    where: { email: 'admin_petani' },
    update: {},
    create: {
      email: 'admin_petani',
      password: await argon2.hash('admin_petani'),
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
