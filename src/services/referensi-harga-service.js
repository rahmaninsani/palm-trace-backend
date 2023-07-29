import { v4 as uuidv4 } from 'uuid';

import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import ResponseError from '../errors/response-error.js';

const channelName = 'referensi-harga-channel';
const chaincodeName = 'referensi-harga-chaincode';

const create = async (user, request) => {
  const payload = {
    id: uuidv4(),
    idDinas: user.id,
    umurTanam: request.umurTanam,
    harga: request.harga,
    tanggalPembaruan: time.getCurrentTime(),
    createdAt: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'Create',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data referensi harga tidak ditemukan');
  }

  return JSON.parse(result);
};

const update = async (user, request) => {
  const payload = {
    id: request.id,
    idDinas: user.id,
    umurTanam: request.umurTanam,
    harga: request.harga,
    tanggalPembaruan: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'Update',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data referensi harga tidak ditemukan');
  }

  return JSON.parse(result);
};

const getAll = async (user) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetAll',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection);
  const result = evaluateTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data referensi harga tidak ditemukan');
  }

  const parsedResult = JSON.parse(result);
  const sortedResult = parsedResult.sort((a, b) => a.umurTanam - b.umurTanam);

  return sortedResult;
};

const getHistoryById = async (user, idRefererensiHarga) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetHistoryById',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idRefererensiHarga);
  const result = evaluateTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data referensi harga tidak ditemukan');
  }

  return JSON.parse(result);
};

const referensiHargaService = { create, update, getAll, getHistoryById };
export default referensiHargaService;
