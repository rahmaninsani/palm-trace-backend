import argon2 from 'argon2';

import validate from '../validations/validation.js';
import { registerUserValidation, loginUserValidation, meValidation } from '../validations/auth-validation.js';
import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';

import { registerUserToFabric } from '../applications/fabric-wallet.js';
import { identity } from '../config/constant.js';

const register = async (request) => {
  const userRequest = validate(registerUserValidation, request);

  const { tableName, databaseRole, organizationName } = identity[userRequest.role];

  const countAkun = await prismaClient.akun.count({
    where: {
      email: userRequest.email,
    },
  });

  if (countAkun === 1) {
    throw new ResponseError(400, 'Email sudah terdaftar');
  }

  userRequest.password = await argon2.hash(userRequest.password);

  const data = {
    email: userRequest.email,
    password: userRequest.password,
    role: databaseRole,
    [tableName]: {
      create: {
        nama: userRequest.nama,
        alamat: userRequest.alamat,
        nomorTelepon: userRequest.nomorTelepon,
      },
    },
  };

  if (userRequest.role === 'petani') {
    const { id } = await prismaClient.koperasi.findFirst({
      where: {
        nama: 'Koperasi Default',
      },
      select: {
        id: true,
      },
    });
    data.petani.create.idKoperasi = id;
  }

  const akunUser = await prismaClient.akun.create({
    data,
    select: {
      [tableName]: {
        select: {
          nama: true,
        },
      },
      email: true,
      role: true,
    },
  });

  if (akunUser === null) {
    throw new ResponseError(500, 'Gagal membuat akun');
  }

  const hlf = await registerUserToFabric(userRequest.email, organizationName);
  console.log(hlf);

  return {
    nama: akunUser[tableName].nama,
    email: akunUser.email,
    role: akunUser.role,
  };
};

const login = async (session, request) => {
  const userRequest = validate(loginUserValidation, request);

  const akun = await prismaClient.akun.findUnique({
    where: {
      email: userRequest.email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!akun) {
    throw new ResponseError(404, 'User tidak ditemukan');
  }

  const isPasswordValid = await argon2.verify(akun.password, userRequest.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Email atau password salah');
  }

  const { tableName, databaseRole, organizationName } = identity[userRequest.role];
  const user = await prismaClient[tableName].findUnique({
    where: {
      idAkun: akun.id,
    },
    select: {
      nama: true,
    },
  });

  session.userEmail = akun.email;

  return {
    nama: user.nama,
    email: akun.email,
    role: akun.role,
  };
};

const me = async (email) => {
  email = validate(meValidation, email);

  const akun = await prismaClient.akun.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (!akun) {
    throw new ResponseError(404, 'User tidak ditemukan');
  }

  const { tableName, databaseRole, organizationName } = identity[akun.role];
  const user = await prismaClient[tableName].findUnique({
    where: {
      idAkun: akun.id,
    },
    select: {
      nama: true,
    },
  });

  return {
    nama: user.nama,
    email: akun.email,
    role: akun.role,
  };
};

const logout = async (session) => {
  session.destroy((error) => {
    if (error) {
      throw new ResponseError(400, 'Logout gagal');
    }
  });
};

export default { register, login, me, logout };
