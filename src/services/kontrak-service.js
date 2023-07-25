import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import transaction from '../utils/transaction-code.js';
import ResponseError from '../errors/response-error.js';
import util from '../utils/util.js';
import statusRantaiPasok from '../constant/status-rantai-pasok.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakCreate',
  };

  const payload = {
    id: uuidv4(),
    idPks: user.id,
    idKoperasi: request.idKoperasi,
    Nomor: transaction.generateTransactionCode('KONTRAK'),
    tanggalPembuatan: time.getCurrentTime(),
    tanggalMulai: request.tanggalMulai,
    tanggalSelesai: request.tanggalSelesai,
    kuantitas: request.kuantitas,
    harga: request.harga,
    createdAt: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.CREATED) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const confirm = async (user, request) => {
  const kontrakPrev = await findOne(user, request.idKontrak);

  if (user.id !== kontrakPrev.idKoperasi) {
    throw new ResponseError(status.FORBIDDEN, 'Koperasi Anda bukan mitra pada kontrak ini');
  }

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakConfirm',
  };

  const payload = {
    id: request.idKontrak,
    status: request.status,
    pesan: request.pesan,
    tanggalRespons: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const findAll = async (user) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakFindAll',
  };

  const payload = {
    idPks: '',
    idKoperasi: '',
    status: -1,
  };

  if (user.role === util.getAttributeName('pks').roleName) {
    payload.idPks = user.id;
  }

  if (user.role === util.getAttributeName('koperasi').roleName) {
    payload.idKoperasi = user.id;
  }

  if (user.role === util.getAttributeName('petani').roleName) {
    payload.idKoperasi = user.idKoperasi;
    payload.status = statusRantaiPasok.penawaranKontrak.menungguKonfirmasi.number;
  }

  const result = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const findOne = async (user, idKontrak) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakFindOne',
  };

  const result = await fabricClient.evaluateTransaction(connection, idKontrak);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  const { data } = resultJSON;

  if (data.idPks !== user.id && data.idKoperasi !== user.id && data.idKoperasi !== user.idKoperasi) {
    throw new ResponseError(status.FORBIDDEN, 'Anda tidak memiliki akses ke data ini');
  }

  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    if (data.status !== statusRantaiPasok.penawaranKontrak.disetujui.string) {
      throw new ResponseError(status.FORBIDDEN, 'Anda tidak memiliki akses ke data ini');
    }
  }

  return data;
};

const findOneHistory = async (user, idKontrak) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakFindOneHistory',
  };

  const result = await fabricClient.evaluateTransaction(connection, idKontrak);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  const { data } = resultJSON;
  if (data[0].idPks !== user.id && data[0].idKoperasi !== user.id && data[0].idKoperasi !== user.idKoperasi) {
    throw new ResponseError(status.FORBIDDEN, 'Anda tidak memiliki akses ke data ini');
  }

  if (user.role === util.getAttributeName('petani').databaseRoleName) {
    if (data[0].status !== statusRantaiPasok.penawaranKontrak.disetujui.string) {
      throw new ResponseError(status.FORBIDDEN, 'Anda tidak memiliki akses ke data ini');
    }
  }

  return data;
};

const kontrakService = { create, confirm, findAll, findOne, findOneHistory };
export default kontrakService;
