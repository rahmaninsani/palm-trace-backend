import referensiHargaService from '../services/referensi-harga-service.js';

const create = async (req, res, next) => {
  try {
    const result = await referensiHargaService.create(req);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await referensiHargaService.get(req);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await referensiHargaService.getAll(req);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const referensiHargaController = { create, get, getAll };
export default referensiHargaController;
