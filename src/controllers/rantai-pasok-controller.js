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

const update = async (req, res, next) => {
  try {
    const user = req.user;
    const idKebun = req.params.idKebun;
    const request = req.body;
    request.id = idKebun;

    const result = await kebunService.update(user, request);
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

const rantaiPasokController = { createKontrak, update, get, getAll };
export default rantaiPasokController;
