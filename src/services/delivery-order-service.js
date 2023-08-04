import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import transaction from '../utils/transaction-code.js';
import ResponseError from '../errors/response-error.js';
import util from '../utils/util.js';
import statusRantaiPasok from '../constant/status-rantai-pasok.js';

import kontrakService from './kontrak-service.js';
import userService from './user-service.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const kontrak = await kontrakService.findOne(user, request);

  if (kontrak.status !== 'Disetujui') {
    throw new ResponseError(status.BAD_REQUEST, 'Kontrak belum disetujui');
  }

  if (kontrak.kuantitasTersisa < request.kuantitas) {
    throw new ResponseError(status.BAD_REQUEST, 'Kuantitas delivery order melebihi kuantitas kontrak');
  }

  if (kontrak.tanggalSelesai < time.getCurrentTime()) {
    throw new ResponseError(status.BAD_REQUEST, 'Kontrak sudah berakhir');
  }

  const payload = {
    id: uuidv4(),
    idKontrak: request.idKontrak,
    nomor: transaction.generateTransactionCode('DO'),
    tanggalPembuatan: time.getCurrentTime(),
    periode: request.periode,
    kuantitas: request.kuantitas,
    harga: request.harga,
    rendemen: request.rendemen,
    createdAt: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderCreate',
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.CREATED) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const confirm = async (user, request) => {
  const deliveryOrderPrev = await findOne(user, request);

  if (deliveryOrderPrev.status === statusRantaiPasok.penawaranDeliveryOrder.disetujui.string) {
    throw new ResponseError(status.BAD_REQUEST, 'Delivery order sudah disetujui');
  }

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderConfirm',
  };

  const payload = {
    id: request.idDeliveryOrder,
    status: request.status,
    pesan: request.pesan,
    tanggalKonfirmasi: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const updateKuantitas = async (user, request) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderUpdateKuantitas',
  };

  const payload = {
    id: request.idDeliveryOrder,
    kuantitasTerpenuhi: request.kuantitasTerpenuhi,
    updatedAt: time.getCurrentTime(),
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const findAll = async (user, request) => {
  const kontrak = await kontrakService.findOne(user, request);

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderFindAll',
  };

  const payload = {
    idKontrak: request.idKontrak,
    status: -1,
  };

  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    payload.status = statusRantaiPasok.penawaranDeliveryOrder.disetujui.number;
  }

  const result = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  await Promise.all(
    resultJSON.data.map(async (deliveryOrder) => {
      const userRequest = {
        userType: 'koperasi',
        idAkun: kontrak.idKoperasi,
      };

      const koperasi = await userService.findOne(userRequest);

      deliveryOrder.namaKoperasi = koperasi.nama;
    })
  );

  return resultJSON.data;
};

const findOne = async (user, request) => {
  const kontrak = await kontrakService.findOne(user, request);

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderFindOne',
  };

  const result = await fabricClient.evaluateTransaction(connection, request.idDeliveryOrder);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  const { data } = resultJSON;
  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    if (data.status !== statusRantaiPasok.penawaranDeliveryOrder.disetujui.string) {
      throw new ResponseError(status.NOT_FOUND);
    }
  }

  const pks = await userService.findOne({
    userType: 'pks',
    idAkun: kontrak.idPks,
  });

  const koperasi = await userService.findOne({
    userType: 'koperasi',
    idAkun: kontrak.idKoperasi,
  });

  data.namaPks = pks.nama;
  data.namaKoperasi = koperasi.nama;

  return data;
};

const findOneHistory = async (user, request) => {
  await kontrakService.findOne(user, request);

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderFindOneHistory',
  };

  const result = await fabricClient.evaluateTransaction(connection, request.idDeliveryOrder);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  const { data } = resultJSON;
  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    if (data[0].status !== statusRantaiPasok.penawaranDeliveryOrder.disetujui.string) {
      throw new ResponseError(status.NOT_FOUND);
    }
  }

  return data;
};

const deliveryOrderService = { create, confirm, updateKuantitas, findAll, findOne, findOneHistory };
export default deliveryOrderService;
