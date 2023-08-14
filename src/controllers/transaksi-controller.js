import status from 'http-status';
import transaksiService from '../services/transaksi-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.idKontrak = req.params.idKontrak;
    request.idDeliveryOrder = req.params.idDeliveryOrder;

    const result = await transaksiService.create(user, request);
    res.status(status.CREATED).json({
      status: `${status.CREATED} ${status[status.CREATED]}`,
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
    request.idKontrak = req.params.idKontrak;
    request.idDeliveryOrder = req.params.idDeliveryOrder;
    request.idTransaksi = req.params.idTransaksi;

    const result = await transaksiService.confirm(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.idKontrak = req.params.idKontrak;
    request.idDeliveryOrder = req.params.idDeliveryOrder;

    const result = await transaksiService.findAll(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.idKontrak = req.params.idKontrak;
    request.idDeliveryOrder = req.params.idDeliveryOrder;
    request.idTransaksi = req.params.idTransaksi;

    const result = await transaksiService.findOne(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllByUser = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await transaksiService.findAllByUser(user);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllByUserThisWeek = async (req, res, next) => {
  try {
    const user = req.user;

    const result = await transaksiService.findAllByUserThisWeek(user);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findAllByUserLaporan = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.periode = req.query.periode;

    const result = await transaksiService.findAllByUserLaporan(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const transaksiController = {
  create,
  confirm,
  findAll,
  findOne,
  findAllByUser,
  findAllByUserThisWeek,
  findAllByUserLaporan,
};
export default transaksiController;
