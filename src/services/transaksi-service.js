import fabricClient from '../applications/fabric.js';

const create = async (req) => {
  const { body: request, user } = req;
  const values = [
    'K001',
    'D001',
    'TRX001',
    request.namaPks,
    request.namaKoperasi,
    request.namaPetani,
    request.hargaA,
    request.hargaB,
    request.tanggalA,
    request.tanggalB,
    request.status,
  ];
  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'transaksi-channel',
    chaincodeName: 'transaksi-chaincode',
    chaincodeMethodName: 'CreateAsset',
  };

  const submitTransaction = await fabricClient.submitTransaction(connection, values);
  return submitTransaction.toString() || 'Transaksi berhasil ditambahkan';
};

const get = async (req) => {
  const { params, user } = req;
  const values = [params.id];
  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'transaksi-channel',
    chaincodeName: 'transaksi-chaincode',
    chaincodeMethodName: 'ReadAsset',
  };

  const submitTransaction = await fabricClient.submitTransaction(connection, values);
  return JSON.parse(submitTransaction.toString());
};

const getAll = async (req) => {
  const { user } = req;
  const values = [];
  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'transaksi-channel',
    chaincodeName: 'transaksi-chaincode',
    chaincodeMethodName: 'GetAllAssets',
  };

  const submitTransaction = await fabricClient.submitTransaction(connection, values);
  return JSON.parse(submitTransaction.toString());
};

export default { create, get, getAll };
