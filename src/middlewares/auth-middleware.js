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

  req.user = akun;
  next();
};

const authMiddlewareRole = (allowedRoles) => async (req, res, next) => {
  const currentUserRole = util.getAttributeName(req.user.role).databaseRoleName;

  console.log('INIIIII =>>>', currentUserRole);

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

export { authMiddleware, authMiddlewareRole };
