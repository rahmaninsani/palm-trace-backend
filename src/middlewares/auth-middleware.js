import prismaClient from '../applications/database.js';

const authMiddleware = async (req, res, next) => {
  const userEmail = req.session.userEmail;

  if (!userEmail) {
    return res
      .status(401)
      .json({
        errors: 'Unauthorized',
      })
      .end();
  }

  const akun = await prismaClient.$queryRaw`
    SELECT BIN_TO_UUID(id) as id, email, role
    FROM akun
    WHERE email = ${userEmail}
    LIMIT 1
  `;

  if (!akun || !akun[0]) {
    return res
      .status(401)
      .json({
        errors: 'Unauthorized',
      })
      .end();
  }

  req.user = akun[0];
  next();
};

export { authMiddleware };
