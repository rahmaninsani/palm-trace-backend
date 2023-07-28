import status from 'http-status';
import pengirimanService from '../services/pengiriman-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.idKontrak = req.params.idKontrak;
    request.idDeliveryOrder = req.params.idDeliveryOrder;
    request.idTransaksi = req.params.idTransaksi;

    const result = await pengirimanService.create(user, request);
    res.status(status.CREATED).json({
      status: `${status.CREATED} ${status[status.CREATED]}`,
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
    request.idTransaksi = req.params.idTransaksi;

    const result = await pengirimanService.findAll(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const pengirimanController = { create, findAll };
export default pengirimanController;
