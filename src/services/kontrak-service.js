import { v4 as uuidv4 } from 'uuid';

import prismaClient from '../applications/database.js';
import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import transaction from '../utils/transaction-code.js';
import ResponseError from '../errors/response-error.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
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
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakCreate',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kontrak tidak ditemukan');
  }

  return JSON.parse(result);
};

const confirm = async (user, request) => {
  const payload = {
    id: request.id,
    idKoperasi: user.id,
    status: request.status,
    pesan: request.pesan,
    tanggalRespons: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakConfirm',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kontrak tidak ditemukan');
  }

  return JSON.parse(result);
};

const getAllByIdPks = async (user) => {
  const idPks = user.id;
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakGetAllByIdPks',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idPks);
  const result = evaluateTransaction.toString();
  if (result === '') {
    throw new ResponseError(404, 'Data kontrak tidak ditemukan');
  }

  return JSON.parse(result);
};

const getAllByIdKoperasi = async (user) => {
  const idKoperasi = user.id;
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakGetAllByIdKoperasi',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idKoperasi);
  const result = evaluateTransaction.toString();
  if (result === '') {
    throw new ResponseError(404, 'Data kontrak tidak ditemukan');
  }

  return JSON.parse(result);
};

const getAllForPetani = async (user) => {
  const petaniWithKoperasi = await prismaClient.petani.findFirst({
    where: {
      idAkun: user.id,
    },
    include: {
      koperasi: {
        select: {
          idAkun: true,
        },
      },
    },
  });

  const idKoperasi = petaniWithKoperasi.koperasi?.idAkun;

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KontrakGetAllForPetani',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idKoperasi);
  const result = evaluateTransaction.toString();
  if (result === '') {
    throw new ResponseError(404, 'Data kontrak tidak ditemukan');
  }

  return JSON.parse(result);
};

const kontrakService = { create, confirm, getAllByIdPks, getAllByIdKoperasi, getAllForPetani };
export default kontrakService;
