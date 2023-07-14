import fabricTransaction from '../applications/fabric.js';

const create = async (req) => {
  const { body: request, user } = req;
  const values = [
    'K999',
    'D999',
    'TRX986',
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
  const transaction = await fabricTransaction(connection);
  const transactionResult = await transaction.submit(...values);

  return transactionResult.toString() || 'Transaksi berhasil ditambahkan';
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
  const transaction = await fabricTransaction(connection);
  const transactionResult = await transaction.submit(...values);

  return JSON.parse(transactionResult.toString());
};

const getAll = async (req) => {
  const { user } = req;

  const connection = {
    email: user.email,
    role: user.role,
    channelName: 'transaksi-channel',
    chaincodeName: 'transaksi-chaincode',
    chaincodeMethodName: 'GetAllAssets',
  };
  const transaction = await fabricTransaction(connection);
  const transactionResult = await transaction.submit([]);

  return JSON.parse(transactionResult.toString());
};

export default { create, get, getAll };
