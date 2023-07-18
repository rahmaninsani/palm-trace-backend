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
      .status(401)
      .json({
        errors: 'Unauthorized',
      })
      .end();
  }

  req.user = akun;
  next();
};

export { authMiddleware };
