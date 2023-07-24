import { v4 as uuidv4 } from 'uuid';

import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import ResponseError from '../errors/response-error.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const payload = {
    id: uuidv4(),
    idPetani: user.id,
    alamat: request.alamat,
    latitude: request.latitude,
    longitude: request.longitude,
    luas: request.luas,
    nomorRspo: request.nomorRspo,
    sertifikatRspo: request.sertifikatRspo,
    createdAt: time.getCurrentTime(),
    updatedAt: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunCreate',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const update = async (user, request) => {
  const payload = {
    id: request.id,
    idPetani: user.id,
    alamat: request.alamat,
    latitude: request.latitude,
    longitude: request.longitude,
    luas: request.luas,
    nomorRspo: request.nomorRspo,
    sertifikatRspo: request.sertifikatRspo,
    updatedAt: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunUpdate',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = submitTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const getAllByIdPetani = async (user) => {
  const idPetani = user.id;
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunGetAllByIdPetani',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idPetani);
  const result = evaluateTransaction.toString();
  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const getHistoryById = async (user, idKebun) => {
  const payload = {
    idPetani: user.id,
    idKebun,
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunGetHistoryById',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, JSON.stringify(payload));
  const result = evaluateTransaction.toString();

  if (result === '') {
    throw new ResponseError(404, 'Data kebun tidak ditemukan');
  }

  return JSON.parse(result);
};

const kebunService = { create, update, getAllByIdPetani, getHistoryById };
export default kebunService;
