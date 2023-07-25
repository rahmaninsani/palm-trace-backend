import status from 'http-status';
import deliveryOrderService from '../services/delivery-order-service.js';

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.idKontrak = req.params.idKontrak;

    const result = await deliveryOrderService.create(user, request);
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

    const result = await deliveryOrderService.confirm(user, request);
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

    const result = await deliveryOrderService.findAll(user, request);
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

    const result = await deliveryOrderService.findOne(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const findOneHistory = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.idKontrak = req.params.idKontrak;
    request.idDeliveryOrder = req.params.idDeliveryOrder;

    const result = await deliveryOrderService.findOneHistory(user, request);
    res.status(status.OK).json({
      status: `${status.OK} ${status[status.OK]}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deliveryOrderController = { create, confirm, findAll, findOne, findOneHistory };
export default deliveryOrderController;
