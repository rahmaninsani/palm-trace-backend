import { v4 as uuidv4 } from 'uuid';

import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';

const channelName = 'referensi-harga-channel';
const chaincodeName = 'referensi-harga-chaincode';

const create = async (user, request) => {
  const payload = {
    id: uuidv4(),
    idDinas: user.id,
    umurTanam: request.umurTanam,
    harga: request.harga,
    tanggalPembaruan: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'Create',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = JSON.parse(submitTransaction.toString());

  return result;
};

const update = async (user, request) => {
  const payload = {
    id: request.id,
    idDinas: user.id,
    umurTanam: request.umurTanam,
    harga: request.harga,
    tanggalPembaruan: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'Update',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = JSON.parse(submitTransaction.toString());

  return result;
};

const get = async (user, idRefererensiHarga) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetHistoryById',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idRefererensiHarga);
  const result = JSON.parse(evaluateTransaction.toString());

  return result;
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
  const result = JSON.parse(evaluateTransaction.toString());

  return result;
};

const referensiHargaService = { create, update, get, getAll };

export default referensiHargaService;
