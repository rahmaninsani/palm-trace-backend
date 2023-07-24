import kontrakService from '../services/kontrak-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;

    const result = await kontrakService.create(user, request);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const confirm = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.id = req.params.idKontrak;

    const result = await kontrakService.confirm(user, request);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllByIdPks = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await kontrakService.getAllByIdPks(user);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllByIdKoperasi = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await kontrakService.getAllByIdKoperasi(user);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllForPetani = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await kontrakService.getAllForPetani(user);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const kontrakController = { create, confirm, getAllByIdPks, getAllByIdKoperasi, getAllForPetani };
export default kontrakController;
