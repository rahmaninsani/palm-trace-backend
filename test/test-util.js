import prismaClient from '../src/applications/database.js';

export const removeTestUser = async () => {
  await prismaClient.koperasi.deleteMany({
    where: {
      nama: 'Koperasi Test',
    },
  });

  await prismaClient.akun.deleteMany({
    where: {
      email: 'test@example.com',
    },
  });
};

export default { removeTestUser };
