import rantaiPasokService from '../services/rantai-pasok-service.js';

const createKontrak = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    const result = await rantaiPasokService.createKontrak(user, request);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const confirmContractByKoperasi = async (req, res, next) => {
  try {
    const user = req.user;
    const idKontrak = req.params.idKontrak;
    const request = req.body;
    request.idKontrak = idKontrak;

    const result = await rantaiPasokService.confirmContractByKoperasi(user, request);
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
    const idKebun = req.params.idKebun;

    const result = await kebunService.get(user, idKebun);
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

    const result = await kebunService.getAll(user);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const rantaiPasokController = { createKontrak, confirmContractByKoperasi, get, getAll };
export default rantaiPasokController;
