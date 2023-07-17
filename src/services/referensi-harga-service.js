import { v4 as uuidv4 } from 'uuid';

import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';

const create = async (req) => {
  const { body: request, user } = req;
  const payload = {
    id: uuidv4(),
    idDinas: user.id,
    umurTanam: request.umurTanam,
    harga: request.harga,
    tanggalPembaruan: time.getCurrentTime(),
  };
  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'referensi-harga-channel',
    chaincodeName: 'referensi-harga-chaincode',
    chaincodeMethodName: 'Create',
  };

  const submitTransaction = await fabricClient.submitTransaction(connection, payload);
  return {
    txnHash: submitTransaction.toString(),
  };
};

const get = async (req) => {
  const { params, user } = req;
  const payload = { id: params.id };
  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'referensi-harga-channel',
    chaincodeName: 'referensi-harga-chaincode',
    chaincodeMethodName: 'Get',
  };

  const submitTransaction = await fabricClient.submitTransaction(connection, payload);
  return JSON.parse(submitTransaction.toString());
};

const getAll = async (req) => {
  const { user } = req;
  const payload = {};
  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'referensi-harga-channel',
    chaincodeName: 'referensi-harga-chaincode',
    chaincodeMethodName: 'GetAll',
  };

  const submitTransaction = await fabricClient.submitTransaction(connection, payload);
  return JSON.parse(submitTransaction.toString());
};

const referensiHargaService = { create, get, getAll };

export default referensiHargaService;
