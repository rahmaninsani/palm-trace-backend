import argon2 from 'argon2';

import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';
import validate from '../validations/validation.js';
import util from '../utils/util.js';

const update = async (user, request) => {
  const akunPrev = await prismaClient.akun.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!akunPrev) {
    throw new ResponseError(404, 'Akun tidak ditemukan');
  }

  const userType = util.getAttributeName(user.role).tableName;
  const userPrev = await prismaClient[userType].findFirst({
    where: {
      idAkun: user.id,
    },
  });

  if (!userPrev) {
    throw new ResponseError(404, 'Pengguna tidak ditemukan');
  }

  const newUser = {
    nama: request.nama,
    alamat: request.alamat,
    nomorTelepon: request.nomorTelepon,
  };

  if (
    user.role === util.getAttributeName('pks').databaseRoleName ||
    user.role === util.getAttributeName('koperasi').databaseRoleName
  ) {
    newUser.siup = request.siup;
  }

  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    newUser.nik = request.nik;
    if (!akunPrev.profilLengkap) newUser.idKoperasi = request.idKoperasi;
  }

  if (user.role !== util.getAttributeName('dinas').databaseRoleName) {
    newUser.namaBank = request.namaBank;
    newUser.nomorRekening = request.nomorRekening;
  }

  const updatedUser = await prismaClient[userType].update({
    where: {
      idAkun: user.id,
    },
    data: newUser,
  });

  if (!updatedUser) {
    throw new ResponseError(500, 'Gagal memperbarui data pengguna');
  }

  const newAkun = {
    email: request.email,
    profilLengkap: true,
  };

  if (request.password) {
    newAkun.password = await argon2.hash(request.password);
  }

  const updatedAkun = await prismaClient.akun.update({
    where: {
      id: user.id,
    },
    data: newAkun,
  });

  if (!updatedAkun) {
    throw new ResponseError(500, 'Gagal memperbarui data akun');
  }

  const updated = await findOneProfil(user);

  return updated;
};

const findAll = async (request) => {
  const userType = util.getAttributeName(request.userType).tableName;
  const users = await prismaClient[userType].findMany({
    select: {
      id: true,
      idAkun: true,
      nama: true,
      alamat: true,
    },
    where: {
      NOT: [{ nama: 'Pabrik Kelapa Sawit Admin' }, { nama: 'Koperasi Admin' }, { nama: 'Petani Admin' }],
    },
  });

  if (users.length === 0) {
    throw new ResponseError(404, 'Data pengguna tidak ditemukan');
  }

  return users;
};

const findOneProfil = async (user) => {
  const userType = util.getAttributeName(user.role).tableName;
  const userPrev = await prismaClient[userType].findFirst({
    where: {
      idAkun: user.id,
    },
  });

  if (!userPrev) {
    throw new ResponseError(404, 'Data pengguna tidak ditemukan');
  }

  const { id, idAkun, ...updatedUserWithoutId } = userPrev;
  let response = {
    ...updatedUserWithoutId,
  };

  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    const { idKoperasi, ...updatedUserWithoutIdKoperasi } = updatedUserWithoutId;

    const koperasi = await prismaClient.koperasi.findFirst({
      where: {
        id: idKoperasi,
      },
      select: {
        id: true,
        nama: true,
        alamat: true,
      },
    });

    if (!koperasi) {
      throw new ResponseError(404, 'Koperasi tidak ditemukan');
    }

    response = {
      ...updatedUserWithoutIdKoperasi,
      koperasi: {
        id: koperasi.id,
        nama: koperasi.nama,
        alamat: koperasi.alamat,
      },
    };
  }

  return {
    ...response,
    email: user.email,
    role: util.getAttributeName(user.role).roleName,
  };
};

const findOne = async (request) => {
  const userType = util.getAttributeName(request.userType).tableName;
  const user = await prismaClient[userType].findFirst({
    where: {
      idAkun: request.idAkun,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'Data pengguna tidak ditemukan');
  }

  const { id, password, ...userWithoutIdPassword } = user;

  return {
    ...userWithoutIdPassword,
  };
};

const userService = { update, findAll, findOne, findOneProfil };
export default userService;
