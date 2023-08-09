import { v4 as uuidv4 } from 'uuid';
import status from 'http-status';
import { File } from 'web3.storage';

import fabricClient from '../applications/fabric.js';
import web3StorageClient from '../applications/web3storage.js';
import time from '../utils/time.js';
import util from '../utils/util.js';
import ResponseError from '../errors/response-error.js';

const channelName = 'rantai-pasok-channel';
const chaincodeName = 'rantai-pasok-chaincode';

const create = async (user, request) => {
  const { body, files } = request;

  const web3Files = [];
  Object.entries(files).map(([key, value]) => {
    const fileName = util.generateFileName({ fieldName: key, originalName: value[0].originalname });
    const web3File = new File([value[0].buffer], fileName, { type: value[0].mimetype });
    web3Files.push(web3File);
    files[key] = fileName;
  });

  const cid = await web3StorageClient.put(web3Files);
  Object.entries(files).map(([key, value]) => {
    files[key] = `${cid}/${value}`;
  });

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
    alamat: body.alamat,
    latitude: body.latitude,
    longitude: body.longitude,
    luas: parseFloat(body.luas),
    kemampuanProduksiHarian: parseFloat(body.kemampuanProduksiHarian),
    nomorSuratKeteranganLurah: body.nomorSuratKeteranganLurah,
    cidSuratKeteranganLurah: files.suratKeteranganLurah,
    nomorSuratKeteranganGantiRugi: body.nomorSuratKeteranganGantiRugi,
    cidSuratKeteranganGantiRugi: files.suratKeteranganGantiRugi,
    nomorSertifikatHakMilik: body.nomorSertifikatHakMilik,
    cidSertifikatHakMilik: files.sertifikatHakMilik,
    nomorSuratTandaBudidaya: body.nomorSuratTandaBudidaya,
    cidSuratTandaBudidaya: files.suratTandaBudidaya,
    nomorSertifikatRspo: body.nomorSertifikatRspo,
    cidSertifikatRspo: files.sertifikatRspo,
    nomorSertifikatIspo: body.nomorSertifikatIspo,
    cidSertifikatIspo: files.sertifikatIspo,
    nomorSertifikatIscc: body.nomorSertifikatIscc,
    cidSertifikatIscc: files.sertifikatIscc,
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

  return resultJSON.data.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
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
