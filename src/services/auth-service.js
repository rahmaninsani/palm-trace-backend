import argon2 from 'argon2';

import validate from '../validations/validation.js';
import { registerUserValidation } from '../validations/auth-validation.js';
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

  return prismaClient.akun.create({
    data: {
      email: user.email,
      password: user.password,
      role: user.role,
      koperasi: {
        create: {
          nama: user.nama,
          alamat: user.alamat,
          nomorTelepon: user.nomorTelepon,
        },
      },
    },
    select: {
      koperasi: {
        select: {
          nama: true,
        },
      },
      email: true,
      role: true,
    },
  });
};

export default { register };
