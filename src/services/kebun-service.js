import { v4 as uuidv4 } from 'uuid';

import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';

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
    // TODO -> tanggalPembaruan: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'CreateKebun',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = JSON.parse(submitTransaction.toString());

  return result;
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
    // TODO -> tanggalPembaruan: time.getCurrentTime(),
  };
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'UpdateKebun',
  };
  const submitTransaction = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const result = JSON.parse(submitTransaction.toString());

  return result;
};

const get = async (user, idKebun) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetKebunHistoryById',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idKebun);
  const result = JSON.parse(evaluateTransaction.toString());

  return result;
};

const getAll = async (user) => {
  const idPetani = user.id;
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'GetAllKebunByIdPetani',
  };

  const evaluateTransaction = await fabricClient.evaluateTransaction(connection, idPetani);
  const result = evaluateTransaction.toString();

  return result;
};

const kebunService = { create, update, get, getAll };

export default kebunService;
