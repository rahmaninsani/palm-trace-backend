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
    const request = req.body;
    request.id = req.params.idKebun;

    const result = await kebunService.update(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllByIdPetani = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await kebunService.getAllByIdPetani(user);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getHistoryById = async (req, res, next) => {
  try {
    const user = req.user;
    const idKebun = req.params.idKebun;

    const result = await kebunService.getHistoryById(user, idKebun);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const kebunController = { create, update, getAllByIdPetani, getHistoryById };
export default kebunController;
