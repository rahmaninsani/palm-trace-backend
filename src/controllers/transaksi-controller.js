import transaksiService from '../services/transaksi-service.js';

const create = async (req, res, next) => {
  try {
    const result = await transaksiService.submit(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await transaksiService.get(req);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await transaksiService.getAll(req);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { create, get, getAll };
