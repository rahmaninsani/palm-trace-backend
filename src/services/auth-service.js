import argon2 from 'argon2';

import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';
import validate from '../validations/validation.js';
import { registerUserValidation, loginUserValidation, meValidation } from '../validations/auth-validation.js';
import util from '../utils/util.js';

import walletService from './wallet-service.js';

const register = async (request) => {
  const userRequest = validate(registerUserValidation, request);
  const { tableName, databaseRoleName, roleName, organizationName, affiliationName } = util.getAttributeName(
    userRequest.role
  );

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
    role: databaseRoleName,
    [tableName]: {
      create: {
        nama: userRequest.nama,
        alamat: userRequest.alamat,
        nomorTelepon: userRequest.nomorTelepon,
      },
    },
  };

  if (roleName === 'petani') {
    const { id } = await prismaClient.koperasi.findFirst({
      where: {
        nama: 'Koperasi Admin',
      },
      select: {
        id: true,
      },
    });
    data.petani.create.idKoperasi = id;
  }

  // Register to database
  const userAccount = await prismaClient.akun.create({
    data,
    select: {
      [tableName]: {
        select: {
          nama: true,
        },
      },
      id: true,
      email: true,
    },
  });

  if (userAccount === null) {
    throw new ResponseError(500, 'Gagal membuat akun');
  }

  // Register and enroll to Fabric
  await walletService.registerEnrollUser(userAccount.id, affiliationName, organizationName);

  return {
    nama: userAccount[tableName].nama,
    email: userAccount.email,
    role: roleName,
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
    throw new ResponseError(404, 'Akun pengguna tidak terdaftar');
  }

  const isPasswordValid = await argon2.verify(akun.password, userRequest.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Email atau password salah');
  }

  const { tableName, roleName } = util.getAttributeName(akun.role);
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
    role: roleName,
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
    throw new ResponseError(404, 'Akun pengguna tidak terdaftar');
  }

  const { tableName, roleName } = util.getAttributeName(akun.role);
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
    role: roleName,
  };
};

const logout = async (session) => {
  session.destroy((error) => {
    if (error) {
      throw new ResponseError(400, 'Logout gagal');
    }
  });
};

const authService = { register, login, me, logout };
export default authService;
