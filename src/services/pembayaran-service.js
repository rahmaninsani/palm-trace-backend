import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import ResponseError from '../errors/response-error.js';
import transaction from '../utils/transaction-code.js';
import util from '../utils/util.js';
import statusRantaiPasok from '../constant/status-rantai-pasok.js';

import transaksiService from './transaksi-service.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const payload = {
    id: uuidv4(),
    idTransaksi: request.idTransaksi,
    nomor: transaction.generateTransactionCode('PEMBAYARAN'),
    tanggal: time.getCurrentTime(),
    jumlah: request.jumlah,
    hashBukti: `${transaction.generateTransactionCode('BUKTI_BAYAR')}`,
    createdAt: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'PembayaranCreate',
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.CREATED) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  if (user.role === util.getAttributeName('pks').databaseRoleName) {
    const updateStatusRequest = {
      idTransaksi: request.idTransaksi,
      status: statusRantaiPasok.transaksi.dibayarPks.number,
      updatedAt: time.getCurrentTime(),
    };

    await transaksiService.updateStatus(user, updateStatusRequest);
  }

  if (user.role === util.getAttributeName('koperasi').databaseRoleName) {
    const updateStatusRequest = {
      idTransaksi: request.idTransaksi,
      status: statusRantaiPasok.transaksi.seleseai.number,
      updatedAt: time.getCurrentTime(),
    };

    await transaksiService.updateStatus(user, updateStatusRequest);
  }

  return resultJSON.data;
};

const findAll = async (user, request) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'PembayaranFindAll',
  };

  const payload = {
    idTransaksi: request.idTransaksi,
  };

  const result = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const pembayaranService = { create, findAll };
export default pembayaranService;
