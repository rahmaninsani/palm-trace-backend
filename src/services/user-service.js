import prismaClient from '../applications/database.js';
import ResponseError from '../errors/response-error.js';
import validate from '../validations/validation.js';
import util from '../utils/util.js';

const findAll = async (request) => {
  const userType = util.getAttributeName(request.userType).tableName;
  const users = await prismaClient[userType].findMany({
    select: {
      idAkun: true,
      nama: true,
      alamat: true,
    },
    where: {
      NOT: [{ nama: 'Pabrik Kelapa Sawit Admin' }, { nama: 'Koperasi Admin' }, { nama: 'Petani Admin' }],
    },
  });

  if (users.length === 0) {
    throw new ResponseError(404, 'Data tidak ditemukan');
  }

  return users;
};

const findOne = async (request) => {
  const userType = util.getAttributeName(request.userType).tableName;
  const user = await prismaClient[userType].findFirst({
    select: {
      idAkun: true,
      nama: true,
      alamat: true,
    },
    where: {
      idAkun: request.idAkun,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'Data tidak ditemukan');
  }

  return user;
};

const userService = { findOne, findAll };
export default userService;
