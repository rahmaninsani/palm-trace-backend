import transaksiService from '../services/transaksi-service.js';

const create = async (req, res, next) => {
  // try {
  const result = await transaksiService.submit(req);
  res.status(200).json({
    data: result,
  });
  // } catch (error) {
  //   next(error);
  // }
};

export default { create };
