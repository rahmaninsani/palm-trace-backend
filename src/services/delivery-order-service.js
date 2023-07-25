import { v4 as uuidv4 } from 'uuid';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import transaction from '../utils/transaction-code.js';
import ResponseError from '../errors/response-error.js';

import util from '../utils/util.js';

import kontrakService from './kontrak-service.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const kontrak = await kontrakService.getOneById(user, request);

  if (kontrak.idPks !== user.id) {
    throw new ResponseError(401, 'Unauthorized');
  }

  if (kontrak.status !== 'Disetujui') {
    throw new ResponseError(400, 'Kontrak belum disetujui');
  }

  if (kontrak.kuantitasTersisa < request.kuantitas) {
    throw new ResponseError(400, 'Kuantitas delivery order melebihi kuantitas kontrak');
  }

  if (kontrak.tanggalSelesai < time.getCurrentTime()) {
    throw new ResponseError(400, 'Kontrak sudah berakhir');
  }

  // Cek apakah delivery order sudah pernah dibuat

  const payload = {
    id: uuidv4(),
    idKontrak: request.idKontrak,
    Nomor: transaction.generateTransactionCode('DO'),
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

  return result;
};

const confirm = async (user, request) => {
  // Cek apakah delivery order sudah pernah dibuat/ada

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderConfirm',
  };

  const payload = {
    id: request.idDeliveryOrder,
    idKoperasi: user.id,
    status: request.status,
    pesan: request.pesan,
    tanggalRespons: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));

  return result;
};

const findAll = async (user, request) => {
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

  const petaniRole = util.getAttributeName('petani').roleName;
  if (user.role == petaniRole) {
    payload.status = 1;
  }

  const result = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));

  return JSON.parse(result.toString());
};

const findOne = async (user, request) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'DeliveryOrderFindOne',
  };

  const idDeliveryOrder = request.idDeliveryOrder;

  const result = await fabricClient.evaluateTransaction(connection, idDeliveryOrder);
  return result;
};

const deliveryOrderService = { create, confirm, findAll, findOne };
export default deliveryOrderService;
