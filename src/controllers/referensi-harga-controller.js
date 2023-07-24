import referensiHargaService from '../services/referensi-harga-service.js';

const createInitHelper = async (user, request) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await referensiHargaService.create(user, request);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

const createInit = async (req, res, next) => {
  try {
    const user = req.user;
    let data = [];

    const tahunAwal = 3;
    const tahunAkhir = 25;

    for (let index = tahunAwal; index <= tahunAkhir; index++) {
      const request = {
        umurTanam: index,
        harga: 0,
      };
      const result = await createInitHelper(user, request);
      data.push(result);
    }

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    const result = await referensiHargaService.create(user, request);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.id = req.params.idRefererensiHarga;

    const result = await referensiHargaService.update(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await referensiHargaService.getAll(user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getHistoryById = async (req, res, next) => {
  try {
    const user = req.user;
    const idRefererensiHarga = req.params.idRefererensiHarga;

    const result = await referensiHargaService.getHistoryById(user, idRefererensiHarga);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const referensiHargaController = { createInit, create, update, getAll, getHistoryById };
export default referensiHargaController;
