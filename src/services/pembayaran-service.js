import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';
import { File } from 'web3.storage';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import web3StorageClient from '../applications/web3storage.js';
import time from '../utils/time.js';
import ResponseError from '../errors/response-error.js';
import transaction from '../utils/transaction-code.js';
import util from '../utils/util.js';
import statusRantaiPasok from '../constant/status-rantai-pasok.js';

import transaksiService from './transaksi-service.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const { body, file } = request;

  const fileName = util.generateFileName({ fieldName: file.fieldname, originalName: file.originalname });
  const web3File = new File([file.buffer], fileName, { type: file.mimetype });

  const cid = await web3StorageClient.put([web3File]);
  const cidBuktiPembayaran = `${cid}/${fileName}`;

  const payload = {
    id: uuidv4(),
    idTransaksi: body.idTransaksi,
    jenisUser: user.role,
    nomor: transaction.generateTransactionCode('PEMBAYARAN'),
    tanggal: time.getCurrentTime(),
    // jumlahPembayaran: parseFloat(body.jumlahPembayaran),
    jumlahPembayaran: body.jumlahPembayaran, //testing
    namaBankPengirim: body.namaBankPengirim,
    nomorRekeningPengirim: body.nomorRekeningPengirim,
    namaPengirim: body.namaPengirim,
    namaBankPenerima: body.namaBankPenerima,
    nomorRekeningPenerima: body.nomorRekeningPenerima,
    namaPenerima: body.namaPenerima,
    cidBuktiPembayaran: cidBuktiPembayaran,
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

  const updateStatusRequest = {
    idTransaksi: body.idTransaksi,
    status: -1,
    updatedAt: time.getCurrentTime(),
  };

  if (user.role === util.getAttributeName('pks').databaseRoleName) {
    updateStatusRequest.status = statusRantaiPasok.transaksi.dibayarPks.number;
    await transaksiService.updateStatus(user, updateStatusRequest);
  }

  if (user.role === util.getAttributeName('koperasi').databaseRoleName) {
    updateStatusRequest.status = statusRantaiPasok.transaksi.selesai.number;
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
