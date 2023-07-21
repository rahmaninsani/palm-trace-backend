import kebunService from '../services/kebun-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    const result = await kebunService.create(user, request);
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
    const idRefererensiHarga = req.params.idRefererensiHarga;

    const result = await kebunService.get(user, idRefererensiHarga);
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

    const result = await kebunService.getAll(user);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const kebunController = { create, update, get, getAll };
export default kebunController;
