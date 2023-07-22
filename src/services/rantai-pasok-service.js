import { v4 as uuidv4 } from 'uuid';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import transaction from '../utils/transaction-code.js';
import ResponseError from '../errors/response-error.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const createKontrak = async (user, request) => {
  const payload = {
    id: uuidv4(),
    Nomor: transaction.generateTransactionCode('KONTRAK'),
    tanggalPembuatan: time.getCurrentTime(),
    tanggalMulai: request.tanggalMulai,
    tanggalSelesai: request.tanggalSelesai,
    idPks: user.id,
    idKoperasi: request.idKoperasi,
    kuantitas: request.kuantitas,
    harga: request.harga,
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'CreateKontrak',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kontrak tidak ditemukan');
  }

  return JSON.parse(result);
};

const confirmContractByKoperasi = async (user, request) => {
  const payload = {
    idPks: request.idPks,
    idKoperasi: user.id,
    idKontrak: request.idKontrak,
    status: request.status,
    pesan: request.pesan,
    tanggalRespons: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'ConfirmContractByKoperasi',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const get = async (user, idKebun) => {
  const payload = {
    idPetani: user.id,
    idKebun,
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetkebunHistoryById',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));
  const result = evaluateTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const getAll = async (user) => {
  const idPetani = user.id;
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetAllkebunByIdPetani',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idPetani);
  const result = evaluateTransaction.toString();
  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const rantaiPasokService = { createKontrak, confirmContractByKoperasi, get, getAll };

export default rantaiPasokService;
