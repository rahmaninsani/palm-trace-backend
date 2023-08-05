import status from 'http-status';

import prismaClient from '../applications/database.js';
import util from '../utils/util.js';

const authMiddleware = async (req, res, next) => {
  const userEmail = req.session.userEmail;

  if (!userEmail) {
    return res
      .status(status.UNAUTHORIZED)
      .json({
        status: `${status.UNAUTHORIZED} ${status[status.UNAUTHORIZED]}`,
      })
      .end();
  }

  const akun = await prismaClient.akun.findFirst({
    where: {
      email: userEmail,
    },
    select: {
      id: true,
      email: true,
      role: true,
      profilLengkap: true,
    },
  });

  if (!akun) {
    return res
      .status(status.UNAUTHORIZED)
      .json({
        status: `${status.UNAUTHORIZED} ${status[status.UNAUTHORIZED]}`,
      })
      .end();
  }

  const { url } = req;
  if (url !== '/api/users/me' && url !== '/api/users/logout') {
    if (!akun.profilLengkap) {
      return res
        .status(status.FORBIDDEN)
        .json({
          status: `${status.FORBIDDEN} ${status[status.FORBIDDEN]}`,
          message: 'Lengkapi profil Anda terlebih dahulu.',
        })
        .end();
    }
  }

  if (akun.role === util.getAttributeName('petani').databaseRoleName) {
    const petaniKoperasi = await prismaClient.petani.findFirst({
      where: {
        idAkun: akun.id,
      },
      include: {
        koperasi: {
          select: {
            idAkun: true,
          },
        },
      },
    });

    akun.idAkunKoperasi = petaniKoperasi.koperasi?.idAkun;
  }

  req.user = akun;

  next();
};

const authRoleMiddleware = (allowedRoles) => async (req, res, next) => {
  const currentUserRole = util.getAttributeName(req.user.role).databaseRoleName;

  if (!allowedRoles.includes(currentUserRole)) {
    return res
      .status(status.UNAUTHORIZED)
      .json({
        status: `${status.UNAUTHORIZED} ${status[status.UNAUTHORIZED]}`,
      })
      .end();
  }

  next();
};

const isLoggedInMiddleware = (req, res, next) => {
  if (req.session.userEmail) {
    return res
      .status(status.FORBIDDEN)
      .json({
        status: `${status.FORBIDDEN} ${status[status.FORBIDDEN]}`,
        message: 'You are already logged in. Please logout first.',
      })
      .end();
  }

  next();
};

export { authMiddleware, authRoleMiddleware, isLoggedInMiddleware };
