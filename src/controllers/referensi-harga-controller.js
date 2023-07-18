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

    const banyakData = 25;
    for (let index = 1; index <= banyakData; index++) {
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
    const idRefererensiHarga = req.params.idRefererensiHarga;
    const request = req.body;
    request.id = idRefererensiHarga;

    const result = await referensiHargaService.update(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const idRefererensiHarga = req.params.idRefererensiHarga;

    const result = await referensiHargaService.get(user, idRefererensiHarga);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
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

const referensiHargaController = { createInit, create, update, get, getAll };
export default referensiHargaController;
