import argon2 from 'argon2';

import validate from '../validations/validation.js';
import { registerUserValidation, loginUserValidation } from '../validations/auth-validation.js';
import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.akun.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, 'Email sudah terdaftar');
  }

  user.password = await argon2.hash(user.password);
  const tableName = user.role === 'pks' ? 'pabrikKelapaSawit' : user.role;

  return prismaClient.akun.create({
    data: {
      email: user.email,
      password: user.password,
      role: user.role,
      [tableName]: {
        create: {
          nama: user.nama,
          alamat: user.alamat,
          nomorTelepon: user.nomorTelepon,
        },
      },
    },
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
};

const login = async (session, request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.akun.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'User tidak ditemukan');
  }

  const isPasswordValid = await argon2.verify(user.password, loginRequest.password);
  if (!isPasswordValid) {
    throw new ResponseError(401, 'Email atau password salah');
  }

  session.userEmail = user.email;
  return {
    email: user.email,
  };
};

export default { register, login };
