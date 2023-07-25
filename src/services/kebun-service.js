import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';

import fabricClient from '../applications/fabric.js';
import time from '../utils/time.js';
import ResponseError from '../errors/response-error.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunCreate',
  };

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

  const result = await fabricClient.submitTransaction(connection, JSON.stringify(payload));
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.CREATED) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const update = async (user, request) => {
  const kebunPrev = await findOne(user, request.idKebun);

  if (user.id !== kebunPrev.idPetani) {
    throw new ResponseError(status.FORBIDDEN, 'Anda bukan pemilik kebun ini');
  }

  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunUpdate',
  };

  const payload = {
    id: request.idKebun,
    alamat: request.alamat,
    latitude: request.latitude,
    longitude: request.longitude,
    luas: request.luas,
    nomorRspo: request.nomorRspo,
    sertifikatRspo: request.sertifikatRspo,
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
    chaincodeMethodName: 'KebunFindAll',
  };

  const idPetani = user.id;

  const result = await fabricClient.evaluateTransaction(connection, idPetani);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const findOne = async (user, idKebun) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunFindOne',
  };

  const result = await fabricClient.evaluateTransaction(connection, idKebun);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const findOneHistory = async (user, idKebun) => {
  const connection = {
    userId: user.id,
    role: user.role,
    channelName,
    chaincodeName,
    chaincodeMethodName: 'KebunFindOneHistory',
  };

  const result = await fabricClient.evaluateTransaction(connection, idKebun);
  const resultJSON = JSON.parse(result.toString());

  if (resultJSON.status !== status.OK) {
    throw new ResponseError(resultJSON.status, resultJSON.message);
  }

  return resultJSON.data;
};

const kebunService = { create, update, findAll, findOne, findOneHistory };
export default kebunService;
